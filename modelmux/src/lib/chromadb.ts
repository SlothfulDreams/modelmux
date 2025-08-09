export class ChromaDBService {
  private collectionName: string;
  private baseUrl = 'http://localhost:8000';
  private tenant = 'default_tenant';
  private database = 'default_database';
  private collectionId?: string;

  constructor(collectionName = 'documents') {
    this.collectionName = collectionName;
  }

  private async makeRequest(endpoint: string, method = 'GET', body?: any) {
    const url = `${this.baseUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ChromaDB request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : {};
  }

  async getOrCreateCollection() {
    try {
      // Try to get the collection first
      const collections = await this.makeRequest(
        `/api/v2/tenants/${this.tenant}/databases/${this.database}/collections`
      );
      
      const existingCollection = collections.find((c: any) => c.name === this.collectionName);
      if (existingCollection) {
        this.collectionId = existingCollection.id;
        return existingCollection;
      }

      // Create the collection if it doesn't exist
      const newCollection = await this.makeRequest(
        `/api/v2/tenants/${this.tenant}/databases/${this.database}/collections`,
        'POST',
        {
          name: this.collectionName,
          get_or_create: true
        }
      );
      this.collectionId = newCollection.id;
      return newCollection;
    } catch (error) {
      console.error('Failed to get or create collection:', error);
      throw error;
    }
  }

  async addDocuments(documents: string[], metadatas?: object[], ids?: string[]) {
    await this.getOrCreateCollection();
    
    const documentIds = ids || documents.map((_, index) => `doc_${Date.now()}_${index}`);
    
    await this.makeRequest(
      `/api/v2/tenants/${this.tenant}/databases/${this.database}/collections/${this.collectionId}/add`,
      'POST',
      {
        documents,
        ids: documentIds,
        metadatas: metadatas || [],
      }
    );

    return documentIds;
  }

  async queryDocuments(queryText: string, nResults = 5) {
    await this.getOrCreateCollection();
    
    const results = await this.makeRequest(
      `/api/v2/tenants/${this.tenant}/databases/${this.database}/collections/${this.collectionId}/query`,
      'POST',
      {
        query_texts: [queryText],
        n_results: nResults,
      }
    );

    return {
      documents: results.documents?.[0] || [],
      metadatas: results.metadatas?.[0] || [],
      distances: results.distances?.[0] || [],
      ids: results.ids?.[0] || [],
    };
  }

  async deleteDocuments(ids: string[]) {
    await this.makeRequest(
      `/api/v2/tenants/${this.tenant}/databases/${this.database}/collections/${this.collectionId}/delete`,
      'POST',
      {
        ids,
      }
    );
  }

  async updateDocuments(ids: string[], documents: string[], metadatas?: object[]) {
    await this.getOrCreateCollection();
    
    await this.makeRequest(
      `/api/v2/tenants/${this.tenant}/databases/${this.database}/collections/${this.collectionId}/update`,
      'POST',
      {
        ids,
        documents,
        metadatas,
      }
    );
  }

  async getCollectionCount() {
    await this.getOrCreateCollection();
    const result = await this.makeRequest(
      `/api/v2/tenants/${this.tenant}/databases/${this.database}/collections/${this.collectionId}/count`
    );
    return result || 0;
  }

  async deleteCollection() {
    await this.makeRequest(
      `/api/v2/tenants/${this.tenant}/databases/${this.database}/collections/${this.collectionId}`,
      'DELETE'
    );
  }
}

export const chromaDB = new ChromaDBService();
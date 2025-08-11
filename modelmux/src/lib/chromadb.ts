import { ChromaClient, Collection } from "chromadb";

class ChromaDBManager {
  private client: ChromaClient;
  private collection: Collection | null = null;

  constructor() {
    this.client = new ChromaClient();
  }

  async getOrCreateCollection(name = "search_results") {
    // Lazy Eval
    if (!this.collection) {
      this.collection = await this.client.getOrCreateCollection({
        name,
      });
    }
    return this.collection;
  }

  async embedSearchResults(
    searchResults: string[],
    knowledgeItemIds: string[],
    embeddings: number[][],
  ) {
    try {
      const collection = await this.getOrCreateCollection();

      const documents = searchResults.filter(
        (result) => result && !result.startsWith("Error searching"),
      );
      const ids = knowledgeItemIds.slice(0, documents.length);
      const validEmbeddings = embeddings.slice(0, documents.length);

      if (documents.length === 0) {
        console.warn("ChromaDB: No valid documents to embed");
        return;
      }

      if (documents.length !== validEmbeddings.length) {
        throw new Error("Number of documents must match number of embeddings");
      }

      console.log("ChromaDB: Adding to collection...");
      await collection.add({
        ids,
        documents,
        embeddings: validEmbeddings,
        metadatas: ids.map((id) => ({
          knowledge_item_id: id,
          timestamp: Date.now(),
        })),
      });

      console.log(
        `ChromaDB: Successfully embedded ${documents.length} search results`,
      );
    } catch (error) {
      console.error("ChromaDB: Failed to embed search results:", error);
      throw error;
    }
  }

  async queryCollection(
    queryText: string,
    queryEmbedding: number[],
    nResults = 5,
  ) {
    try {
      const collection = await this.getOrCreateCollection();

      const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults,
      });

      return results;
    } catch (error) {
      console.error("Failed to query collection:", error);
      throw error;
    }
  }

  async deleteByKnowledgeItemId(knowledgeItemId: string) {
    try {
      const collection = await this.getOrCreateCollection();

      const results = await collection.get({
        where: { knowledge_item_id: knowledgeItemId },
      });

      if (results.ids && results.ids.length > 0) {
        await collection.delete({
          ids: results.ids,
        });
        console.log(
          `Deleted embeddings for knowledge item: ${knowledgeItemId}`,
        );
      }
    } catch (error) {
      console.error("Failed to delete embeddings:", error);
      throw error;
    }
  }
}

const chromaDB = new ChromaDBManager();

export { chromaDB };

export interface API {
  searchDuckDuckGo: (url: string) => Promise<any>;
  greet: (message: string) => Promise<any>;
}

declare global {
  interface Window {
    api: API;
  }
}

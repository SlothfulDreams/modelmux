export interface IElectronAPI {
  searchDuckDuckGo: (url: string) => Promise<any>;
  greet: (message: string) => Promise<any>;
}

declare global {
  interface Window {
    api: IElectronAPI;
  }
}

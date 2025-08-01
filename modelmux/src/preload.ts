// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { search } from "./lib/duckduckgo";

contextBridge.exposeInMainWorld("electronAPI", {
  searchDuckDuckGo: async (url: string) => {
    const { apiKey, profile } = await ipcRenderer.invoke("get-credentials");
    return search(url, apiKey, profile);
  },
});

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");
// const { search } = require("./lib/duckduckgo.ts");

contextBridge.exposeInMainWorld("api", {
  searchDuckDuckGo: async (url: string) => {
    return await ipcRenderer.invoke("searchDuckDuckGo", url);
  },
});

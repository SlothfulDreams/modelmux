import { app, BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import started from "electron-squirrel-startup";
import { exec, ChildProcess } from "node:child_process";
import dotenv from "dotenv";
import { search } from "./lib/duckduckgo";
dotenv.config();

// import Store from "electron-store";

// UserPref
// const userPref = new Store<{ model: string }>();
// userPref.set("model", "gemini");
// console.log(userPref.get("model"));

let ollamaProcess: ChildProcess;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  // Start ollama serve
  ollamaProcess = exec("ollama serve", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
  createWindow();
});

// IPC process
ipcMain.handle("greet", (event: IpcMainEvent, args) => {
  console.log("Hello");
});

// TODO: Fix This args is undefined
ipcMain.handle("searchDuckDuckGo", async (event: IpcMainEvent, args) => {
  const { apiKey, profile } = process.env;
  const results = await search(args, apiKey, profile);
  console.log("URL: ", args, "ApiKey", apiKey, "profile", profile);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", () => {
  // Kill the ollama process
  if (ollamaProcess) {
    ollamaProcess.kill();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

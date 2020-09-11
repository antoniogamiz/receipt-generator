import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as url from "url";
const isDev = require("electron-is-dev");
const PDFWindow = require("electron-pdf-window");

// if (isDev) {
//   require("electron-reload");
// }

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (process.env.NODE_ENV === "dev") {
    mainWindow.loadURL(`http://localhost:3000`);
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "../index.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("show-pdf", (event, pdfPath) => {
  const win = new PDFWindow({
    width: 800,
    height: 600,
  });

  win.loadURL(`file://${pdfPath}`);
});

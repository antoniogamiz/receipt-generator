const electron = require("electron");
const app = electron.app;
const path = require("path");
const isDev = require("electron-is-dev");
const PDFWindow = require("electron-pdf-window");

if (isDev) {
  require("electron-reload");
}

const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

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
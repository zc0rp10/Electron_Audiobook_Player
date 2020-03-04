// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog, ipcMain, Menu } = require("electron");
const path = require("path");

let mainWindow = null;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  console.log(mainWindow.autoHideMenuBar);
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "./src/index.html"));
  // //Sends a msg to render process when user closes app, to tell it to save current state of library
  mainWindow.on("close", e => {
    if (mainWindow) {
      e.preventDefault();
      mainWindow.webContents.send("app-close");
    }
  });

  //Closes app when the response comes back from render process after current state of library has been saved
  ipcMain.on("closed", _ => {
    mainWindow = null;
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  //Add Folder Dialog
  ipcMain.on("add-book-dialog", event => {
    dialog
      .showOpenDialog(mainWindow, {
        properties: ["openFile"]
      })
      .then(result => {
        event.reply("add-book-dialog-reply", result.filePaths.toString());
      })
      .catch(err => {
        console.log(err);
      });
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);
// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

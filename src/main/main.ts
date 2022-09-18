import { app, BrowserWindow, ipcMain, globalShortcut } from "electron"
import * as path from "path";
import * as windowStateKeeper from "electron-window-state"
import * as hotkeys from './hotkeys'
import * as twitch from './twitch';
import * as config from './config'
import { channels } from '../shared/constants'

let mainWindow: BrowserWindow

const createMainWindow = () => {
  // Create the browser window

  let mainWindowState = windowStateKeeper({
    defaultWidth: 300,
    defaultHeight: 450
  })

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    show: false,
    // backgroundColor: global.colors.BACKGROUND,
    frame: false,
    icon: path.join(__dirname, '../../../public/icons/WindowIcon.png'),
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // remembers window state when closing/reopening apps
  mainWindowState.manage(mainWindow)

  // disables right click context menu (weird hack for frameless window)
  if(process.platform == 'win32') {
    const WM_INITMENU = 0x0116;
    mainWindow.hookWindowMessage(WM_INITMENU, () => {
      mainWindow.setEnabled(false);
      mainWindow.setEnabled(true);
    });
  }

  // shows the page after electron finishes setup
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  }) 

  // disables resizing of window
  mainWindow.setResizable(false)

  // loads main page of the app
  mainWindow.loadFile(path.join(__dirname, '../../../public/html/index.html'));
  
  // closes app
  mainWindow.on('close', function(){
    app.quit()
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

app.disableHardwareAcceleration()



app.on("ready", async function () {
  createMainWindow()
  await config.setup(true)

  // hotkeys.registerAll()
  // hotkeys.test()
  // twitch.connect('roselol')

});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle(channels.CLOSE_APP, () => {
  app.quit()
})

ipcMain.handle(channels.MINIMIZE_APP, () => {
  mainWindow.minimize()
})
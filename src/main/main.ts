import { app, BrowserWindow, ipcMain, globalShortcut } from "electron"
import * as path from "path";
import * as windowStateKeeper from "electron-window-state"
import Hotkeys from './hotkeys'
import * as chat from './chat_window';
import * as config from './config'
import { channels } from '../shared/constants'
import { uIOhook, UiohookKey } from 'uiohook-napi'

let mainWindow: BrowserWindow

const createMainWindow = () => {
  // Create the browser window
  let mainWindowState = windowStateKeeper({
    file: 'desktop-window-state.json',
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
      contextIsolation: false
    }
  });

  // remembers window state when closing/reopening apps
  mainWindowState.manage(mainWindow)

  // disables right click context menu (weird hack for frameless window)
  mainWindow.on("system-context-menu", (event, _point) => {
    event.preventDefault();
  });

  // shows the page after electron finishes setup
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  }) 

  // disables resizing of window
  mainWindow.setResizable(false)

  // loads main page of the app
  mainWindow.loadFile(path.join(__dirname, '../../../public/html/desktop.html'))
  
  // closes app
  mainWindow.on('close', async function(event){
    app.quit()
  })

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// app.disableHardwareAcceleration()

app.on("ready", async function () {
  
  createMainWindow()
  chat.launch()

  let hotkeys = new Hotkeys()
  hotkeys.register([UiohookKey.Ctrl, UiohookKey.Z], chat.toggleLock)
  hotkeys.register([UiohookKey.Ctrl, UiohookKey.X], chat.toggleShow)
  hotkeys.register([UiohookKey.Ctrl, UiohookKey.ArrowUp], chat.scrollUp)
  hotkeys.register([UiohookKey.Ctrl, UiohookKey.ArrowDown], chat.scrollDown)

  hotkeys.run()

  await config.setup(true)

});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle(channels.CLOSE_APP, () => {
  chat.close()
  app.quit()
})

ipcMain.handle(channels.MINIMIZE_APP, () => {
  mainWindow.minimize()
})


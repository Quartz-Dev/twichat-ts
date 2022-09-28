import { app, BrowserWindow, ipcMain, globalShortcut } from "electron"
import * as path from "path";
import * as windowStateKeeper from "electron-window-state"
import Hotkeys from './hotkeys'
import * as chat from './chat_window';
import * as config from './config'
import { channels } from '../shared/constants'
import { uIOhook, UiohookKey } from 'uiohook-napi'
import * as settings from 'electron-settings'

let mainWindow: BrowserWindow

const createMainWindow = (fontSize: number, opacity: number, fadeDelay: number) => {
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
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, '../shared/preload.js')
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
    mainWindow.webContents.send('settings', fontSize, opacity, fadeDelay)
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
  
  await config.setup(true)
  

  let fontSize = (await settings.get('chat.size')) as number
  let opacity = (await settings.get('chat.opacity')) as number
  let fadeDelay = (await settings.get('chat.fade')) as number
  
  createMainWindow(fontSize, opacity, fadeDelay)
  chat.launch(fontSize, opacity, fadeDelay)

  let hotkeys = new Hotkeys()
  hotkeys.register([UiohookKey.Ctrl, UiohookKey.S], chat.toggleLock)
  hotkeys.register([UiohookKey.Ctrl, UiohookKey.D], chat.toggleShow)
  hotkeys.register([UiohookKey.Ctrl, UiohookKey.ArrowUp], chat.scrollUp)
  hotkeys.register([UiohookKey.Ctrl, UiohookKey.ArrowDown], chat.scrollDown)

  hotkeys.run()


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

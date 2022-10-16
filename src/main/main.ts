import { app, BrowserWindow, ipcMain, globalShortcut } from "electron"
import * as path from "path";
import * as windowStateKeeper from "electron-window-state"
import Hotkeys from './hotkeys'
import * as chat from './chat_window';
import * as config from './config'
import { channels } from '../shared/constants'
import * as settings from 'electron-settings'

// IDK IF THIS WORKS YET
if (require('electron-squirrel-startup')) app.quit();

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  // return;
}

// IDK IF THIS WORKS YET
function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command: any, args: any) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args: any) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
};

// IF TRUE TURNS ON DEV TOOLS FOR BOTH WINDOWS
var debug: boolean = false

let mainWindow: BrowserWindow

const toggleDevTools = () => {
  mainWindow.webContents.toggleDevTools()
  chat.toggleDevTools()
}

const createMainWindow = (channelname: string, pfp: string, fontSize: number, opacity: number, fadeDelay: number, debug: boolean = false) => {
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
    icon: path.join(__dirname, '../../../public/icons/twichat-icon.ico'),
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
    mainWindow.webContents.send('settings', channelname, pfp, fontSize, opacity, fadeDelay)
  }) 

  // disables resizing of window
  mainWindow.setResizable(false)

  // loads main page of the app
  mainWindow.loadFile(path.join(__dirname, '../../../public/html/desktop.html'))
  
  // closes app
  mainWindow.on('close', async function(event){
    chat.close()
    app.quit()
  })

  // Open the DevTools.
  if(debug) mainWindow.webContents.openDevTools();
};

// app.disableHardwareAcceleration()

app.on("ready", async function () {
  
  await config.setup(true)
  

  let fontSize = (await settings.get('chat.size')) as number
  let opacity = (await settings.get('chat.opacity')) as number
  let fadeDelay = (await settings.get('chat.fade')) as number
  let channelname = (await settings.get('channel.displayname')) as string
  let pfp = (await settings.get('channel.pfp')) as string
  
  createMainWindow(channelname, pfp, fontSize, opacity, fadeDelay, debug)
  chat.launch(mainWindow.webContents, fontSize, opacity, fadeDelay, debug)

  setupHotkeys()

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


// HOTKEYS
let hotkeys: Hotkeys

const setupShowHotkey = async (key_map: number[]) => {
  hotkeys.register(key_map, chat.toggleShow)
}

const setupLockHotkey = async (key_map: number[]) => {
  hotkeys.register(key_map, chat.toggleLock)
}

const setupScrollUpHotkey = async (key_map: number[]) => {
  hotkeys.register(key_map, chat.scrollUp)
}

const setupScrollDownHotkey = async (key_map: number[]) => {
  hotkeys.register(key_map, chat.scrollDown)
}

const setupScrollWheelHotkey = async (key_map: number[]) => {
  hotkeys.registerScroll(key_map, chat.scrollUp, chat.scrollDown)
}

const setupDevToolsHotkey = async (key_map: number[]) => {
  hotkeys.register(key_map, toggleDevTools)
}

const setupHotkeys = async () => {
  hotkeys = new Hotkeys()
  
  let hotkeyShow = await settings.get('hotkeys.show') as number[]
  let hotkeyLock = await settings.get('hotkeys.lock') as number[]
  setupShowHotkey(hotkeyShow)
  setupLockHotkey(hotkeyLock)

  let hotkeyScrollUp = await settings.get('hotkeys.scrollUp') as number[]
  let hotkeyScrollDown = await settings.get('hotkeys.scrollDown') as number[]
  let hotKeyScrollWheel = await settings.get('hotkeys.scrollWheel') as number[]
  setupScrollUpHotkey(hotkeyScrollUp)
  setupScrollDownHotkey(hotkeyScrollDown)
  setupScrollWheelHotkey(hotKeyScrollWheel)

  let hotKeyDevTools = await settings.get('hotkeys.devTools') as number[]
  setupDevToolsHotkey(hotKeyDevTools)
  
  hotkeys.run()
}
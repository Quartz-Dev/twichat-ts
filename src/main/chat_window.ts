import { BrowserWindow, dialog, ipcMain, webContents } from "electron";
import { configure } from "electron-settings";
import * as windowStateKeeper from "electron-window-state"
import * as settings from 'electron-settings'
import * as path from 'path'
import * as twitch from './twitch'
import { WebContents } from 'electron'

let chatWindow: BrowserWindow
let mainWebContents: WebContents

export const createWindow = async (fontSize: number, opacity: number, fadeDelay: number, debug: boolean = false) => {

    let chatWindowState = windowStateKeeper({
        file: 'chat-window-state.json',
        defaultWidth: 400,
        defaultHeight: 800
      })
    
    chatWindow =  new BrowserWindow({
        minWidth: 200,
        minHeight: 200,
        x: chatWindowState.x,
        y: chatWindowState.y,
        width: chatWindowState.width,
        height: chatWindowState.height,
        backgroundColor: '#00000000',
        transparent: true,
        frame: false,
        show: false,
        icon: path.join(__dirname, '../img/icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, '../shared/preload.js')
        }
    })

    // remembers window state when closing/reopening apps
    chatWindowState.manage(chatWindow)

    // loads html file
    chatWindow.loadFile(path.join(__dirname, '../../../public/html/chat.html'))

    // forces chat window to be in front of every window (doesn't work for fullscreen apps on windows)
    // needs to have 'normal flag' (haven't fully tested if fixes issue)
    // https://github.com/electron/electron/issues/20933
    chatWindow.setAlwaysOnTop(true, 'normal');

    // disables right click on chat overlay
    chatWindow.on("system-context-menu", (event, _point) => {
        event.preventDefault();
    });

    chatWindow.on('show', async () => {
        // updates desktop show switch to on
        mainWebContents.send('updateShowSwitch', true)
    })

    chatWindow.on('hide', async () => {
        // updates desktop show switch to off
        mainWebContents.send('updateShowSwitch', false)
    })

    chatWindow.once('ready-to-show', async () => {
        chatWindow.show()

        // gets channel name from settings
        let channelname = (await settings.get('channel.username')) as string

        // unlocks chat if needed
        isLocked = await settings.get('chat.locked') as boolean
        isLocked ? lock() : unlock()
        // gets chat saved settings and sends to client

        chatWindow.webContents.send('loadSettings', fontSize, opacity, fadeDelay)

        // connects to twitch
        twitch.connect(channelname, chatWindow.webContents, mainWebContents)
        
        //   Open the DevTools.
        // if(debug) chatWindow.webContents.openDevTools();
        chatWindow.webContents.openDevTools();
      })

    // default opens as locked
    // so prevents user from interacting with window
    chatWindow.setIgnoreMouseEvents(true)

    // prevent people from closing the chat window (they have to close the main app)
    // but it doesnt work?!
    chatWindow.setClosable(false)

}

export const close = () => {
    chatWindow.setClosable(true)
    chatWindow.close()
}

export const toggleDevTools = () => {
    chatWindow.webContents.toggleDevTools()
}

var isLocked: boolean = true

export const toggleLock = async () => {
    isLocked ? unlock() : lock()
}

export const unlock = async () => {
    isLocked = false
    chatWindow.setIgnoreMouseEvents(false)
    chatWindow.webContents.send('unlock')
    mainWebContents.send('updateLockSwitch', isLocked)
    await settings.set('chat.locked', false)
}

export const lock = async () => {
    isLocked = true
    chatWindow.setIgnoreMouseEvents(true)
    chatWindow.webContents.send('lock')
    mainWebContents.send('updateLockSwitch', isLocked)
    await settings.set('chat.locked', true)
}

export const toggleShow = () => {
    chatWindow.isVisible() ? chatWindow.hide() : chatWindow.show()
}

export const scrollUp = () => {
    chatWindow.webContents.send('scrollUp')
}

export const scrollDown = () => {
    chatWindow.webContents.send('scrollDown')
}

export const launch = async (webContents: WebContents, fontSize: number, opacity: number, fadeDelay: number, debug: boolean = false) => {
    // creates and opens chat window
    mainWebContents = webContents
    createWindow(fontSize, opacity, fadeDelay, debug)
}

const updateFontSize = async (event: any, fontSize: number) => {
    chatWindow.webContents.send('setFontSize', fontSize)
    await settings.set('chat.size', fontSize).catch((e: unknown) => {})
}

const updateOpacity = async (event: any, opacity: number) => {
    chatWindow.webContents.send('setOpacity', opacity)
    await settings.set('chat.opacity', opacity).catch((e: unknown) => {})
}

const updateFadeDelay = async (event: any, fadeDelay: number) => {
    chatWindow.webContents.send('setFadeDelay', fadeDelay)
    await settings.set('chat.fade', fadeDelay).catch((e: unknown) => {console.log(e)})
}

const handleCMDS = (cmd: string) => {
    // console.log(cmd)
}

const setChannel = async (event: any, username: string) => {
    if(username.startsWith('/')) return handleCMDS(username)
    twitch.connect(username, chatWindow.webContents, mainWebContents)
}

ipcMain.handle('updateFontSize', updateFontSize)
ipcMain.handle('updateOpacity', updateOpacity)
ipcMain.handle('updateFadeDelay', updateFadeDelay)
ipcMain.handle('toggleLock', toggleLock)
ipcMain.handle('toggleShow', toggleShow)
ipcMain.handle('setChannel', setChannel)
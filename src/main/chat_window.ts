import { BrowserWindow, dialog, ipcMain, webContents } from "electron";
import { configure } from "electron-settings";
import * as windowStateKeeper from "electron-window-state"
import * as settings from 'electron-settings'
import * as path from 'path'
import * as twitch from './twitch'

let chatWindow: BrowserWindow

export const createWindow = () => {

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

    chatWindow.once('ready-to-show', () => {
        chatWindow.show()
        
        //   Open the DevTools.
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


var isLocked: boolean = true

export const toggleLock = async () => {
    chatWindow.webContents.send('toggleLock')
}

export const unlock = () => {
    console.log('unlocking chat window')
    isLocked = false
    chatWindow.setIgnoreMouseEvents(false)
    chatWindow.webContents.send('unlock')
}

export const lock = () => {
    console.log('locking chat window')
    isLocked = true
    chatWindow.setIgnoreMouseEvents(true)
    chatWindow.webContents.send('lock')
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

export const launch = async (fontSize: number, opacity: number, fadeDelay: number) => {

    // creates and opens chat window
    createWindow()
    // make sure window opens locked (no border)

    // gets channel name from settings
    let channel = (await settings.get('channel.username')) as string

    // unlocks chat if needed
    if(await settings.get('chat.locked') == false) unlock()

    // gets chat saved settings and sends to client

    chatWindow.webContents.send('settings', fontSize, opacity, fadeDelay)

    // connects to twitch
    twitch.connect(channel, chatWindow.webContents)
}

const updateFontSize = (event: any, fontSize: number) => {
    chatWindow.webContents.send('setFontSize', fontSize)
    settings.set('chat.size', fontSize)
}

const updateOpacity = (event: any, opacity: number) => {
    chatWindow.webContents.send('setOpacity', opacity)
    settings.set('chat.size', opacity)
}

const updateFadeDelay = (event: any, fadeDelay: number) => {
    chatWindow.webContents.send('setFadeDelay', fadeDelay)
    settings.set('chat.size', fadeDelay)
}

ipcMain.handle('updateFontSize', updateFontSize)
ipcMain.handle('updateOpacity', updateOpacity)
ipcMain.handle('updateFadeDelay', updateFadeDelay)
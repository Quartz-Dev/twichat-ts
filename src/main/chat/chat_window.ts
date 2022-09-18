import { BrowserWindow } from "electron";
import * as path from 'path'

let chatWindow: BrowserWindow

export function open() {
    chatWindow =  new BrowserWindow({
        minWidth: 200,
        minHeight: 200,
        backgroundColor: '#00000000',
        transparent: true,
        frame: false,
        icon: path.join(__dirname, '../../img/icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })
}
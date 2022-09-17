import { BrowserWindow } from 'electron'
import * as tmi from 'tmi.js'
import { buildLine, refreshApiData } from './chat_handler'

var client: tmi.Client

export const disconnect = () => {
    if(!client) return
    console.log(` >>> Disconnecting from ${client.getChannels()[0]}`)
    return client.disconnect()
}

var chatWindow: BrowserWindow

//  (channel: string, userstate: tmi.ChatUserstate, message: string, self: boolean)
export const msgHandler = (target: string, context: tmi.ChatUserstate, msg: string, self: boolean) => {

    // if(chatWindow) chatWindow.webContents.send(channels.UPDATE_CHAT, )
}

export const connect = async (username: string) => {
    if(!username) return

    if(client) await disconnect()

    refreshApiData(username)

    return

    client = new tmi.Client({
        channels: [username]
    })

    client.on('connected', (addr, port) => {
        console.log(` >>> tmi.js conncted to ${addr}:${port}`)
    })

    client.on('message', msgHandler)
}

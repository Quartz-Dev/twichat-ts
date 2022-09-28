import { WebContents } from 'electron'
import * as tmi from 'tmi.js'
import { refreshApiData } from './config'
import * as settings from 'electron-settings'

var client: tmi.Client
var chatWebContents: WebContents
var mainWebContents: WebContents

export const disconnect = () => {
    if(!client) return
    console.log(` >>> Disconnecting from ${client.getChannels()[0]}`)
    return client.disconnect()
}

//  (channel: string, userstate: tmi.ChatUserstate, message: string, self: boolean)
export const msgHandler = (channel: string, context: tmi.ChatUserstate, msg: string, self: boolean) => {

    if(chatWebContents) chatWebContents.send('addLine', msg, context)
}

export const connect = async (username: string, _chatWebContents: WebContents, _mainWebContetnts: WebContents) => {
    console.log(` >>> Attempting to connect to: ${username}`)
    if(!username) return

    if(client) await disconnect()

    await refreshApiData(username)


    let globalTwitchBadges = await settings.get('global.badges.twitch')
    let channelTwitchBadges = await settings.get('channel.badges.twitch')
    let globalBTTVEmotes = await settings.get('global.emotes.bttv')
    let channelBTTVEmotes = await settings.get('channel.emotes.bttv')

    let channelname = await settings.get('channel.displayname')
    let pfp = await settings.get('channel.pfp')

    _mainWebContetnts.send('updateChannelUI', channelname, pfp)

    chatWebContents = _chatWebContents
    chatWebContents.send('updateBadgesEmotes', globalTwitchBadges, channelTwitchBadges, globalBTTVEmotes, channelBTTVEmotes)

    client = new tmi.Client({
        channels: [username]
    })

    client.on('connected', (addr, port) => {
        console.log(` >>> tmi.js conncted to ${addr}:${port}`)
    })

    client.on('message', msgHandler)

    // Connects to twitch channel:
    console.log(` >>>  Connecting to '${username}'`)
    client.connect();
}

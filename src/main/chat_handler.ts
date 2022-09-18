import { ChatUserstate } from 'tmi.js'
import * as api from './api'
import * as settings from 'electron-settings'

var globalBadges: api.twitchBadgeList
var channelBadges: api.twitchBadgeList

var bttvGlobalEmotes: api.bttvEmoteList
var bttvChannelEmotes: api.bttvEmoteList

export function refreshApiData(username: string) {

    return new Promise( async (resolve, reject) => {
        let data = (await api.fetchData(username)) as api.Data
        resolve(true)
    })

}
function saveChatSettings(data: api.Data) {

    if(!data) return

    globalBadges = data.badges.global
    channelBadges = data.badges.channel

    bttvGlobalEmotes = data.emotes.bttv.channel
    bttvChannelEmotes = data.emotes.bttv.channel

    settings.set('channel.username', data.username)
    settings.set('channel.displayname', data.displayname)
    settings.set('channel.id', data.id)
    settings.set('channel.pfp', (data.pfp).toString())
    settings.set('channel.emotes.bttv', data.emotes.bttv.channel)
    settings.set('channel.badges.twitch', data.badges.channel)
    settings.set('global.badges.twitch', (data.badges.global))
    settings.set('global.emotes.bttv', data.emotes.bttv.global)
}
import * as settings from 'electron-settings'
// import { DEFAULT_KEYMAP } from './hotkeys'

const settingsConfig: any = { 
    atomicSave: true,
    fileName: 'twichat-settings.json',
    numSpaces: 2,
    prettify: true
}

const defaults: any = {
    hotkeys: {
        // lock: DEFAULT_KEYMAP.LOCK,
        // hide: DEFAULT_KEYMAP.HIDE
    },
    channel: {
        username: 'roselol',
        displayname: 'roselol',
        id: '152928496',
        pfp: 'https://static-cdn.jtvnw.net/jtv_user_pictures/6883a9fc-5f73-41d9-a1f1-1547df43fd82-profile_image-300x300.png',
        emotes: {
            bttv: {},
            ffz: {}
        },
        badges: {
            twitch: {}
        }
    },
    global: {
        badges: {
            twitch: {}
        },
        emotes: {
            bttv: {}
        }
    },
    chat: {
        size: 18,
        opacity: 1,
        fade: 0,
        locked: false,
        muted: []
    }
}

// ran on app start
export const setup = (debug=false) => {

    settings.configure(settingsConfig)

    return new Promise( async (resolve, reject) => {
        if(await !settings.has('hotkeys')){
            if(debug) console.log('Using default hotkeys')
            await settings.set('hotkeys', defaults.hotkeys)
        }
    
        if(await !settings.has('channel')){
            if(debug) console.log('Using default channel')
            await settings.set('channel', defaults.channel)
        }
    
        if(await !settings.has('chat')){
            if(debug) console.log('Using default chat settings ')
            await settings.set('chat', defaults.chat)
        }

        resolve(true)
    })
}

import * as api from './api'

export function refreshApiData(username: string) {

    return new Promise( async (resolve, reject) => {
        let data = (await api.fetchData(username)) as api.Data
        await saveChatSettings(data)
        resolve(true)
    })

}

async function saveChatSettings(data: api.Data) {

    if(!data) return

    await settings.set('channel.username', data.username)
    await settings.set('channel.displayname', data.displayname)
    await settings.set('channel.id', data.id)
    await settings.set('channel.pfp', (data.pfp).toString())
    await settings.set('channel.emotes.bttv', data.emotes.bttv.channel)
    await settings.set('channel.emotes.ffz', data.emotes.ffz.channel)
    await settings.set('channel.badges.twitch', data.badges.channel)
    await settings.set('global.badges.twitch', (data.badges.global))
    await settings.set('global.emotes.bttv', data.emotes.bttv.global)
}

import * as settings from 'electron-settings'

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
        username: '',
        displayname: '',
        id: '',
        pfp: '',
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
        muted: [],
    }
}

export const validateHotkeys = async () => {

    if(!(await settings.has('hotkeys'))){
        await settings.set('hotkeys', defaults.hotkeys)
    }

}

export const validateChannel = async () => {
    
    if(!(await settings.has('channel'))){
        await settings.set('channel', defaults.channel)
        return
    }

}

const validateChat = async () => {
    
    if(!(await settings.has('chat'))){
        await settings.set('chat', defaults.chat)
        return
    }

    if(!(await settings.has('chat.size'))){
        await settings.set('chat.size', defaults.chat.size)
        return
    }

    if(!(await settings.has('chat.opacity'))){
        await settings.set('chat.opacity', defaults.chat.opacity)
        return
    }

    if(!(await settings.has('chat.fade'))){
        await settings.set('chat.fade', defaults.chat.fade)
        return
    }

    if(!(await settings.has('chat.locked'))){
        await settings.set('chat.locked', defaults.chat.locked)
        return
    }
    
    if(!(await settings.has('chat.muted'))){
        await settings.set('chat.muted', defaults.chat.muted)
        return
    }


}

// ran on app start
export const setup = async (debug=false) => {

    settings.configure(settingsConfig)

    return new Promise( async (resolve, reject) => {
        if(!(await settings.has('hotkeys'))){
            if(debug) console.log('Using default hotkeys')
            await settings.set('hotkeys', defaults.hotkeys)
        }
    
        if(!(await settings.has('channel'))){
            if(debug) console.log('Using default channel')
            await settings.set('channel', defaults.channel)
        }
    
        validateChat()

        resolve(true)
    })
}

// API
// maybe i move to api.ts?

import * as api from './api'

export function refreshApiData(username: string) {

    return new Promise( async (resolve, reject) => {
        let userData = (await api.fetchData(username)) as any
        if(!userData)
            return resolve(false)
        await saveChatSettings(userData as api.Data)        
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

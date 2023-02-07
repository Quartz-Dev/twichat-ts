import axios from 'axios'

// const api_domain = `https://twichat-api-js.vercel.app`
const api_domain = `https://api.quartzdev.gg`

function fetch(url: string) {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(res => {
                res.status == 200 ? resolve(res.data) : resolve(false)
            })
            .catch(err => {
                resolve(false)
            })
    })
}

export function fetchData(username: string) {
    let url = `${api_domain}/twitch/user/${username}`
    return fetch(url)
}

export type emoteID = string
export type twitchBadge = {
        versions: {
            [versionNumber: string] : {
                image_url_1x: string,
                image_url_2x: string,
                image_url_4x: string,
                description: string
                title: string,
                click_action: string,
                click_url: string,
                last_updated: null
            }
        }
}

export type twitchBadgeList = {
    [badgeName: string]: twitchBadge
}

export type bttvEmoteList = {
    [emoteName: string]: emoteID
}



export type Data = {
    username: string,
    displayname: string,
    id: string,
    pfp: string,
    emotes: {
        bttv: {
            global: bttvEmoteList,
            channel: bttvEmoteList
        },
        ffz: {
            channel: bttvEmoteList
        }
    },
    badges: {
        global: twitchBadgeList,
        channel: twitchBadgeList 
    }
}

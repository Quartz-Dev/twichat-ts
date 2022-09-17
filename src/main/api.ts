import axios from 'axios'

function fetch(url: string) {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(res => {
                res.status == 200 ? resolve(res.data) : resolve(null)
            })
            .catch(err => {
                console.log(err)
                resolve(null)
            })
    })
}

export function fetchData(username: string) {
    let url = `https://api.jgdif.com/twitch/user/${username}`
    return fetch(url)
}

export type emoteID = string
export type twitchBadge = {
    name: {
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
        }
    },
    badges: {
        global: twitchBadgeList,
        channel: twitchBadgeList 
    }
}

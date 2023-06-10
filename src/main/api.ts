import axios from 'axios'

const api_domain = `https://api.quartzdev.gg`

export async function fetchData(username: string): Promise<Data> {
    let url = `${api_domain}/twitch/user/${username}`

    var resData = {} as Data

    return new Promise(async (resolve, reject) => {
        console.log(`Fetching user info:'${username}' `)
        await axios.get(url).then(res => {
            if(res.status == 200) {
                resData = res.data
                resData.status = STATUS.SUCCESS
            }
            if(res.status == 404){
                console.log(`    - Error: '${username}' not found`)
                resData.status = STATUS.USER_NOT_FOUND
                resData.username = username
            }

        }).catch( err => {
            console.log(`    - Error: Failed to fetch. Is the api working?`)
            resData.status = STATUS.ERROR
            resData.username = username
        })
        console.log("||||||||||||||||||||||||")
        console.log(resData)
        resolve(resData)
    })
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
    status: STATUS
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

 export enum STATUS {
    SUCCESS = 200,
    USER_NOT_FOUND = 404,
    ERROR = null,
} 

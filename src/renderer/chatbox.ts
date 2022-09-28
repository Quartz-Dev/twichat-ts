import { Badges, ChatUserstate } from 'tmi.js'

var chatBox : HTMLDivElement

export class ChatBox {
    private chatBox: HTMLDivElement
    private nonFirstTimeChatters: Set<string> = new Set()
    // private globalBadges: api.twitchBadgeList
    // private channelBadges: api.twitchBadgeList

    // private bttvGlobalEmotes: api.bttvEmoteList
    // private bttvChannelEmotes: api.bttvEmoteList

    public constructor(username: string) {
        this.chatBox = window.document.createElement('div')
        this.chatBox.id = 'chat-box'
        this.chatBox.classList.add('chat-text')
    }

    public clear = () => {
        chatBox.innerHTML = ''
    }

    public buildLine = () => {

        // create line element
        let newLine = document.createElement('li')
        newLine.classList.add('message-line')
        newLine.classList.add('doublespace')
    
        return newLine
    }

    private buildBadges(badges: Badges) {

        // returns if no badges in message
        if(!badges) return

        // returns if no channel badges nor twitch badges
        // TODO

        // list of badges in html
        let badgesHTML: HTMLImageElement[]

        console.log(badges)
        // loops through each badge
        for(let key in badges) {

        }

        return badgesHTML
    }

    public buildUsername = (username: string, color: string) => {

        let span = document.createElement('span');
        span.classList.add('username')
        span.style.color = (color) ? color : 'green'
        span.innerText = username

        return span
    }

    public parseEmotes = (message: HTMLSpanElement, msg: string, context: ChatUserstate) => {

        return message
    }

    public buildMessage = (msg: string, context: ChatUserstate) => {

        let message = document.createElement('span')
        message.classList.add('message');
        message.innerText = msg;

        // replaces emote text with imgs
        message = this.parseEmotes(message, msg, context)

        return message
    }

    public addLine(msg: string, context: ChatUserstate) {

        // creates empty line
        let newLine = this.buildLine()

        // adds badges 
        let badgeList = this.buildBadges(context['badges'])
        if(badgeList) badgeList.forEach(badge => newLine.append(badge));

        // adds username
        let username = this.buildUsername(context['display-name'], context['color'])
        newLine.append(username)
        newLine.append(':')

        // highlights line if username is first time chatter since (per live)
        if(!this.nonFirstTimeChatters.has(context['display-name'])) {
            newLine.classList.add('highlight')
            this.nonFirstTimeChatters.add(context['display-name'])
        }

        // adds message
        let message = this.buildMessage(msg, context)
        newLine.append(message)

        // adds line to chatbox
        chatBox.append(newLine)

        // prunes extra lines if needed
        let allLines = document.getElementsByClassName('message-line')
        if (allLines.length > 120)
            allLines[0].remove()

        // scrolls down
        chatBox.scrollTop = chatBox.scrollHeight
    }

}
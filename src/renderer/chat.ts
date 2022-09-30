import { timers } from "jquery";
import { ChatUserstate, Badges } from "tmi.js";
import * as api from '../main/api'

const unlock = () => {
    $(`body`).addClass("body-unlocked");
    $(`body`).removeClass("body-locked");
    $('#frame').addClass("frame");
}

const lock = () => {
    $(`body`).addClass("body-locked");
    $(`body`).removeClass("body-unlocked");
    $('#frame').removeClass("frame");
}

const toggleLock = () => {
    ($('body').hasClass("body-locked")) ? lock() : unlock()
}

const scrollStep: number = 36
var scrollPaused: boolean = false
var pauseTime: number = 5 // in seconds
var timeoutID: ReturnType<typeof setTimeout>

const tempPauseScroll = () => {
    clearTimeout(timeoutID)
    scrollPaused = true
    timeoutID = setTimeout(()=> {
        scrollPaused = false
    }, pauseTime*1000)
}

const scrollUp = () => {
    chatBox.scrollTop = (chatBox.scrollTop - scrollStep)
    scrollPaused = true
    tempPauseScroll()
}

const scrollDown = () => {
    console.log('scrollDown')
    chatBox.scrollTop = (chatBox.scrollTop + scrollStep)
    tempPauseScroll()
}

var globalTwitchBadges: api.twitchBadgeList
var channelTwitchBadges: api.twitchBadgeList
var globalBTTVEmotes: api.bttvEmoteList
var channelBTTVEmotes: api.bttvEmoteList
var channelFFZEmotes: api.bttvEmoteList
var mutedUsers: string[] = []

const updateBadgesEmotesMuted = (event: any, _globalTwitchBadges: api.twitchBadgeList, _channelTwitchBadges: api.twitchBadgeList, _globalBTTVEmotes: api.bttvEmoteList, _channelBTTVEmotes: api.bttvEmoteList, _channelFFZEmotes: api.bttvEmoteList, _mutedUsers: string[]) => {
    globalTwitchBadges = _globalTwitchBadges
    channelTwitchBadges = _channelTwitchBadges
    globalBTTVEmotes = _globalBTTVEmotes
    channelBTTVEmotes = _channelBTTVEmotes
    channelFFZEmotes = _channelFFZEmotes
    mutedUsers = _mutedUsers
    clear()
}


var chatBox: HTMLDivElement
var nonFirstTimeChatters: Set<string> = new Set()

const clear = () => {

    chatBox = (document.getElementById('chat-box')) as HTMLDivElement
    if(chatBox) chatBox.innerHTML = ''
}

const buildLine = () => {

    // create line element
    let newLine = document.createElement('li')
    newLine.classList.add('message-line')
    newLine.classList.add('doublespace')

    return newLine
}


const buildBadges = async (badges: Badges) => {

    // returns if no badges in message
    if(!badges) return

    // returns if api bugged and didnt pull any badges
    if(!globalTwitchBadges) return

    // create ist of badges in html
    let badgesHTML: HTMLImageElement[] = []

    // loops through each badge
    for(let key in badges) {
        // creates badge element
        let value = badges[key]
        let badge = document.createElement('img')
        badge.classList.add('badge')

        // if subscriber badge
        if(key == 'subscriber')
            // checks to make sure channel has custom sub badges if not use twitch defaults
            if(channelTwitchBadges[key])
                badge.src = channelTwitchBadges[key]['versions'][value]['image_url_1x']
            else
                badge.src = globalTwitchBadges[key]['versions'][value]['image_url_1x']
        // if bits badge
        else if(key == 'bits')
            // checks to make sure channel has custom bit badges if not use twitch defaults
            if(channelTwitchBadges[key])
                badge.src = channelTwitchBadges[key]['versions'][value]['image_url_1x']
            else
                badge.src = globalTwitchBadges[key]['versions'][value]['image_url_1x']
        // all other badges use twitch global badges
        else
            badge.src = globalTwitchBadges[key]['versions'][value]['image_url_1x']
        // adds badge to html badge list
        badgesHTML.push(badge)
    }
    // returns list of html 'img' elements
    return badgesHTML
}

const buildUsernameHTML = (username: string, color: string) => {

    let span = document.createElement('span');
    span.classList.add('username')
    span.style.color = (color) ? color : 'green'
    span.innerText = username

    return span
}

var bttvGlobalEmotes: api.bttvEmoteList
var bttvChannelEmotes: api.bttvEmoteList

const buildTextHTML = (msg: string) => {
    let textHTML = document.createElement('span')
    textHTML.classList.add('message')
    textHTML.innerText = msg
    return textHTML
}

const buildTwitchEmoteHTML = (emoteId: string, size: string) => {
    var emoteLink = `https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/${size}`

    var img = document.createElement('img')
    img.classList.add('emote')

    img.src = emoteLink

    return img
}

const buildBTTVHTML = (emoteId: string) => {
    var emoteLink = `https://cdn.betterttv.net/emote/${emoteId}/1x`

    var img = document.createElement('img')
    img.classList.add('emote')

    img.src = emoteLink

    return img
}

const buildFFZHTML = (emoteId: string) => {
    var emoteLink = `https://cdn.betterttv.net/frankerfacez_emote/${emoteId}/1`

    var img = document.createElement('img')
    img.classList.add('emote')

    img.src = emoteLink

    return img
}

const parseEmotes = (messageHTML: HTMLSpanElement, msg: string, context: ChatUserstate) => {

    var emotes = context['emotes']
    var span;

    var emoteNames: any = {}

    for (var id in emotes) {
        let range = emotes[id][0].split('-')
        range[1] = (parseInt(range[1]) + 1) as any
        let emoteName = msg.substring(parseInt(range[0]), parseInt(range[1]))
        emoteNames[emoteName] = id
    }

    let splitMsg = msg.split(' ')

    let workingMsg = " "
    splitMsg.forEach(function (word) {

        let ChannelBTTVExists = (channelBTTVEmotes != null)
        let ChannelFFZExists = (channelFFZEmotes != null)
        let GlobalBTTVExists = (globalBTTVEmotes != null)

        if (emoteNames[word]) { // regular emote
            if (workingMsg) {
                span = buildTextHTML(workingMsg)
                messageHTML.append(span)
                workingMsg = ""
            }
            let img = buildTwitchEmoteHTML(emoteNames[word], '1.0')
            messageHTML.append(img)

        } else if (ChannelBTTVExists && channelBTTVEmotes[word]) { // bttv emote
            if (workingMsg) {
                span = buildTextHTML(workingMsg)
                messageHTML.append(span)
                workingMsg = ""
            }
            let img = buildBTTVHTML(channelBTTVEmotes[word])
            messageHTML.append(img)

        } else if (GlobalBTTVExists && globalBTTVEmotes[word]) { // global bttv emote
            if (workingMsg) {
                span = buildTextHTML(workingMsg)
                messageHTML.append(span)
                workingMsg = ""
            }
            let img = buildBTTVHTML(globalBTTVEmotes[word])
            messageHTML.append(img)

        } else if(ChannelFFZExists && channelFFZEmotes[word]) {
            if (workingMsg) {
                span = buildTextHTML(workingMsg)
                messageHTML.append(span)
                workingMsg = ""
            }
            let img = buildFFZHTML(channelFFZEmotes[word])
            messageHTML.append(img)
        }else { // not an emote
            workingMsg += word + " "
        }
    })

    if (workingMsg) {
        span = buildTextHTML(workingMsg)
        messageHTML.append(span)
    }

    return messageHTML
}

const buildMessage = (msg: string, context: any) => {

    let messageHTML = document.createElement('span')
    messageHTML.classList.add('message');
    messageHTML.classList.add('message-container');

    // replaces emote text with imgs
    messageHTML = parseEmotes(messageHTML, msg, context)

    return messageHTML
}

const addLine = async (event: any, msg: string,  context: ChatUserstate) => {

    mutedUsers.push('StreamElements')
    mutedUsers.push('roseiol')
    mutedUsers.push('Nightbot')

    if(msg.startsWith('!')) return

    if(mutedUsers.includes(context['display-name'])) return
    if(mutedUsers.includes(context['username'])) return

    chatBox = (document.getElementById('chat-box')) as HTMLDivElement

    // creates empty line
    let newLine = buildLine()

    // adds badges 
    let badgeList = await buildBadges(context['badges'])
    if(badgeList) badgeList.forEach(badge => newLine.append(badge));

    // adds username
    let username = buildUsernameHTML(context['display-name'], context['color'])
    newLine.append(username)
    newLine.append(':')

    // highlights line if username is first time chatter since (per live)
    if(!nonFirstTimeChatters.has(context['display-name'])) {
        newLine.classList.add('highlight')
        nonFirstTimeChatters.add(context['display-name'])
    }

    // adds message
    let message = buildMessage(msg, context)
    newLine.append(message)

    // adds line to chatbox
    chatBox.append(newLine)

    // prunes extra lines if needed
    let allLines = document.getElementsByClassName('message-line')
    if (allLines.length > 120)
        allLines[0].remove()

    // scrolls down
    if(!scrollPaused)
        chatBox.scrollTop = chatBox.scrollHeight

    // resets fade timer
    fadeTimer.reset()
    // fades in chat on every new message
    $('.chat-text').fadeIn()
}

const setFontSize = (event: any, fontSize: number) => {
    $('.chat-text').css('font-size', fontSize + 'px')
}

const setOpacity = (event: any, opacity: number) => {
    $('.chat-text').css('opacity', opacity)
}

const fadeChat = () => {
    console.log('fading out chat')
    $('.chat-text').fadeOut()
}

class Timer {

    private time: number // in seconds
    private action: Function
    private timeout: ReturnType<typeof setTimeout>

    public constructor (action: () => void) {
        this.action = action
    }

    public start(seconds: number) {
        this.time = seconds
        this.reset()
    }

    public reset() {
        clearTimeout(this.timeout)
        this.timer(this.time)
    }
    private timer = (time: number) => {
        if(time != 0)
            this.timeout = setTimeout(() => {
                this.action()
            }, time*1000)
    }
}

let fadeTimer  = new Timer(fadeChat)

const setFadeDelay = (event: any, fadeDelay: number) => {
    $('.chat-text').fadeIn()
    fadeTimer.start(fadeDelay)
}
const loadSettings = (event: any, fontSize: number, opacity: number, fadeDelay: number) => {

    setFontSize(null, fontSize)
    setOpacity(null, opacity)
    setFadeDelay(null, fadeDelay)
}

window.api.receive('unlock', unlock)
window.api.receive('lock', lock)
window.api.receive('toggleLock', toggleLock)
window.api.receive('scrollUp', scrollUp)
window.api.receive('scrollDown', scrollDown)
window.api.receive('addLine', addLine)
window.api.receive('clear', clear)
window.api.receive('updateBadgesEmotesMuted', updateBadgesEmotesMuted)
window.api.receive('loadSettings', loadSettings)
window.api.receive('setFontSize', setFontSize)
window.api.receive('setOpacity', setOpacity)
window.api.receive('setFadeDelay', setFadeDelay)
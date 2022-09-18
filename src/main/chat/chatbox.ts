import { ChatUserstate } from 'tmi.js'

var chatBox : HTMLDivElement

export function init() {
    chatBox = document.createElement('div')
    chatBox.id = 'chat-box'
    chatBox.classList.add('chat-text')

    return chatBox
}

export function clear() {
    chatBox.innerHTML = ''
}

function buildLine() {

    // create line element
    let newLine = document.createElement('li')
    newLine.classList.add('message-line')

    return newLine
}

export function addLine(msg: string, context: ChatUserstate) {

    // build line
    var newLine = buildLine()

    // BADGES
    // list of badges 
    var badgeList = getBadges(context['badges'])
    if (badgeList)
        badgeList.forEach(element => newLine.append(element));

    var username = document.createElement('span');
    username.classList.add('username')
    username.style.color = (context['color']) ? context['color'] : 'green'
    username.innerText = context['display-name']

    newLine.append(username)
    newLine.append(':')

    // Highlight Message if First Time Chatter (for that stream)
    let displayname = context['display-name'];
    if (!nonFirstTimeChatter.has(displayname)) {
        // highlight the newLine
        newLine.classList.add('highlight')
        // add chatter to list of non firsttimechatters
        nonFirstTimeChatter.add(displayname)
    }
    // MESSAGE
    parseEmotes(newLine, msg, context)
    newLine.classList.add('doublespace')

    // prune excess lines to prevent overflow
    let allLines = document.getElementsByClassName('message-line')
    if (allLines.length > 120)
        allLines[0].remove()

    // adds new message line to the chatbox
    chatBox.append(newLine)

    // auto scrolls chatbox
    chatBox.scrollTop = chatBox.scrollHeight
}
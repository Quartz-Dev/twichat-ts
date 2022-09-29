"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var unlock = function () {
    $("body").addClass("body-unlocked");
    $("body").removeClass("body-locked");
    $('#frame').addClass("frame");
};
var lock = function () {
    $("body").addClass("body-locked");
    $("body").removeClass("body-unlocked");
    $('#frame').removeClass("frame");
};
var toggleLock = function () {
    ($('body').hasClass("body-locked")) ? lock() : unlock();
};
var scrollStep = 36;
var scrollPaused = false;
var pauseTime = 5; // in seconds
var tempPauseScroll = function () {
    scrollPaused = true;
    setTimeout(function () {
        scrollPaused = false;
    }, pauseTime * 1000);
};
var scrollUp = function () {
    chatBox.scrollTop = (chatBox.scrollTop - scrollStep);
    scrollPaused = true;
    tempPauseScroll();
};
var scrollDown = function () {
    console.log('scrollDown');
    chatBox.scrollTop = (chatBox.scrollTop + scrollStep);
    tempPauseScroll();
};
var globalTwitchBadges;
var channelTwitchBadges;
var globalBTTVEmotes;
var channelBTTVEmotes;
var channelFFZEmotes;
var mutedUsers = [];
var updateBadgesEmotesMuted = function (event, _globalTwitchBadges, _channelTwitchBadges, _globalBTTVEmotes, _channelBTTVEmotes, _channelFFZEmotes, _mutedUsers) {
    globalTwitchBadges = _globalTwitchBadges;
    channelTwitchBadges = _channelTwitchBadges;
    globalBTTVEmotes = _globalBTTVEmotes;
    channelBTTVEmotes = _channelBTTVEmotes;
    channelFFZEmotes = _channelFFZEmotes;
    mutedUsers = _mutedUsers;
    clear();
};
var chatBox;
var nonFirstTimeChatters = new Set();
var clear = function () {
    chatBox = (document.getElementById('chat-box'));
    if (chatBox)
        chatBox.innerHTML = '';
};
var buildLine = function () {
    // create line element
    var newLine = document.createElement('li');
    newLine.classList.add('message-line');
    newLine.classList.add('doublespace');
    return newLine;
};
var buildBadges = function (badges) { return __awaiter(void 0, void 0, void 0, function () {
    var badgesHTML, key, value, badge;
    return __generator(this, function (_a) {
        // returns if no badges in message
        if (!badges)
            return [2 /*return*/];
        // returns if api bugged and didnt pull any badges
        if (!globalTwitchBadges)
            return [2 /*return*/];
        badgesHTML = [];
        // loops through each badge
        for (key in badges) {
            value = badges[key];
            badge = document.createElement('img');
            badge.classList.add('badge');
            // if subscriber badge
            if (key == 'subscriber')
                // checks to make sure channel has custom sub badges if not use twitch defaults
                if (channelTwitchBadges[key])
                    badge.src = channelTwitchBadges[key]['versions'][value]['image_url_1x'];
                else
                    badge.src = globalTwitchBadges[key]['versions'][value]['image_url_1x'];
            // if bits badge
            else if (key == 'bits')
                // checks to make sure channel has custom bit badges if not use twitch defaults
                if (channelTwitchBadges[key])
                    badge.src = channelTwitchBadges[key]['versions'][value]['image_url_1x'];
                else
                    badge.src = globalTwitchBadges[key]['versions'][value]['image_url_1x'];
            // all other badges use twitch global badges
            else
                badge.src = globalTwitchBadges[key]['versions'][value]['image_url_1x'];
            // adds badge to html badge list
            badgesHTML.push(badge);
        }
        // returns list of html 'img' elements
        return [2 /*return*/, badgesHTML];
    });
}); };
var buildUsernameHTML = function (username, color) {
    var span = document.createElement('span');
    span.classList.add('username');
    span.style.color = (color) ? color : 'green';
    span.innerText = username;
    return span;
};
var bttvGlobalEmotes;
var bttvChannelEmotes;
var buildTextHTML = function (msg) {
    var textHTML = document.createElement('span');
    textHTML.classList.add('message');
    textHTML.innerText = msg;
    return textHTML;
};
var buildTwitchEmoteHTML = function (emoteId, size) {
    var emoteLink = "https://static-cdn.jtvnw.net/emoticons/v1/".concat(emoteId, "/").concat(size);
    var img = document.createElement('img');
    img.classList.add('emote');
    img.src = emoteLink;
    return img;
};
var buildBTTVHTML = function (emoteId) {
    var emoteLink = "https://cdn.betterttv.net/emote/".concat(emoteId, "/1x");
    var img = document.createElement('img');
    img.classList.add('emote');
    img.src = emoteLink;
    return img;
};
var buildFFZHTML = function (emoteId) {
    var emoteLink = "https://cdn.betterttv.net/frankerfacez_emote/".concat(emoteId, "/1");
    var img = document.createElement('img');
    img.classList.add('emote');
    img.src = emoteLink;
    return img;
};
var parseEmotes = function (messageHTML, msg, context) {
    var emotes = context['emotes'];
    var span;
    var emoteNames = {};
    for (var id in emotes) {
        var range = emotes[id][0].split('-');
        range[1] = (parseInt(range[1]) + 1);
        var emoteName = msg.substring(parseInt(range[0]), parseInt(range[1]));
        emoteNames[emoteName] = id;
    }
    var splitMsg = msg.split(' ');
    var workingMsg = " ";
    splitMsg.forEach(function (word) {
        var ChannelBTTVExists = (channelBTTVEmotes != null);
        var ChannelFFZExists = (channelFFZEmotes != null);
        var GlobalBTTVExists = (globalBTTVEmotes != null);
        if (emoteNames[word]) { // regular emote
            if (workingMsg) {
                span = buildTextHTML(workingMsg);
                messageHTML.append(span);
                workingMsg = "";
            }
            var img = buildTwitchEmoteHTML(emoteNames[word], '1.0');
            messageHTML.append(img);
        }
        else if (ChannelBTTVExists && channelBTTVEmotes[word]) { // bttv emote
            if (workingMsg) {
                span = buildTextHTML(workingMsg);
                messageHTML.append(span);
                workingMsg = "";
            }
            var img = buildBTTVHTML(channelBTTVEmotes[word]);
            messageHTML.append(img);
        }
        else if (GlobalBTTVExists && globalBTTVEmotes[word]) { // global bttv emote
            if (workingMsg) {
                span = buildTextHTML(workingMsg);
                messageHTML.append(span);
                workingMsg = "";
            }
            var img = buildBTTVHTML(globalBTTVEmotes[word]);
            messageHTML.append(img);
        }
        else if (ChannelFFZExists && channelFFZEmotes[word]) {
            if (workingMsg) {
                span = buildTextHTML(workingMsg);
                messageHTML.append(span);
                workingMsg = "";
            }
            var img = buildFFZHTML(channelFFZEmotes[word]);
            messageHTML.append(img);
        }
        else { // not an emote
            workingMsg += word + " ";
        }
    });
    if (workingMsg) {
        span = buildTextHTML(workingMsg);
        messageHTML.append(span);
    }
    return messageHTML;
};
var buildMessage = function (msg, context) {
    var messageHTML = document.createElement('span');
    messageHTML.classList.add('message');
    messageHTML.classList.add('message-container');
    // replaces emote text with imgs
    messageHTML = parseEmotes(messageHTML, msg, context);
    return messageHTML;
};
var addLine = function (event, msg, context) { return __awaiter(void 0, void 0, void 0, function () {
    var newLine, badgeList, username, message, allLines;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mutedUsers.push('StreamElements');
                mutedUsers.push('roseiol');
                mutedUsers.push('Nightbot');
                if (msg.startsWith('!'))
                    return [2 /*return*/];
                if (mutedUsers.includes(context['display-name']))
                    return [2 /*return*/];
                if (mutedUsers.includes(context['username']))
                    return [2 /*return*/];
                chatBox = (document.getElementById('chat-box'));
                newLine = buildLine();
                return [4 /*yield*/, buildBadges(context['badges'])];
            case 1:
                badgeList = _a.sent();
                if (badgeList)
                    badgeList.forEach(function (badge) { return newLine.append(badge); });
                username = buildUsernameHTML(context['display-name'], context['color']);
                newLine.append(username);
                newLine.append(':');
                // highlights line if username is first time chatter since (per live)
                if (!nonFirstTimeChatters.has(context['display-name'])) {
                    newLine.classList.add('highlight');
                    nonFirstTimeChatters.add(context['display-name']);
                }
                message = buildMessage(msg, context);
                newLine.append(message);
                // adds line to chatbox
                chatBox.append(newLine);
                allLines = document.getElementsByClassName('message-line');
                if (allLines.length > 120)
                    allLines[0].remove();
                // scrolls down
                if (!scrollPaused)
                    chatBox.scrollTop = chatBox.scrollHeight;
                return [2 /*return*/];
        }
    });
}); };
var setFontSize = function (event, fontSize) {
    $('.chat-text').css('font-size', fontSize + 'px');
};
var setOpacity = function (event, opacity) {
    $('.chat-text').css('opacity', opacity);
};
var setFadeDelay = function (event, fadeDelay) {
    // TODO
};
var loadSettings = function (event, fontSize, opacity, fadeDelay) {
    setFontSize(null, fontSize);
    setOpacity(null, opacity);
    setFadeDelay(null, fadeDelay);
};
window.api.receive('unlock', unlock);
window.api.receive('lock', lock);
window.api.receive('toggleLock', toggleLock);
window.api.receive('scrollUp', scrollUp);
window.api.receive('scrollDown', scrollDown);
window.api.receive('addLine', addLine);
window.api.receive('clear', clear);
window.api.receive('updateBadgesEmotesMuted', updateBadgesEmotesMuted);
window.api.receive('loadSettings', loadSettings);
window.api.receive('setFontSize', setFontSize);
window.api.receive('setOpacity', setOpacity);
window.api.receive('setFadeDelay', setFadeDelay);
//# sourceMappingURL=chat.js.map
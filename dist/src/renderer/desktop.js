"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
// import { channels } from '../shared/constants'
var $ = require("jquery");
var channels = {
    APP_NFO: 'app-info',
    UPDATE_CHAT: 'update-chat',
    CLOSE_APP: 'close',
    MINIMIZE_APP: 'minimize'
};
var sendClose = function () {
    console.log('sendingClose');
    electron_1.ipcRenderer.invoke(channels.CLOSE_APP);
};
$('#closeButton').on('click', sendClose);
var sendMinimize = function () {
    console.log('sendingMinmize');
    electron_1.ipcRenderer.invoke(channels.MINIMIZE_APP);
};
var openSettings = function () {
    console.log('opening settings');
    $('.settings-container').css('display', 'flex');
};
var closeSettings = function () {
    console.log('closing settings');
    $('.settings-container').css('display', 'none');
};
var toggleSettings = function () {
    var state = $('.settings-container').css('display');
    console.log(state);
    state == 'flex' ? closeSettings() : openSettings();
};
$('#minimizeButton').on('click', sendMinimize);
$('#settingsButton').on('click', toggleSettings);
$('main').on('click', closeSettings);
//# sourceMappingURL=desktop.js.map
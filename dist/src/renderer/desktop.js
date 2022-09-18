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
$('#minimizeButton').on('click', sendMinimize);
//# sourceMappingURL=desktop.js.map
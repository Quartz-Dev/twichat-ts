"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var constants_1 = require("../shared/constants");
var $ = require("jquery");
var sendClose = function () {
    console.log('sendingClose');
    electron_1.ipcRenderer.invoke(constants_1.channels.CLOSE_APP);
};
$('#closeButton').on('click', sendClose);
var sendMinimize = function () {
    console.log('sendingMinmize');
    electron_1.ipcRenderer.invoke(constants_1.channels.MINIMIZE_APP);
};
$('#minimizeButton').on('click', sendMinimize);
//# sourceMappingURL=desktop.js.map
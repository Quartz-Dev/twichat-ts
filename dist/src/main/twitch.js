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
exports.connect = exports.msgHandler = exports.disconnect = void 0;
var tmi = require("tmi.js");
var config_1 = require("./config");
var settings = require("electron-settings");
var client;
var chatWebContents;
var mainWebContents;
var disconnect = function () {
    if (!client)
        return;
    console.log(" >>> Disconnecting from ".concat(client.getChannels()[0]));
    return client.disconnect();
};
exports.disconnect = disconnect;
//  (channel: string, userstate: tmi.ChatUserstate, message: string, self: boolean)
var msgHandler = function (channel, context, msg, self) {
    if (chatWebContents)
        chatWebContents.send('addLine', msg, context);
};
exports.msgHandler = msgHandler;
var connect = function (username, _chatWebContents, _mainWebContetnts) { return __awaiter(void 0, void 0, void 0, function () {
    var globalTwitchBadges, channelTwitchBadges, globalBTTVEmotes, channelBTTVEmotes, channelname, pfp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(" >>> Attempting to connect to: ".concat(username));
                if (!username)
                    return [2 /*return*/];
                if (!client) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, exports.disconnect)()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [4 /*yield*/, (0, config_1.refreshApiData)(username)];
            case 3:
                _a.sent();
                return [4 /*yield*/, settings.get('global.badges.twitch')];
            case 4:
                globalTwitchBadges = _a.sent();
                return [4 /*yield*/, settings.get('channel.badges.twitch')];
            case 5:
                channelTwitchBadges = _a.sent();
                return [4 /*yield*/, settings.get('global.emotes.bttv')];
            case 6:
                globalBTTVEmotes = _a.sent();
                return [4 /*yield*/, settings.get('channel.emotes.bttv')];
            case 7:
                channelBTTVEmotes = _a.sent();
                return [4 /*yield*/, settings.get('channel.displayname')];
            case 8:
                channelname = _a.sent();
                return [4 /*yield*/, settings.get('channel.pfp')];
            case 9:
                pfp = _a.sent();
                _mainWebContetnts.send('updateChannelUI', channelname, pfp);
                chatWebContents = _chatWebContents;
                chatWebContents.send('updateBadgesEmotes', globalTwitchBadges, channelTwitchBadges, globalBTTVEmotes, channelBTTVEmotes);
                client = new tmi.Client({
                    channels: [username]
                });
                client.on('connected', function (addr, port) {
                    console.log(" >>> tmi.js conncted to ".concat(addr, ":").concat(port));
                });
                client.on('message', exports.msgHandler);
                // Connects to twitch channel:
                console.log(" >>>  Connecting to '".concat(username, "'"));
                client.connect();
                return [2 /*return*/];
        }
    });
}); };
exports.connect = connect;
//# sourceMappingURL=twitch.js.map
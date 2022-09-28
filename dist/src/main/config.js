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
exports.refreshApiData = exports.setup = void 0;
var settings = require("electron-settings");
// import { DEFAULT_KEYMAP } from './hotkeys'
var settingsConfig = {
    atomicSave: true,
    fileName: 'twichat-settings.json',
    numSpaces: 2,
    prettify: true
};
var defaults = {
    hotkeys: {
    // lock: DEFAULT_KEYMAP.LOCK,
    // hide: DEFAULT_KEYMAP.HIDE
    },
    channel: {
        username: 'roselol',
        displayname: 'roselol',
        id: '152928496',
        pfp: 'https://static-cdn.jtvnw.net/jtv_user_pictures/6883a9fc-5f73-41d9-a1f1-1547df43fd82-profile_image-300x300.png',
        emotes: {
            bttv: {},
            ffz: {}
        },
        badges: {
            twitch: {}
        }
    },
    global: {
        badges: {
            twitch: {}
        },
        emotes: {
            bttv: {}
        }
    },
    chat: {
        size: 18,
        opacity: 1,
        fade: 0,
        locked: false
    }
};
// ran on app start
var setup = function (debug) {
    if (debug === void 0) { debug = false; }
    settings.configure(settingsConfig);
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, !settings.has('hotkeys')];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 3];
                    if (debug)
                        console.log('Using default hotkeys');
                    return [4 /*yield*/, settings.set('hotkeys', defaults.hotkeys)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, !settings.has('channel')];
                case 4:
                    if (!_a.sent()) return [3 /*break*/, 6];
                    if (debug)
                        console.log('Using default channel');
                    return [4 /*yield*/, settings.set('channel', defaults.channel)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [4 /*yield*/, !settings.has('chat')];
                case 7:
                    if (!_a.sent()) return [3 /*break*/, 9];
                    if (debug)
                        console.log('Using default chat settings ');
                    return [4 /*yield*/, settings.set('chat', defaults.chat)];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9:
                    resolve(true);
                    return [2 /*return*/];
            }
        });
    }); });
};
exports.setup = setup;
var api = require("./api");
function refreshApiData(username) {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.fetchData(username)];
                case 1:
                    data = (_a.sent());
                    return [4 /*yield*/, saveChatSettings(data)];
                case 2:
                    _a.sent();
                    resolve(true);
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.refreshApiData = refreshApiData;
function saveChatSettings(data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!data)
                        return [2 /*return*/];
                    return [4 /*yield*/, settings.set('channel.username', data.username)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, settings.set('channel.displayname', data.displayname)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, settings.set('channel.id', data.id)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, settings.set('channel.pfp', (data.pfp).toString())];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, settings.set('channel.emotes.bttv', data.emotes.bttv.channel)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, settings.set('channel.emotes.ffz', data.emotes.ffz.channel)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, settings.set('channel.badges.twitch', data.badges.channel)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, settings.set('global.badges.twitch', (data.badges.global))];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, settings.set('global.emotes.bttv', data.emotes.bttv.global)];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=config.js.map
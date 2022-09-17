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
exports.updateUI = exports.test = exports.registerAll = exports.DEFAULT_KEYMAP = void 0;
var ioHook = require("iohook");
var settings = require("electron-settings");
var regLockID;
var regHideID;
// RAW KEYCODES
var CODE = {
    'BACKSPACE': 8,
    'TAB': 9,
    'ENTER': 13,
    'PAUSE': 19,
    'Caps Lock': 20,
    'ESC': 27,
    'SPACE': 32,
    'PAGE_UP': 33,
    'PAGE_DOWN': 34,
    'END': 35,
    'HOME': 36,
    'LEFT_ARROW': 37,
    'UP_ARROW': 38,
    'RIGHT_ARROW': 39,
    'DOWN_ARROW': 40,
    'PRTSC': 44,
    'INS': 45,
    'DEL': 46,
    '0': 48,
    '1': 49,
    '2': 50,
    '3': 51,
    '4': 52,
    '5': 53,
    '6': 54,
    '7': 55,
    '8': 56,
    '9': 57,
    'A': 65,
    'B': 66,
    'C': 67,
    'D': 68,
    'E': 69,
    'F': 70,
    'G': 71,
    'H': 72,
    'I': 73,
    'J': 74,
    'K': 75,
    'L': 76,
    'M': 77,
    'N': 78,
    'O': 79,
    'P': 80,
    'Q': 81,
    'R': 82,
    'S': 83,
    'T': 84,
    'U': 85,
    'V': 86,
    'W': 87,
    'X': 88,
    'Y': 89,
    'Z': 90,
    'WINDOWS': 91,
    'MENU': 93,
    'F1': 112,
    'F2': 113,
    'F3': 114,
    'F4': 115,
    'F5': 116,
    'F6': 117,
    'F7': 118,
    'F8': 119,
    'F9': 120,
    'F10': 121,
    'F11': 122,
    'F12': 123,
    'SCRLK': 145,
    'L-SHIFT': 160,
    'R-SHIFT': 161,
    'L-CTRL': 162,
    'R-CTRL': 163,
    'L-ALT': 164,
    'R-ALT': 165,
    'MUTE': 173,
    'FAST_FORWARD': 176,
    'REWIND': 177,
    'PLAY_PAUSE': 179,
    ';': 186,
    '=': 187,
    ',': 188,
    '-': 189,
    '.': 190,
    '/': 191,
    '`': 192,
    '[': 219,
    '\\': 220,
    ']': 221,
    '\'': 222
};
exports.DEFAULT_KEYMAP = {
    LOCK: [CODE['L-CTRL'], CODE['Z']],
    HIDE: [CODE['L-CTRL'], CODE['X']]
};
var toggleLockChat = function () {
    //   chat.toggleLock()
    console.log('toggleLockChat');
};
var toggleHideChat = function () {
    //   chat.toggleHide()
    console.log('toggleHideChat');
};
var registerAll = function () { return __awaiter(void 0, void 0, void 0, function () {
    var keymap_lock, keymap_hide;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, settings.get('hotkeys.lock')];
            case 1:
                keymap_lock = (_a.sent());
                return [4 /*yield*/, settings.get('hotkeys.hide')];
            case 2:
                keymap_hide = (_a.sent());
                console.log(keymap_lock);
                console.log(keymap_hide);
                regLockID = ioHook.registerShortcut(keymap_lock, toggleLockChat);
                // regHideID = ioHook.registerShortcut(keymap_hide, toggleHideChat)
                ioHook.useRawcode(true);
                ioHook.start();
                return [2 /*return*/];
        }
    });
}); };
exports.registerAll = registerAll;
var test = function (debug) {
    if (debug === void 0) { debug = false; }
    var key_record = [];
    ioHook.on('keydown', function (event) {
        var key = event === null || event === void 0 ? void 0 : event.rawcode;
        console.log(key_record);
        console.log(key);
        if (!key_record.includes(key)) {
            key_record.push(key);
            if (debug)
                console.log("Pressed: ".concat(getKeyByCode(CODE, key)));
            (0, exports.updateUI)();
        }
    });
    ioHook.on('keyup', function (event) {
        var key = event === null || event === void 0 ? void 0 : event.rawcode;
        var i = key_record.indexOf(key);
        if (i != -1)
            key_record.splice(i, 1);
        if (debug)
            console.log("Let Go: ".concat(getKeyByCode(CODE, key)));
        (0, exports.updateUI)();
    });
};
exports.test = test;
var updateUI = function () {
};
exports.updateUI = updateUI;
function getKeyByCode(KEYCODES, code) {
    return Object.keys(KEYCODES).find(function (code) {
        return KEYCODES[code] === code;
    });
}
//# sourceMappingURL=hotkeys.js.map
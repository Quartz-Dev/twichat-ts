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
var electron_1 = require("electron");
var path = require("path");
var windowStateKeeper = require("electron-window-state");
var hotkeys_1 = require("./hotkeys");
var chat = require("./chat_window");
var config = require("./config");
var constants_1 = require("../shared/constants");
var settings = require("electron-settings");
// IDK IF THIS WORKS YET
if (require('electron-squirrel-startup'))
    electron_1.app.quit();
// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    // return;
}
// IDK IF THIS WORKS YET
function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false;
    }
    var ChildProcess = require('child_process');
    var path = require('path');
    var appFolder = path.resolve(process.execPath, '..');
    var rootAtomFolder = path.resolve(appFolder, '..');
    var updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    var exeName = path.basename(process.execPath);
    var spawn = function (command, args) {
        var spawnedProcess, error;
        try {
            spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
        }
        catch (error) { }
        return spawnedProcess;
    };
    var spawnUpdate = function (args) {
        return spawn(updateDotExe, args);
    };
    var squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus
            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);
            setTimeout(electron_1.app.quit, 1000);
            return true;
        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers
            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);
            setTimeout(electron_1.app.quit, 1000);
            return true;
        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated
            electron_1.app.quit();
            return true;
    }
}
;
// IF TRUE TURNS ON DEV TOOLS FOR BOTH WINDOWS
var debug = false;
var mainWindow;
var toggleDevTools = function () {
    mainWindow.webContents.toggleDevTools();
    chat.toggleDevTools();
};
var createMainWindow = function (channelname, pfp, fontSize, opacity, fadeDelay, debug) {
    if (debug === void 0) { debug = false; }
    // Create the browser window
    var mainWindowState = windowStateKeeper({
        file: 'desktop-window-state.json',
        defaultWidth: 300,
        defaultHeight: 450
    });
    mainWindow = new electron_1.BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        show: false,
        // backgroundColor: global.colors.BACKGROUND,
        frame: false,
        icon: path.join(__dirname, '../../../public/icons/twichat-icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, '../shared/preload.js')
        }
    });
    // remembers window state when closing/reopening apps
    mainWindowState.manage(mainWindow);
    // disables right click context menu (weird hack for frameless window)
    mainWindow.on("system-context-menu", function (event, _point) {
        event.preventDefault();
    });
    // shows the page after electron finishes setup
    mainWindow.once('ready-to-show', function () {
        mainWindow.show();
        mainWindow.webContents.send('settings', channelname, pfp, fontSize, opacity, fadeDelay);
    });
    // disables resizing of window
    mainWindow.setResizable(false);
    // loads main page of the app
    mainWindow.loadFile(path.join(__dirname, '../../../public/html/desktop.html'));
    // closes app
    mainWindow.on('close', function (event) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                chat.close();
                electron_1.app.quit();
                return [2 /*return*/];
            });
        });
    });
    // Open the DevTools.
    if (debug)
        mainWindow.webContents.openDevTools();
    // mainWindow.webContents.openDevTools();
};
// app.disableHardwareAcceleration()
electron_1.app.on("ready", function () {
    return __awaiter(this, void 0, void 0, function () {
        var fontSize, opacity, fadeDelay, channelname, pfp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, config.setup(true)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, settings.get('chat.size')];
                case 2:
                    fontSize = (_a.sent());
                    return [4 /*yield*/, settings.get('chat.opacity')];
                case 3:
                    opacity = (_a.sent());
                    return [4 /*yield*/, settings.get('chat.fade')];
                case 4:
                    fadeDelay = (_a.sent());
                    return [4 /*yield*/, settings.get('channel.displayname')];
                case 5:
                    channelname = (_a.sent());
                    return [4 /*yield*/, settings.get('channel.pfp')];
                case 6:
                    pfp = (_a.sent());
                    createMainWindow(channelname, pfp, fontSize, opacity, fadeDelay, debug);
                    chat.launch(mainWindow.webContents, fontSize, opacity, fadeDelay, debug);
                    setupHotkeys();
                    return [2 /*return*/];
            }
        });
    });
});
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.ipcMain.handle(constants_1.channels.CLOSE_APP, function () {
    chat.close();
    electron_1.app.quit();
});
electron_1.ipcMain.handle(constants_1.channels.MINIMIZE_APP, function () {
    mainWindow.minimize();
});
// HOTKEYS
var hotkeys;
var setupShowHotkey = function (key_map) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        hotkeys.register(key_map, chat.toggleShow);
        return [2 /*return*/];
    });
}); };
var setupLockHotkey = function (key_map) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        hotkeys.register(key_map, chat.toggleLock);
        return [2 /*return*/];
    });
}); };
var setupScrollUpHotkey = function (key_map) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        hotkeys.register(key_map, chat.scrollUp);
        return [2 /*return*/];
    });
}); };
var setupScrollDownHotkey = function (key_map) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        hotkeys.register(key_map, chat.scrollDown);
        return [2 /*return*/];
    });
}); };
var setupScrollWheelHotkey = function (key_map) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        hotkeys.registerScroll(key_map, chat.scrollUp, chat.scrollDown);
        return [2 /*return*/];
    });
}); };
var setupDevToolsHotkey = function (key_map) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        hotkeys.register(key_map, toggleDevTools);
        return [2 /*return*/];
    });
}); };
var setupHotkeys = function () { return __awaiter(void 0, void 0, void 0, function () {
    var hotkeyShow, hotkeyLock, hotkeyScrollUp, hotkeyScrollDown, hotKeyScrollWheel, hotKeyDevTools;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                hotkeys = new hotkeys_1["default"]();
                return [4 /*yield*/, settings.get('hotkeys.show')];
            case 1:
                hotkeyShow = _a.sent();
                return [4 /*yield*/, settings.get('hotkeys.lock')];
            case 2:
                hotkeyLock = _a.sent();
                setupShowHotkey(hotkeyShow);
                setupLockHotkey(hotkeyLock);
                return [4 /*yield*/, settings.get('hotkeys.scrollUp')];
            case 3:
                hotkeyScrollUp = _a.sent();
                return [4 /*yield*/, settings.get('hotkeys.scrollDown')];
            case 4:
                hotkeyScrollDown = _a.sent();
                return [4 /*yield*/, settings.get('hotkeys.scrollWheel')];
            case 5:
                hotKeyScrollWheel = _a.sent();
                setupScrollUpHotkey(hotkeyScrollUp);
                setupScrollDownHotkey(hotkeyScrollDown);
                setupScrollWheelHotkey(hotKeyScrollWheel);
                return [4 /*yield*/, settings.get('hotkeys.devTools')];
            case 6:
                hotKeyDevTools = _a.sent();
                setupDevToolsHotkey(hotKeyDevTools);
                hotkeys.run();
                return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=main.js.map
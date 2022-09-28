"use strict";
exports.__esModule = true;
// Note: Can't use electrons built in 'globalShortcut' feature as it overrides the native system shortcuts and prevents them from going thru
// - ie: CTRL+Z would remove undo 
var uiohook_napi_1 = require("uiohook-napi");
var Hotkeys = /** @class */ (function () {
    function Hotkeys() {
        var _this = this;
        this.keys_pressed = [];
        this.hotkey_map = new Map();
        this.register = function (keys, action) {
            _this.hotkey_map.set(keys, action);
        };
        this.run = function (debug) {
            if (debug === void 0) { debug = false; }
            uiohook_napi_1.uIOhook.on('keydown', function (event) {
                var key = event.keycode;
                if (!_this.keys_pressed.includes(key)) {
                    _this.keys_pressed.push(key);
                    if (debug)
                        console.log("Pressed: ".concat(key));
                    _this.hotkey_map.forEach(function (action, hotkeys) {
                        if (hotkeys.every(function (key) { return _this.keys_pressed.includes(key); })) {
                            if (debug)
                                console.log("Hotkey Pressed: ".concat(hotkeys));
                            action();
                        }
                    });
                }
            });
            uiohook_napi_1.uIOhook.on('keyup', function (event) {
                var key = event.keycode;
                var i = _this.keys_pressed.indexOf(key);
                if (i != -1)
                    _this.keys_pressed.splice(i, 1);
                if (debug)
                    console.log("Let Go: ".concat(key));
            });
            uiohook_napi_1.uIOhook.on('wheel', function (event) {
                var direction = event.rotation === 1 ? 'DOWN' : 'UP';
                if (_this.keys_pressed.includes(uiohook_napi_1.UiohookKey.Ctrl)) {
                    if (debug)
                        console.log("Scroll Direction: ".concat(direction));
                }
            });
            uiohook_napi_1.uIOhook.start();
        };
    }
    return Hotkeys;
}());
exports["default"] = Hotkeys;
//# sourceMappingURL=hotkeys.js.map
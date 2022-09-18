import { uIOhook, UiohookKey } from 'uiohook-napi'
import * as settings from 'electron-settings'

let regLockID: number
let regHideID: number

// uIOhook.on('keydown', (e) => {
//     if (e.keycode === UiohookKey.Q) {
//       console.log('Hello!')
//     }
  
//     if (e.keycode === UiohookKey.Escape) {
//       process.exit(0)
//     }
//   })
  
//   uIOhook.start()



// RAW KEYCODES
const CODE = {
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
    '\'': 222,
}

export const DEFAULT_KEYMAP = {
    LOCK: [CODE['L-CTRL'], CODE['Z']],
    HIDE: [CODE['L-CTRL'], CODE['X']]
}

// const toggleLockChat = () => {
// //   chat.toggleLock()
//     console.log('toggleLockChat')
// }

// const toggleHideChat = () => {
// //   chat.toggleHide()
//     console.log('toggleHideChat')
// }

// export const registerAll = async () => {
//     let keymap_lock = (await settings.get('hotkeys.lock')) as number[]
//     let keymap_hide = (await settings.get('hotkeys.hide')) as number[]
//     console.log(keymap_lock)
//     console.log(keymap_hide)
//     regLockID = ioHook.registerShortcut(keymap_lock, toggleLockChat)
//     // regHideID = ioHook.registerShortcut(keymap_hide, toggleHideChat)

//     ioHook.useRawcode(true)
//     ioHook.start();
// }

// export const test = (debug:boolean = false) => {

//     let key_record: number[] = []
//     ioHook.on('keydown', event => {
//         let key: number = event?.rawcode
//         console.log(key_record)
//         console.log(key)
//         if(!key_record.includes(key)) {
//             key_record.push(key)
//             if(debug) console.log(`Pressed: ${getKeyByCode(CODE, key)}`)
//             updateUI()
//         }
//     })

//     ioHook.on('keyup', event => {
//         let key: number = event?.rawcode
//         let i: number = key_record.indexOf(key)
//         if(i!= -1) key_record.splice(i, 1)
//         if(debug) console.log(`Let Go: ${getKeyByCode(CODE, key)}`)
//         updateUI()
//     })
    


// }

// export const updateUI = () => {

// }

// function getKeyByCode(KEYCODES: object, code: number) {
//     return (Object.keys(KEYCODES) as (keyof typeof KEYCODES)[]).find((code) => {
//         return KEYCODES[code] === code;
//     })
// }
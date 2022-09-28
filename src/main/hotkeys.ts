// Note: Can't use electrons built in 'globalShortcut' feature as it overrides the native system shortcuts and prevents them from going thru
// - ie: CTRL+Z would remove undo 
import { uIOhook, UiohookKey } from 'uiohook-napi'

export default class Hotkeys {

    private keys_pressed: number[] = []
    private hotkey_map: Map<number[], Function> = new Map()

    public register = (keys:number[], action: () => void) => {
        this.hotkey_map.set(keys, action)
    }

    public run = (debug: boolean = false) => {
        uIOhook.on('keydown', event => {
            let key: number = event.keycode
            if(!this.keys_pressed.includes(key)) {
                this.keys_pressed.push(key)
                if(debug) console.log(`Pressed: ${key}`)

                this.hotkey_map.forEach((action, hotkeys: number[]) => {
                    if(hotkeys.every(key => this.keys_pressed.includes(key))) {
    
                        if(debug) console.log(`Hotkey Pressed: ${hotkeys}`)
                        action()
                    }
                })
            }
        })
    
        uIOhook.on('keyup', event => {
            let key: number = event.keycode
            let i: number = this.keys_pressed.indexOf(key)
            if(i!= -1) this.keys_pressed.splice(i, 1)
            if(debug) console.log(`Let Go: ${key}`)
        })

        uIOhook.on('wheel', event => {
            let direction = event.rotation === 1 ? 'DOWN' : 'UP'
            if(this.keys_pressed.includes(UiohookKey.Ctrl)) {
                if(debug) console.log(`Scroll Direction: ${direction}`)
            }
        })

        uIOhook.start()
    }
}
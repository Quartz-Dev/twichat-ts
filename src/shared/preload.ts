const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("api", {
        send: (channel: string, data: any) => {
            ipcRenderer.invoke(channel, data).catch(e => console.log(e))
        },
        receive: (channel: string, func: Function) => {
          ipcRenderer.on(channel, (event, ...args) => func(event, ...args))
        }
    })
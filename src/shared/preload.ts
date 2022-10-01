const { contextBridge, ipcRenderer } = require('electron')
const shell = require('electron').shell

contextBridge.exposeInMainWorld("api", {
  send: (channel: string, data: any) => {
      ipcRenderer.invoke(channel, data).catch(e => console.log(e))
  },
  receive: (channel: string, func: Function) => {
    ipcRenderer.on(channel, (event, ...args) => func(event, ...args))
  }
})
contextBridge.exposeInMainWorld("shell", {
  openExternal: (href: string) => {
    shell.openExternal(href)
  }
})
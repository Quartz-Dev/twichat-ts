import { ipcRenderer, remote } from "electron"
import { channels } from '../shared/constants'
import * as $ from 'jquery'

const sendClose = () => {
    console.log('sendingClose')
    ipcRenderer.invoke(channels.CLOSE_APP)
}
$('#closeButton').on('click', sendClose)

const sendMinimize = () => {
    console.log('sendingMinmize')
    ipcRenderer.invoke(channels.MINIMIZE_APP)
}
$('#minimizeButton').on('click', sendMinimize)

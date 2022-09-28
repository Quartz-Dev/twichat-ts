import { ipcRenderer } from "electron"
// import { channels } from '../shared/constants'
import * as $ from 'jquery'

const channels = {
    APP_NFO: 'app-info',
    UPDATE_CHAT: 'update-chat',
    CLOSE_APP: 'close',
    MINIMIZE_APP: 'minimize'
};

const sendClose = () => {
    console.log('sendingClose')
    ipcRenderer.invoke(channels.CLOSE_APP)
}
$('#closeButton').on('click', sendClose)

const sendMinimize = () => {
    console.log('sendingMinmize')
    ipcRenderer.invoke(channels.MINIMIZE_APP)
}

const openSettings = () => {
    console.log('opening settings')
    $('.settings-container').css('display', 'flex')
}

const closeSettings = () => {
    console.log('closing settings')
    $('.settings-container').css('display', 'none')
}

const toggleSettings = () => {
    let state = $('.settings-container').css('display')
    console.log(state)
    state == 'flex' ? closeSettings() : openSettings()
}

$('#minimizeButton').on('click', sendMinimize)

$('#settingsButton').on('click', toggleSettings)

$('main').on('click', closeSettings)
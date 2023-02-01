// background/renderer api constants
const channels = {
    APP_NFO: 'app-info',
    UPDATE_CHAT: 'update-chat',
    CLOSE_APP: 'close',
    MINIMIZE_APP: 'minimize'
};

// current channel local variable
var currChannel: string

// sends close app to background
const sendClose = () => {
    window.api.send(channels.CLOSE_APP)
}

// close app button
$('#closeButton').on('click', sendClose)

// sends minimize app to background
const sendMinimize = () => {
    window.api.send(channels.MINIMIZE_APP)
}

// onclick minimizes app
$('#minimizeButton').on('click', sendMinimize)

// open settings function
const openSettings = () => {
    $('.settings-container').css('display', 'flex')
    // $('.settings-container').removeClass('settings-closed')
    // $('.settings-container').addClass('settings-opened')
}

// close settings function
const closeSettings = () => {
    $('.settings-container').css('display', 'none')
    // $('.settings-container').removeClass('settings-opened')
    // $('.settings-container').addClass('settings-closed')
}

// toggle settings tab function
const toggleSettings = () => {
    let state = $('.settings-container').css('display')
    state == 'flex' ? closeSettings() : openSettings()
}
$('#settingsButton').on('click', toggleSettings)

// closes settings tab when clicking out of it
$('main').on('click', closeSettings)

// font size
// mirrors slider and number text
$('#font-size-text').on('input', function() {
    let fontSize = $(this).val()
    $('#font-size-slider').val(fontSize)
    window.api.send('updateFontSize', fontSize)
})

// mirrors slider and number text
$('#font-size-slider').on('input', function() {
    let fontSize = $(this).val()
    $('#font-size-text').val($(this).val())
    window.api.send('updateFontSize', fontSize)
})

// opacity
// mirrors slider and number text
$('#opacity-text').on('input', function() {
    let opacity = $(this).val()
    $('#opacity-slider').val(opacity)
    window.api.send('updateOpacity', opacity)
})

// mirrors slider and number text
$('#opacity-slider').on('input', function() {
    let opacity = $(this).val()
    $('#opacity-text').val(opacity)
    window.api.send('updateOpacity', opacity)
})

// fade delay
// mirrors slider and number text
$('#fade-delay-text').on('input', function() {
    let fadeDelay = $(this).val()
    $('#fade-delay-slider').val(fadeDelay)
    if(fadeDelay == 0) $('#fade-delay-text').val('')
    if(fadeDelay == '') $('#fade-delay-slider').val(0)
    window.api.send('updateFadeDelay', fadeDelay)
})

// mirrors slider and number text
$('#fade-delay-slider').on('input', function() {
    let fadeDelay = $(this).val()
    $('#fade-delay-text').val(fadeDelay)
    if(fadeDelay == 0) $('#fade-delay-text').val('')
    window.api.send('updateFadeDelay', fadeDelay)
})

const updateSettingsInputs = (event: any, channelname: string, pfp: string, fontSize: number, opacity: number, fadeDelay: number) => {

    updateChannelUI(null, channelname, pfp)

    // updates font size sliders
    $('#font-size-text').val(fontSize)
    $('#font-size-slider').val(fontSize)

    // updates font opacity sliders
    $('#opacity-text').val(opacity)
    $('#opacity-slider').val(opacity)

    // updates fade delay sliders
    $('#fade-delay-text').val(fadeDelay == 0 ? '' : fadeDelay)
    $('#fade-delay-slider').val(fadeDelay)
}


// updates channel pfp with given url
const updateChannelUI = (event: any, channelname: string, pfp: string) => {
    currChannel = channelname
    $('#channel-name-text').val(channelname)
    $('.pfp').attr('src', pfp)
}

// onclick, autofocuses and highlights channel username text
$('.selected-channel-container').on('click', function(){
    $('#channel-name-text').trigger('focus')
    $('#channel-name-text').trigger('select')
})

// onclick tells background to toggle show
$('#toggle-show').on('click', function() {
    window.api.send('toggleShow')
})

// onclick tells background to toggle lock
$('#toggle-lock').on('click', function() {
    window.api.send('toggleLock')
})

// toggles show switch function
const updateShowSwitch = (event: any, isShown: boolean) => {
    let switchState = $('#1-toggle-show').prop('checked')
    $('#1-toggle-show').prop('checked', isShown)
    $('#toggle-show').prop('checked', isShown)
}

// toggles lock switch function
const updateLockSwitch = (event: any, isLocked: boolean) => {
    let switchState = $('#2-toggle-lock').prop('checked')
    $('#2-toggle-lock').prop('checked', isLocked)
}

// when pressed enter inside channel text box
$(".selected-channel-container").on('keyup', function (event) {
    if (event.key == 'Enter') {
        $('#channel-name-text').trigger('blur')
        // this also triggers 'focusout'
    }
})

// when clicking out of channel text box
// this is also called on keyup
$(".selected-channel-container").on('focusout', function (event) {
    let username =  $('#channel-name-text').val() as string
    if(currChannel != username) setChannel(username)
})

function setChannel(username: string) {

    // removes spaces (twitch usernames dont have spaces)
    username = username.replace(/\s+/g, '')

    // tells backend new channel
    window.api.send('setChannel', username)
}

const userNotFound = () => {
    console.log('USER NOT FOUND')

    // changes pfp to default pfp
    $('.pfp').attr('src', '')

    // auto highlights channel input
    $('#channel-name-text').trigger('focus')
    $('#channel-name-text').trigger('select')
}

$(document).on('click', 'a[href^="https"]', function(event) {

    // prevents urls from opening inside the app
    event.preventDefault()

    // opens url in default browser
    window.shell.openExternal(this.href)
})

// listens from background process

// updates the settings ui
window.api.receive('settings', updateSettingsInputs)

// updates show/lock switches
window.api.receive('updateShowSwitch', updateShowSwitch)
window.api.receive('updateLockSwitch', updateLockSwitch)

// updates channel username
window.api.receive('updateChannelUI', updateChannelUI)

// updates if user not found
window.api.receive('userNotFound', userNotFound)
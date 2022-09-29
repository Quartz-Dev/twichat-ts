const channels = {
    APP_NFO: 'app-info',
    UPDATE_CHAT: 'update-chat',
    CLOSE_APP: 'close',
    MINIMIZE_APP: 'minimize'
};

var currChannel: string

const sendClose = () => {
    window.api.send(channels.CLOSE_APP)
}
$('#closeButton').on('click', sendClose)

const sendMinimize = () => {
    window.api.send(channels.MINIMIZE_APP)
}
$('#minimizeButton').on('click', sendMinimize)

const openSettings = () => {
    $('.settings-container').css('display', 'flex')
}

const closeSettings = () => {
    $('.settings-container').css('display', 'none')
}

const toggleSettings = () => {
    let state = $('.settings-container').css('display')
    state == 'flex' ? closeSettings() : openSettings()
}
$('#settingsButton').on('click', toggleSettings)



$('main').on('click', closeSettings)

// font size
$('#font-size-text').on('input', function() {
    let fontSize = $(this).val()
    $('#font-size-slider').val(fontSize)
    window.api.send('updateFontSize', fontSize)
})

$('#font-size-slider').on('input', function() {
    let fontSize = $(this).val()
    $('#font-size-text').val($(this).val())
    window.api.send('updateFontSize', fontSize)
})

// opacity
$('#opacity-text').on('input', function() {
    let opacity = $(this).val()
    $('#opacity-slider').val(opacity)
    window.api.send('updateOpacity', opacity)
})

$('#opacity-slider').on('input', function() {
    let opacity = $(this).val()
    $('#opacity-text').val(opacity)
    window.api.send('updateOpacity', opacity)
})

// fadeout delay
$('#fade-delay-text').on('input', function() {
    let fadeDelay = $(this).val()
    $('#fade-delay-slider').val(fadeDelay)
    window.api.send('updateFadeDelay', fadeDelay)
})

$('#fade-delay-slider').on('input', function() {
    let fadeDelay = $(this).val()
    $('#fade-delay-text').val(fadeDelay)
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
    $('#fade-delay-text').val(fadeDelay)
    $('#fade-delay-slider').val(fadeDelay)
}

const updateChannelUI = (event: any, channelname: string, pfp: string) => {
    currChannel = channelname
    $('#channel-name-text').val(channelname)
    $('.pfp').attr('src', pfp)
}

$('.selected-channel-container').on('click', function(){
    $('#channel-name-text').trigger('focus')
    $('#channel-name-text').trigger('select')
})

$('#toggle-show').on('click', function() {
    window.api.send('toggleShow')
})

$('#toggle-lock').on('click', function() {
    window.api.send('toggleLock')
})

const updateShowSwitch = (event: any, isShown: boolean) => {
    let switchState = $('#1-toggle-show').prop('checked')
    $('#1-toggle-show').prop('checked', isShown)
    $('#toggle-show').prop('checked', isShown)
}

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
    window.api.send('setChannel', username)
}

window.api.receive('settings', updateSettingsInputs)
window.api.receive('updateShowSwitch', updateShowSwitch)
window.api.receive('updateLockSwitch', updateLockSwitch)
window.api.receive('updateChannelUI', updateChannelUI)
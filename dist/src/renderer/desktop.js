// background/renderer api constants
var channels = {
    APP_NFO: 'app-info',
    UPDATE_CHAT: 'update-chat',
    CLOSE_APP: 'close',
    MINIMIZE_APP: 'minimize'
};
// current channel local variable
var currChannel;
// sends close app to background
var sendClose = function () {
    window.api.send(channels.CLOSE_APP);
};
// close app button
$('#closeButton').on('click', sendClose);
// sends minimize app to background
var sendMinimize = function () {
    window.api.send(channels.MINIMIZE_APP);
};
// onclick minimizes app
$('#minimizeButton').on('click', sendMinimize);
// open settings function
var openSettings = function () {
    $('.settings-container').css('display', 'flex');
    // $('.settings-container').removeClass('settings-closed')
    // $('.settings-container').addClass('settings-opened')
};
// close settings function
var closeSettings = function () {
    $('.settings-container').css('display', 'none');
    // $('.settings-container').removeClass('settings-opened')
    // $('.settings-container').addClass('settings-closed')
};
// toggle settings tab function
var toggleSettings = function () {
    var state = $('.settings-container').css('display');
    state == 'flex' ? closeSettings() : openSettings();
};
$('#settingsButton').on('click', toggleSettings);
// closes settings tab when clicking out of it
$('main').on('click', closeSettings);
// font size
// mirrors slider and number text
$('#font-size-text').on('input', function () {
    var fontSize = $(this).val();
    $('#font-size-slider').val(fontSize);
    window.api.send('updateFontSize', fontSize);
});
// mirrors slider and number text
$('#font-size-slider').on('input', function () {
    var fontSize = $(this).val();
    $('#font-size-text').val($(this).val());
    window.api.send('updateFontSize', fontSize);
});
// opacity
// mirrors slider and number text
$('#opacity-text').on('input', function () {
    var opacity = $(this).val();
    $('#opacity-slider').val(opacity);
    window.api.send('updateOpacity', opacity);
});
// mirrors slider and number text
$('#opacity-slider').on('input', function () {
    var opacity = $(this).val();
    $('#opacity-text').val(opacity);
    window.api.send('updateOpacity', opacity);
});
// fade delay
// mirrors slider and number text
$('#fade-delay-text').on('input', function () {
    var fadeDelay = $(this).val();
    $('#fade-delay-slider').val(fadeDelay);
    if (fadeDelay == 0)
        $('#fade-delay-text').val('');
    if (fadeDelay == '')
        $('#fade-delay-slider').val(0);
    window.api.send('updateFadeDelay', fadeDelay);
});
// mirrors slider and number text
$('#fade-delay-slider').on('input', function () {
    var fadeDelay = $(this).val();
    $('#fade-delay-text').val(fadeDelay);
    if (fadeDelay == 0)
        $('#fade-delay-text').val('');
    window.api.send('updateFadeDelay', fadeDelay);
});
var updateSettingsInputs = function (event, channelname, pfp, fontSize, opacity, fadeDelay) {
    updateChannelUI(null, channelname, pfp);
    // updates font size sliders
    $('#font-size-text').val(fontSize);
    $('#font-size-slider').val(fontSize);
    // updates font opacity sliders
    $('#opacity-text').val(opacity);
    $('#opacity-slider').val(opacity);
    // updates fade delay sliders
    $('#fade-delay-text').val(fadeDelay == 0 ? '' : fadeDelay);
    $('#fade-delay-slider').val(fadeDelay);
};
// updates channel pfp with given url
var updateChannelUI = function (event, channelname, pfp) {
    currChannel = channelname;
    $('#channel-name-text').val(channelname);
    $('.pfp').attr('src', pfp);
};
// onclick, autofocuses and highlights channel username text
$('.selected-channel-container').on('click', function () {
    $('#channel-name-text').trigger('focus');
    $('#channel-name-text').trigger('select');
});
// onclick tells background to toggle show
$('#toggle-show').on('click', function () {
    window.api.send('toggleShow');
});
// onclick tells background to toggle lock
$('#toggle-lock').on('click', function () {
    window.api.send('toggleLock');
});
// toggles show switch function
var updateShowSwitch = function (event, isShown) {
    var switchState = $('#1-toggle-show').prop('checked');
    $('#1-toggle-show').prop('checked', isShown);
    $('#toggle-show').prop('checked', isShown);
};
// toggles lock switch function
var updateLockSwitch = function (event, isLocked) {
    var switchState = $('#2-toggle-lock').prop('checked');
    $('#2-toggle-lock').prop('checked', isLocked);
};
// when pressed enter inside channel text box
$(".selected-channel-container").on('keyup', function (event) {
    if (event.key == 'Enter') {
        $('#channel-name-text').trigger('blur');
        // this also triggers 'focusout'
    }
});
// when clicking out of channel text box
// this is also called on keyup
$(".selected-channel-container").on('focusout', function (event) {
    var username = $('#channel-name-text').val();
    if (currChannel != username)
        setChannel(username);
});
function setChannel(username) {
    // removes spaces (twitch usernames dont have spaces)
    username = username.replace(/\s+/g, '');
    // tells backend new channel
    window.api.send('setChannel', username);
}
var userNotFound = function () {
    console.log('USER NOT FOUND');
    // changes pfp to default pfp
    $('.pfp').attr('src', '');
    // auto highlights channel input
    $('#channel-name-text').trigger('focus');
    $('#channel-name-text').trigger('select');
};
$(document).on('click', 'a[href^="https"]', function (event) {
    // prevents urls from opening inside the app
    event.preventDefault();
    // opens url in default browser
    window.shell.openExternal(this.href);
});
// listens from background process
// updates the settings ui
window.api.receive('settings', updateSettingsInputs);
// updates show/lock switches
window.api.receive('updateShowSwitch', updateShowSwitch);
window.api.receive('updateLockSwitch', updateLockSwitch);
// updates channel username
window.api.receive('updateChannelUI', updateChannelUI);
// updates if user not found
window.api.receive('userNotFound', userNotFound);
//# sourceMappingURL=desktop.js.map
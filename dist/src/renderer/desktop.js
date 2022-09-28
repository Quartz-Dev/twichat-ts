var channels = {
    APP_NFO: 'app-info',
    UPDATE_CHAT: 'update-chat',
    CLOSE_APP: 'close',
    MINIMIZE_APP: 'minimize'
};
var sendClose = function () {
    console.log('sendingClose');
    window.api.send(channels.CLOSE_APP);
};
$('#closeButton').on('click', sendClose);
var sendMinimize = function () {
    console.log('sendingMinmize');
    window.api.send(channels.MINIMIZE_APP);
};
var openSettings = function () {
    console.log('opening settings');
    $('.settings-container').css('display', 'flex');
};
var closeSettings = function () {
    console.log('closing settings');
    $('.settings-container').css('display', 'none');
};
var toggleSettings = function () {
    var state = $('.settings-container').css('display');
    console.log(state);
    state == 'flex' ? closeSettings() : openSettings();
};
$('#minimizeButton').on('click', sendMinimize);
$('#settingsButton').on('click', toggleSettings);
$('main').on('click', closeSettings);
// font size
$('#font-size-text').on('input', function () {
    var fontSize = $(this).val();
    $('#font-size-slider').val(fontSize);
    window.api.send('updateFontSize', fontSize);
});
$('#font-size-slider').on('input', function () {
    var fontSize = $(this).val();
    $('#font-size-text').val($(this).val());
    window.api.send('updateFontSize', fontSize);
});
// opacity
$('#opacity-text').on('input', function () {
    var opacity = $(this).val();
    $('#opacity-slider').val(opacity);
    window.api.send('updateOpacity', opacity);
});
$('#opacity-slider').on('input', function () {
    var opacity = $(this).val();
    $('#opacity-text').val(opacity);
    window.api.send('updateOpacity', opacity);
});
// fadeout delay
$('#fade-delay-text').on('input', function () {
    var fadeDelay = $(this).val();
    $('#fade-delay-slider').val(fadeDelay);
    window.api.send('updateFadeDelay', fadeDelay);
});
$('#fade-delay-slider').on('input', function () {
    var fadeDelay = $(this).val();
    $('#fade-delay-text').val(fadeDelay);
    window.api.send('updateFadeDelay', fadeDelay);
});
var updateSettingsInputs = function (event, fontSize, opacity, fadeDelay) {
    console.log(">> Settings");
    console.log(fontSize);
    console.log(opacity);
    console.log(fadeDelay);
    console.log("<<");
    // updates font size sliders
    $('#font-size-text').val(fontSize);
    $('#font-size-slider').val(fontSize);
    // updates font opacity sliders
    $('#opacity-text').val(opacity);
    $('#opacity-slider').val(opacity);
    // updates fade delay sliders
    $('#fade-delay-text').val(fadeDelay);
    $('#fade-delay-slider').val(fadeDelay);
};
window.api.receive('settings', updateSettingsInputs);
//# sourceMappingURL=desktop.js.map
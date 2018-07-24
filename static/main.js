/* * * * * * *
* Name: Leony Brok
* Web Programming with Python and Javascript
*
*
* * * * * * */

// Wait until DOM has loaded.
document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket.
    socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // Notification sound.
    notification = new Audio('static/light.mp3');

    // Audio toggle button.
    document.getElementById("audio_toggle").addEventListener("click", toggle_audio);

    // Get username from local storage.
    const username = localStorage.getItem('username');

    // If user hasn't chosen a name: prompt for username.
    if (!username) {
        username_modal();
    }
    else {
        welcome_message(username);
    }

    // If channel was remembered, go to that channel.
    if (localStorage.getItem('current_channel')) {
        join_channel(localStorage.getItem('current_channel'));
    }

    // Show tooltop when new channel already exists.
    socket.on('channel_exists', () => {
        $('#channel_name').tooltip({'placement': 'top', 'trigger': 'manual', 'title': 'Channel already exists.'});
        $('#channel_name').tooltip('show');
    });

    // When new channel is broadcasted.
    socket.on('channels', channel_broadcasted);

    // When a new message is broadcasted.
    socket.on('new_message', message_broadcasted);

    // When a deleted message is broadcasted.
    socket.on('deleted_message', deleted_broadcasted);
});

// Toggle audio when button is clicked.
function toggle_audio() {

    var icon = document.getElementById("audio_toggle");

    if (notification.muted) {
        // Unmute audio.
        notification.muted = false;

        icon.classList.remove('fa-volume-off');
        icon.classList.add('fa-volume-up');
    } else {
        // Mute audio.
        notification.muted = true;

        icon.classList.remove('fa-volume-up');
        icon.classList.add('fa-volume-off');
    }
}

/* * * * * * *
* Make first letter of string uppercase.
*
* By Steve Hansell.
* https://stackoverflow.com/a/3291856/8951875
* * * * * * */
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
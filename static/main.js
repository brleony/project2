/**
* Name: Leony Brok
**/


// Wait until DOM has loaded.
document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // Get username from local storage.
    var username = localStorage.getItem('username');

    // If user hasn't chosen a name: show username modal.
    if (!username) {
        username_modal();
    } else {
        // Welcome user.
        document.querySelector('#welcome').innerHTML = `Hello ${username}`;
    }

    // When new channel is broadcasted.
    socket.on('channels', channel_name => {

        // Add new channel to channel list.
        var list = document.querySelector('#channel_list');
        var new_channel = document.createElement('li');
        new_channel.setAttribute("class", "nav-item");
        new_channel.innerHTML = `<a class="nav-link channel_menu" data-channel="${channel_name}">#${channel_name}</a>`;
        list.appendChild(new_channel);
    });

    // When new channel already exists.
    socket.on('channel_exists', ok => {
        document.querySelector('#channel_name_validation').innerHTML = 'Channel already exists.';
    });

    // Set onclick function for channels in menu.
    document.querySelectorAll('.channel_menu').forEach(link => {
        change_channel(link);
    });
});

// When a channel is clicked, change the display title and message to those of that channel.
function change_channel(link) {
    link.onclick = () => {

        const channel_name = link.dataset.channel;

        // Change the displayed titel.
        const channel_titel = document.querySelector('#channel_title');
        channel_titel.innerHTML = `#${channel_name}`;

        // Show messages. TODO

        // Show input field.
        document.querySelector('#message_input').style.display = "block";
    };
}

// When user clicks the 'create channel' button, validate the channel name and emit the new channel.
function create_channel() {

    // Remove validation message.
    document.querySelector('#channel_name_validation').innerHTML = '';

    // Save channel name.
    const channel_name = document.querySelector('#channel_name').value;

    // Validate channel name.
    if (!channel_name) {
            document.querySelector('#channel_name_validation').innerHTML = 'Enter a channel name.';
    } else if (channel_name.length < 4 || channel_name.length > 14) {
            document.querySelector('#channel_name_validation').innerHTML = 'Channel name needs to be between 4 and 14 characters.';
    } else {
        // Empty input field.
        document.querySelector('#channel_name').value = '';

        // Emit new channel.
        socket.emit('newchannel', {'channel_name': channel_name});
    }

}

// Shows the username modal until user has entered a valid username.
function username_modal() {

    // Show modal, don't close when backdrop is clicked or escape is pressed.
    $('#username_modal').modal({backdrop: 'static', keyboard: false, show: true});

    // When button is clicked, validate username.
    document.querySelector('#username_button').onclick = () => {

        const username = document.querySelector('#username').value;

        // Ensure user has filled in username that is between 4 and 20 characters.
        if (!username) {
            document.querySelector('#username_validation').innerHTML = 'Enter a username.';
        } else if (username.length < 4 || username.length > 14) {
            document.querySelector('#username_validation').innerHTML = 'Username needs to be between 4 and 14 characters.';
        } else {

            // Save username.
            localStorage.setItem('username', username);

            $('#username_modal').modal('hide');

            // Welcome user.
            document.querySelector('#welcome').innerHTML = `Hello ${username}`;
        }
    };
}
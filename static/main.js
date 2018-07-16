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

    if (localStorage.getItem('current_channel')) {
        change_channel(localStorage.getItem('current_channel'));
    }

    // Create channel.
    document.querySelector('#create_channel').onclick = () => {
        create_channel();
    };

    // When new channel already exists.
    socket.on('channel_exists', () => {
        document.querySelector('#channel_name_validation').innerHTML = 'Channel already exists.';
    });

    // When new channel is broadcasted.
    socket.on('channels', channel_name => {
        channel_broadcasted(channel_name);
    });

    // Set onclick function for channels in menu.
    document.querySelectorAll('.channel_menu').forEach(link => {
        channel_clicked(link);
    });

    // Send message.
    document.querySelector('#send_message').onclick = () => {
        send_message();
    };

    // When a new message is broadcasted.
    socket.on('new_message', (data) => {
        message_broadcasted(data);
    });

    // When messages are broadcasted.
    socket.on('show_messages', (data) => {
        show_messages(data);
    });
});

// When a channel is clicked, get and save the name of the channel.
function channel_clicked(link) {
    link.onclick = () => {

        const channel_name = link.dataset.channel;

        // Save current channel.
        localStorage.setItem('current_channel', channel_name);

        // Change the displayed title and messages.
        change_channel(channel_name);
    };
}

// Display the channel (title and messages) of the channel that is passed as parameter.
function change_channel(channel_name) {

    // Change the displayed title.
    const channel_titel = document.querySelector('#channel_title');
    channel_titel.innerHTML = `#${channel_name}`;

    // Remove old messages.
    document.querySelector('#channel_messages').innerHTML = '';

    // Ask server for messages.
    socket.emit('show_messages', {'channel_name': channel_name});

    // Show input field.
    document.querySelector('#message_input').style.display = "block";
}

// Show all messages that were sent to a channel.
function show_messages (messages) {

    messages.forEach(message => {

        append_message(message);
    });
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

        // Save username and time.
        const username = localStorage.getItem('username');
        const timestamp = Date.now();

        // Emit new channel.
        socket.emit('newchannel', {'channel_name': channel_name, 'username': username, 'timestamp': timestamp});
    }
}

// Add the new channel tot the channel list.
function channel_broadcasted(channel_name) {

    // Create new list item.
    var new_channel = document.createElement('li');
    new_channel.setAttribute("class", "nav-item");
    new_channel.innerHTML = `<a class="nav-link channel_menu" data-channel="${channel_name}">#${channel_name}</a>`;

    // Append to channel list.
    var list = document.querySelector('#channel_list');
    list.appendChild(new_channel);
}

// Send a message in the current channel when user clicks 'send'.
function send_message() {

    // Get message, username and current channel.
    const message = document.querySelector('#message').value;
    const username = localStorage.getItem('username');
    const current_channel = localStorage.getItem('current_channel');
    const timestamp = Date.now();

    // Empty input field.
    document.querySelector('#message').value = '';

    // Emit new message.
    socket.emit('message', {'message': message, 'current_channel': current_channel, 'username': username, 'timestamp': timestamp});
}

// If a new message is sent to the current channel, display the message.
function message_broadcasted(message) {

    if (message["current_channel"] === localStorage.getItem('current_channel')) {

        append_message(message);
    }
}

// Add a message with timestamp, username and content to the message list.
function append_message(message) {

    const time = new Date(message['timestamp']);

    // Create new list item.
    const this_message = document.createElement('li');
    this_message.innerHTML = `${message['username']} @ ${time}: ${message['message']}`;

    // Append to channel list.
    var list = document.querySelector('#channel_messages');
    list.appendChild(this_message);
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
        }
    };
}
/* * * * * * *
* Name: Leony Brok
* Web Programming with Python and Javascript
* * * * * * */


// Wait until DOM has loaded.
document.addEventListener('DOMContentLoaded', () => {

    counter = 0;

    // Connect to websocket
    socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // Get username from local storage.
    var username = localStorage.getItem('username');

    // If user hasn't chosen a name: show username modal.
    if (!username) {
        username_modal();
    } else {
        // Welcome user.
        welcome_user(username);
    }

    // If channel was remembered, go to that channel.
    if (localStorage.getItem('current_channel')) {
        display_channel(localStorage.getItem('current_channel'));
    }

    // When new channel already exists.
    socket.on('channel_exists', () => {
        document.querySelector('#channel_name_validation').innerHTML = 'Channel already exists.';
    });

    // When new channel is broadcasted.
    socket.on('channels', channel_name => {
        channel_broadcasted(channel_name);
    });

    // When a new message is broadcasted.
    socket.on('new_message', (new_message) => {
        message_broadcasted(new_message);
    });

    // When a deleted message is broadcasted.
    socket.on('deleted_message', (data) => {
        deleted_broadcasted(data);
    });
});

/* * * * * * *
* Make first letter of string uppercase.
*
* By Steve Hansell:
* https://stackoverflow.com/a/3291856/8951875
* * * * * * */
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

// Add welcome message to header.
function welcome_user (username) {

    var welcome = document.querySelector('#welcome');

    welcome.innerHTML = `Hello ${username}`;

    welcome.style.animationPlayState = 'running';
}

// Display the channel (title and messages).
function display_channel (channel_name) {

    // If no parameter was passed.
    if (typeof channel_name === 'undefined') {

        // Get channel name.
        channel_name = this['event']['path'][0]['dataset']['channel'];

        // Save channel name.
        localStorage.setItem('current_channel', channel_name);
    }

    // Open new request to get messages.
    const request = new XMLHttpRequest();
    request.open('POST', '/showmessages');
    request.onload = () => {

        const messages = JSON.parse(request.responseText);

        // Only change channel if channel exists.
        if (messages != 'Error') {

            // Change the displayed title.
            const channel_titel = document.querySelector('#channel_title');
            channel_titel.innerHTML = `#${channel_name}`;

            // Remove old messages.
            document.querySelector('#channel_messages').innerHTML = '';

            // Append messages.
            messages.forEach(message => {
                append_message(message);
            });

            // Show input field.
            document.querySelector('#message_input').style.display = "block";
        }
    };

    // Send request with channel name.
    const data = new FormData();
    data.append('channel_name', channel_name);
    request.send(data);
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
    var channel_name = document.querySelector('#channel_name').value;

    // Validate channel name.
    if (!channel_name) {
            document.querySelector('#channel_name_validation').innerHTML = 'Enter a channel name.';
    } else if (channel_name.length < 3 || channel_name.length > 15) {
            document.querySelector('#channel_name_validation').innerHTML = 'Channel name needs to be between 3 and 15 characters.';
    } else {
        // Empty input field.
        document.querySelector('#channel_name').value = '';

        // Save username and time.
        const username = localStorage.getItem('username');
        const timestamp = Date.now();

        // Capitalize channel name.
        channel_name = channel_name.capitalize();

        // Emit new channel.
        socket.emit('newchannel', {'channel_name': channel_name, 'username': username, 'timestamp': timestamp});
    }
}

// Add the new channel tot the channel list.
function channel_broadcasted(channel_name) {

    // Create new list item.
    var new_channel = document.createElement('li');
    new_channel.innerHTML = `<a class="channel_menu" onclick="display_channel()" data-channel="${channel_name}">#${channel_name}</a>`;

    // Append to channel list.
    var list = document.querySelector('#channel_list');
    list.appendChild(new_channel);
}

// Send a message in the current channel when user clicks 'send' or hits enter.
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

        // Play sound.
        var audio = new Audio('static/light.mp3');
        audio.play();
    }
}

// Add a message with timestamp, username and content to the message list.
function append_message(message) {

    // Format the time.
    const time = new Date(message['timestamp']);
    const options = {hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short'};
    const time_formatted = time.toLocaleString('en-GB', options);

    // Create new list item.
    const this_message = document.createElement('li');

    // Set ID.
    this_message.id = message["id"];

    // Class and message depend on who message came from.
    if (message['username'] == localStorage.getItem('username')) {

        // Message with X icon
        this_message.innerHTML = `<p><b>${message['username']}</b> @ ${time_formatted}: ${message['message']}<i class="fas fa-times-circle" onclick="delete_message()"></i></p>`;
        this_message.classList.add('sent');

    } else if (message['username'] == 'Admin') {
        this_message.innerHTML = `<p><b>${message['username']}</b> @ ${time_formatted}: ${message['message']}</p>`;
        this_message.classList.add('admin');
    } else {
        this_message.innerHTML = `<p><b>${message['username']}</b> @ ${time_formatted}: ${message['message']}</p>`;
        this_message.classList.add('reply');
    }

    // Append to channel list.
    var list = document.querySelector('#channel_messages');
    list.appendChild(this_message).scrollIntoView({behavior: "smooth"});
}

// Delete message.
function delete_message() {

    // Get message id.
    var id = this['event']['path'][2].id;

    const current_channel = localStorage.getItem('current_channel');

    socket.emit('deletemessage', {'id': id, 'current_channel': current_channel});
}

// If someone deleted a message.
function deleted_broadcasted(data) {

    if (data["current_channel"] === localStorage.getItem('current_channel')) {

        // Hide message.
        document.getElementById(data["id"]).style.display = 'none';
    }
}

// Shows modal that asks for username.
function username_modal() {

    // Show modal.
    $('#username_modal').modal({backdrop: 'static', keyboard: false, show: true});
}

// Get, validate and save username; hide modal.
function save_username() {

    const username = document.querySelector('#username').value;

    // Ensure user has filled in username that is between 4 and 20 characters.
    if (!username) {
        document.querySelector('#username_validation').innerHTML = 'Enter a username.';
    } else if (username.length < 3 || username.length > 15) {
        document.querySelector('#username_validation').innerHTML = 'Username needs to be between 3 and 15 characters.';
    } else if (username === 'Admin' || username === 'admin') {
        document.querySelector('#username_validation').innerHTML = 'Please choose a different username.';
    } else {

        // Save username.
        localStorage.setItem('username', username);

        // Hide modal.
        $('#username_modal').modal('hide');

        // Welcome user.
        welcome_user(username);
    }
}
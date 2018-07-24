/* * * * * * *
* Name: Leony Brok
* Web Programming with Python and Javascript
*
* Functions to prompt the user for a username, validate & save the username and show a welcome message.
* * * * * * */

// Shows modal that asks for username.
function username_modal() {
    $('#username_modal').modal({backdrop: 'static', keyboard: false, show: true});
}

// Get, validate and save username; hide modal.
function save_username() {

    const username = document.querySelector('#username').value;

    // Ensure user has entered a username that is between 4 and 20 characters.
    if (!username) {
        document.querySelector('#username_validation').innerHTML = 'Enter a username.';
    }
    else if (username.length < 3 || username.length > 15) {
        document.querySelector('#username_validation').innerHTML = 'Username needs to be between 3 and 15 characters.';
    }
    else if (username === 'Admin' || username === 'admin') {
        document.querySelector('#username_validation').innerHTML = 'Please choose a different username.';
    }
    else {
        localStorage.setItem('username', username);

        $('#username_modal').modal('hide');

        welcome_message(username);
    }
}

// Add 'Hello <name>' message to header.
function welcome_message(username) {

    let welcome = document.querySelector('#welcome');

    // Add message.
    welcome.innerHTML = `Hello ${username}`;

    // Play animation.
    welcome.style.animationPlayState = 'running';
}
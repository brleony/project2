/**
* Name: Leony Brok
**/


// Wait until DOM has loaded.
document.addEventListener('DOMContentLoaded', () => {

    // Get username from local storage.
    username = localStorage.getItem('username');
    console.log(username);

    // If user hasn't chosen a name: show username modal.
    if (!username) {
        username_modal();
    } else {
        // Welcome user.
        document.querySelector('#welcome').innerHTML = `Hello ${username}`;
    }

});


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
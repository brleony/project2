/**
* Name: Leony Brok
**/


// Wait until DOM has loaded.
document.addEventListener('DOMContentLoaded', () => {

    // Save username.
    document.querySelector('#username_button').onclick = () => {

        const username = document.querySelector('#username').value;
        localStorage.setItem('username', username);

        // Hide username form.
        document.querySelector('#ask_username').style.display = 'none';

    };

});

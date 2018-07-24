# Project 2: Chat App

This website is part of my homework for the course Web Programming with Python and JavaScript.
People can use the website to chat with other people. They can create a new channel or join an existing one.
Users don't have to register; simply choosing a username is enough. Other users will see this username too.
When going away and opening the site later again, the username and last channel will be remembered.
It is also possible for a user to delete the messages they have sent themselves.

## Files

### JavaScript Files
Static/JS contains all the necessary JavaScript files to make this project work.
**Main.js** waits until the DOM has loaded, connects to Socket,
and prompts the user for a username if the user hasn't already picked one.
If the user was in a channel the last time they closed the app, that channel will be joined again.
**Main.js** also listens for Socket Emits from the server.
Lastly, it contains a function to make the audio mute button work and a function to capitalize strings.

**Username.js** contains the functions to show the username modal, to validate and save the username that a user has chosen
and to add an animated welcome message to the header of the page.
**Channel.js** has the functions to create a channel, join a channel and add a channel to the list when a new channel is broadcasted.
In a similar fashion, **message.js** contains all the functions to make sending and deleting messages work.

### Style.css
I've used my own stylesheets in combination with Bootstrap 4 to make everything look a bit prettier.
Two fonts from Google Fonts are used: **Noto Sans** and **Playfair Display**.
The CSS has two animations: one to slowly show the welcome message and one to hide a deleted message.
How the list of channels in the sidebar is displayed depends on the size of the screen.
The site uses a picture of a sunset that I have taken as background image.
The color scheme is based on pink, white and grey.
Some elements of the site are sized based on the height of the screen.
When the username modal pops up, the rest of the site is blurred.

### Other Files in Static
The static folders contains two files next to the JavaScript and CSS files.
**Sunset.jpg** is a photograph that I took myself that is used as the background image on the website.
**Light.mp3** is the sound users hear when another user in the same channel sends a message. Don't worry: sound can be muted :P

### Application.py
This Python file has the server side code.
It has the function **message** that accepts a message, username, timestap and message id and returns this in a dictionary.
The three default channels *Chitchat*, *Music* and *Photography* with their first messages are also defined here.

A counter (global variable) is used to give every message a unique id.
This allows user to delete their own messages (my personal touch).
Channels and their messages are stored in **channels**, which is a dict where every channel is a key value pair.
The values for each dict are a list of the messages in that channel.
Every message itself is a dict with the content of the message, a username, a timestamp and a message id.

The other things this file contains are index, four Socket listeners and a route function
The Socket listeners are used when a channel is created, when a channel is joined, when a message is sent or when a message is deleted.
The route function is used when the user joins a channel and needs to view that messages that have been sent in that channel.

### Index.html
The last file that deserves some attention is **index.html**.
It can be found in the templates folder and is the only html file in this application.
**Index.html** contains a ton of scripts to make Bootstrap, Font Awesome icons, Socket and my own JS work.

The body contains a username modal that is shown when the user hasn't chosen a username (yet).
It also has a speaker icon to toggle the notification sounds.
There is a header that welcomes the user and a sidebar.
The sidebar contains the form to create a new channel and a list of existing channels to navigate between them.
The 'body' has the title of the channel that the user is currently in, the messages of the channel and a form to send new messages.

## Personal touch
For a personal touch I decided to allow the users to delete their own messages. 
User see a 'X' icon next to the messages they have sent.
Clicking this icon will delete the message for them and for the other users.
Messages are identified by an id that is assigned to every message on the server side.
The JavaScript functions that handle deleting messages can be found in **message.js**.

###### Leony Brok

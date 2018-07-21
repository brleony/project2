import os
import time

from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Dict with default challenges and messages.
channels = {'Chitchat': [{'username': 'Admin', 'timestamp': 1532433600000, 'id': -1,
                'message': '🗣️ Feel free to use this channel to talk about whatever you feel like'}],
            'Music': [{'username': 'Admin', 'timestamp': 1532433600000, 'id': -1,
                'message': 'Use this channel to talk about your favorite artists, to share a cool song you just discovered or to spread the love about that awesome album 🎵'}],
            'Photography': [{'username': 'Admin', 'timestamp': 1532433600000, 'id': -1,
                'message': 'Photography enthusiasts unite! 📷 Share your pics, ask for advice or flaunt your favorite photo gear.'}]}

# Counter for message id.
counter = 0

@app.route("/")
def index():
    channel_list = list(channels)
    return render_template("index.html", channel_list=channel_list)

@socketio.on("newchannel")
def newchannel(data):

    new_channel = data["channel_name"]

    # Check if new channel name doesn't already exist.
    if new_channel in channels:
        emit("channel_exists")
    else:
        # Save first message.
        first_message = {}
        first_message["username"] = "Admin"
        first_message["timestamp"] = data["timestamp"]
        first_message["message"] = "This channel was created by {}.".format(data["username"])
        first_message["id"] = -1

        # Add channel with first message to channels dict.
        channels[new_channel] = []
        channels[new_channel].append(first_message)

        # Emit.
        emit("channels", new_channel, broadcast=True)

@socketio.on("message")
def message(data):

    new_message = {}

    # Get username, timestamp and message.
    new_message["message"] = data["message"]
    new_message["username"] = data["username"]
    new_message["timestamp"] = data["timestamp"]
    current_channel, new_message["current_channel"] = data["current_channel"], data["current_channel"]

    # Set ID and increase counter.
    global counter
    new_message["id"] = counter
    counter += 1

    # Add new message to message list.
    channels[current_channel].append(new_message)

    # Only store 100 most recent messages.
    channels[current_channel] = channels[current_channel][-100:]

    # Emit.
    emit("new_message", new_message, broadcast=True)

@app.route("/showmessages", methods=["POST"])
def showmessages():

    # Get stored messages.
    try:
        messages = channels[request.form.get("channel_name")]
    # If channel does not exist, return error.
    except KeyError:
        error = 'Error'
        print (error)
        return jsonify(error)

    # Return list of posts.
    return jsonify(messages)

@socketio.on("deletemessage")
def deletemessage(data):

    current_channel = data["current_channel"]

    message_id = int(data["id"])

    for i, message in enumerate(channels[current_channel]):
        if message["id"] == message_id:
            del channels[current_channel][i]

            deleted = {}
            deleted["id"] = message_id
            deleted["current_channel"] = current_channel

            emit("deleted_message", deleted, broadcast=True)

            break
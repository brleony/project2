import os
import time

from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Dict with default challenges and messages.
channels = {'Chitchat': [{'username': 'Admin', 'timestamp': 1532433600000,
                'message': '🗣️ Feel free to use this channel to talk about whatever you feel like'}],
            'Music': [{'username': 'Admin', 'timestamp': 1532433600000,
                'message': 'Use this channel to talk about your favorite artists, to share a cool song you just discovered or to spread the love about that awesome album 🎵'}],
            'Photography': [{'username': 'Admin', 'timestamp': 1532433600000,
                'message': 'Photography enthusiasts unite! 📷 Share your pics, ask for advice or flaunt your favorite photo gear.'}]}

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

        # Add channel with first message to channels dict.
        channels[new_channel] = []
        channels[new_channel].append(first_message)

        # Emit.
        emit("channels", new_channel, broadcast=True)

@socketio.on("message")
def message(data):

    new_message = {}

    new_message["message"] = data["message"]
    new_message["username"] = data["username"]
    new_message["timestamp"] = data["timestamp"]
    current_channel = data["current_channel"]

    # Save new message.
    channels[current_channel].append(new_message)

    # Only store 100 most recent messages.
    channels[current_channel] = channels[current_channel][-100:]

    # Emit.
    emit("new_message", data, broadcast=True)

@app.route("/showmessages", methods=["POST"])
def showmessages():

    # Get stored messages.
    messages = channels[request.form.get("channel_name")]

    # Return list of posts.
    return jsonify(messages)
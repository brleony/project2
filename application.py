import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# List of all channels.
channel_list = ['General']

@app.route("/")
def index():
    return render_template("index.html", channel_list=channel_list)

@socketio.on("newchannel")
def vote(data):

    # Check if new channel name doesn't already exist.
    if data["channel_name"] in channel_list:
        emit("channel_exists", ok)
    else:
        # Add new channel to list.
        channel_list.append(data["channel_name"])

        # Emit.
        emit("channels", data["channel_name"], broadcast=True)
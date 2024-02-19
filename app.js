// Replace YOUR_APP_ID with your Agora App ID
const APP_ID = 'c02e9f92e66e4a178a894dbce9968d80';

// Agora RTM client
const client = AgoraRTM.createInstance(APP_ID);

// Room information
let currentRoom;
let username;

// Initialize the Agora RTM client
client.on('ConnectionStateChanged', (newState, reason) => {
    console.log('Connection state changed:', newState, reason);
});

// Login function
function login() {
    username = username = uuidv4();
      if (!username) {
        alert('Please enter your name');
        return;
    }

    client.login({ uid: username })
        .then(() => {
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('chat-container').style.display = 'block';
        })
        .catch(error => {
            console.error('Agora RTM login failure:', error);
        });
}

// Join a room function
function joinRoom(roomName) {
    currentRoom = roomName;
    document.getElementById('room-name').innerText = roomName;
    client.join(currentRoom)
        .then(() => {
            updateMemberCount();
            subscribeMessageChannel();
        })
        .catch(error => {
            console.error('Agora RTM join failure:', error);
        });
}

// Subscribe to the message channel for the current room
function subscribeMessageChannel() {
    client.on('MessageFromPeer', (message, peerId) => {
        displayMessage(peerId, message.text);
    });
}

// Send a message function
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value;
    if (!messageText) return;

    client.sendMessageToPeer({ text: messageText }, currentRoom, username)
        .then(() => {
            displayMessage(username, messageText);
            messageInput.value = '';
        })
        .catch(error => {
            console.error('Agora RTM send message failure:', error);
        });
}

// Display a message in the chat
function displayMessage(sender, text) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<p><strong>${sender}</strong> (${getCurrentTime()}): ${text}</p>`;
    chatMessages.appendChild(messageDiv);
}

// Update the member count in the room
function updateMemberCount() {
    client.getMembersByChannel(currentRoom)
        .then(members => {
            document.getElementById('user-count').innerText = members.length;
        })
        .catch(error => {
            console.error('Agora RTM get members failure:', error);
        });
}

// Get the current time
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

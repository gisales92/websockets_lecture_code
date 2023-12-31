import React, { useState, useEffect, useRef } from 'react';
import uuid from 'uuid';

import Home from './components/Home';
import ChatRoom from './components/ChatRoom';

function App() {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const webSocket = useRef(null);

  useEffect(() => {
    // If we don't have a username
    // then we don't need to create a WebSocket.
    if (!username) {
      return;
    }

    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = (e) => {
      console.log(`Connection open: ${e}`);
      // Set the messages state variable to trigger
      // the other effect to set the `onmessage` event listener.
      setMessages([]);
    };

    ws.onerror = (e) => {
      console.error(e);
    };

    ws.onclose = (e) => {
      console.log(`Connection closed: ${e}`);
      webSocket.current = null;
      setUsername('');
      setMessages([]);
    };

    webSocket.current = ws;

    // This function will be called when the next time
    // that the `username` state variable changes.
    return function cleanup() {
      if (webSocket.current !== null) {
        webSocket.current.close();
      }
    };
  }, [username]);

  // This effect will be called when the `App` component unmounts.
  useEffect(() => {
    return function cleanup() {
      if (webSocket.current !== null) {
        webSocket.current.close();
      }
    };
  }, [])

  // This effect is called whenever the `messages` state variable is changed.
  useEffect(() => {
    if (webSocket.current !== null) {
      // Every time the messages state variable changes
      // we need to reassign the `onmessage` event listener
      // to wrap around the updated state variable value.
      webSocket.current.onmessage = (e) => {
        console.log(`Processing incoming message ${e.data}...`);

        const chatMessage = JSON.parse(e.data);
        const message = chatMessage.data;
        message.created = new Date(message.created);

        setMessages([chatMessage.data, ...messages]);
      };
    }
  }, [messages]);

  const updateUsername = (username) => {
    setUsername(username);
  };

  const handleSendMessage = (message) => {
    const newMessage = {
      id: uuid(),
      username,
      message,
      created: new Date(),
    }

    const jsonNewMessage = JSON.stringify({
      type: 'send-chat-message',
      data: newMessage,
    });

    console.log(`Sending message ${jsonNewMessage}...`);

    webSocket.current.send(jsonNewMessage);
  };

  const handleLeave = () => {
    setUsername('');
  };

  return (
    <>
      {username ? (
        <ChatRoom messages={messages} handleSendMessage={handleSendMessage}
            handleLeave={handleLeave} />
      ) : (
        <Home updateUsername={updateUsername} />
      )}
    </>
  );
}

export default App;
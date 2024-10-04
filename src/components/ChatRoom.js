import React, { useState, useEffect, useContext, useRef } from 'react';
import { ref, push, onChildAdded, remove } from 'firebase/database';
import { AuthContext } from '../context/AuthContext';
import { database } from '../firebase';
import './ChatRoom.css';
import ChatInput from './ChatInput';

function ChatRoom({ selectedGroup }) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const msgListRef = ref(database, `chatroom/${selectedGroup}/msgList`);
    setMessages([]);
    const unsub = onChildAdded(msgListRef, (snapshot) => {
      const message = snapshot.val();
      message.messageId = snapshot.key;
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => unsub();
  }, [selectedGroup]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUnsend = (msg) => {
    // console.log(messageId);
    if (user.uid !== msg.uid) {
      alert("You can only unsent your message");
      return;
    }
    if (window.confirm("Are you sure you want to unsend this message?")) {
      remove(ref(database, `chatroom/${selectedGroup}/msgList/${msg.messageId}`));
      setMessages((prevMessages) => prevMessages.filter((message) => message.messageId !== msg.messageId));
    }
  };

  const addMessage = (message) => {
    const msgListRef = ref(database, `chatroom/${selectedGroup}/msgList`);
    push(msgListRef, {
      messageId: "null",
      uid: user.uid,
      data: message,
      displayName: user.displayName
    });

    if (!("Notification" in window)) {
      console.error("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission === "granted") {
      // If permission is already granted, create the notification
      new Notification("New Message", {
        body: message,
        dir: "ltr"
      });
    } else if (Notification.permission !== "denied") {
      // Otherwise, request permission from the user
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("New Message", {
            body: message,
            dir: "ltr"
          });
        }
      });
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredMessages = messages.filter(
    (message) =>
      message.data?.toLowerCase().includes(searchQuery.toLowerCase())
      //  || message.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-room">
      <div className="search">
        <input type="text" placeholder="Search messages..." value={searchQuery} onChange={handleSearch} />
        <p>{filteredMessages.length} message(s) found</p>
      </div>
      <div className="messages">
        {filteredMessages.map((message) => {
          // console.log(message);
          const Self = message.uid === user.uid;
          return (
            <div className={`message ${Self && "self"}`} onDoubleClick={() => handleUnsend(message)}>
              <div className="user-circle" style={{ backgroundColor: Self ? "#6BAC8E" : "#96D1F8" }}>
                {Self ? "You" : message.displayName}
              </div>
              <div className={`message-text ${Self && "self"}`}>
                <p>{message.data}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <ChatInput addMessage={addMessage} />
      </div>
    </div>
  );
}

export default ChatRoom;

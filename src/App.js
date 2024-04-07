import React, { useState } from 'react';
import JSZip from 'jszip';
import './Chat.css';

function App() {
  const [messages, setMessages] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    try {
      const zip = await JSZip.loadAsync(file);
      const zipFileName = file.name.replace('.zip', '');
      const senderName = zipFileName.split(' - ')[1];

      const textFile = await zip.file('_chat.txt').async('string');
      const parsedMessages = parseTextFile(textFile, senderName);
      setMessages(parsedMessages);
    } catch (error) {
      console.error('Error reading zip file:', error);
    }
  };

  const parseTextFile = (text, senderName) => {
    const parsedMessages = [];

    const lines = text.split('\n');

    lines.forEach(line => {
      const regex = /\[(.*?)\]\s(.*?):\s(.*)/;
      const match = regex.exec(line);
      if (match && match.length === 4) {
        const date = match[1];
        const sender = match[2];
        const message = match[3];

        const messageObject = {
          date,
          sender: sender === senderName ? sender : 'Me',
          message
        };

        parsedMessages.push(messageObject);
      }
    });

    return parsedMessages;
  };

  return (
    <div>
      <h1>WhatsApp Chat Reader</h1>
      <input type="file" accept=".zip" onChange={handleFileUpload} />
      <div className="chat-container">
        {messages.map((message, index) => (
          <div key={index} className={message.sender === 'Me' ? 'chat-right' : 'chat-left'}>
            <div className="chat-bubble">
              <p className="sender">{message.sender}</p>
              <p className="message">{message.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

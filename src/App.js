import React, { useState } from 'react';
import JSZip from 'jszip';

function App() {
  const [messages, setMessages] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    try {
      const zip = await JSZip.loadAsync(file);
      const textFile = await zip.file('_chat.txt').async('string');
      const parsedMessages = parseTextFile(textFile);
      setMessages(parsedMessages);
    } catch (error) {
      console.error('Error reading zip file:', error);
    }
  };

  const parseTextFile = (text) => {
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
          sender,
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
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <p><strong>{message.sender}</strong>: {message.message}</p>
            <p><em>{message.date}</em></p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

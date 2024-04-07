import React, { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const contents = event.target.result;
      const parsedMessages = parseTextFile(contents);
      setMessages(parsedMessages);
    };

    reader.readAsText(file);
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
      <h1>WhatsApp Text File Reader</h1>
      <input type="file" accept=".txt" onChange={handleFileUpload} />
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

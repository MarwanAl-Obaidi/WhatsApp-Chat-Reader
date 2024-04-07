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
    // Needs proper implementation, otherwise works fine.
    const messages = text.split('\n');
    return messages;
  };

  return (
    <div>
      <h1>WhatsApp Text File Reader</h1>
      <input type="file" accept=".txt" onChange={handleFileUpload} />
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

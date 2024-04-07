import React, { useState } from 'react';
import JSZip from 'jszip';
import './Chat.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [lightboxImage, setLightboxImage] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    try {
      const zip = await JSZip.loadAsync(file);
      const zipFileName = file.name.replace('.zip', '');
      const senderName = zipFileName.split(' - ')[1];

      const textFile = await zip.file('_chat.txt').async('string');
      const imageFiles = await extractImageFiles(zip);

      const parsedMessages = parseTextFile(textFile, senderName, imageFiles);
      setMessages(parsedMessages);
    } catch (error) {
      console.error('Error reading zip file:', error);
    }
  };

  const extractImageFiles = async (zip) => {
    const imageFiles = [];

    for (const fileName in zip.files) {
      if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
        const imageData = await zip.file(fileName).async('base64');
        imageFiles.push({ fileName, data: `data:image/jpeg;base64,${imageData}` });
      }
    }

    return imageFiles;
  };

  const parseTextFile = (text, senderName, imageFiles) => {
    const parsedMessages = [];

    const lines = text.split('\n');

    lines.forEach(line => {
      const regex = /\[(.*?)\]\s(.*?):\s(.*)/;
      const match = regex.exec(line);
      if (match && match.length === 4) {
        const time = match[1];
        const sender = match[2];
        let message = match[3];

        const attachmentRegex = /<attached:\s(.*?)>/;
        const attachmentMatch = attachmentRegex.exec(message);
        let imageUrl = null;

        if (attachmentMatch && attachmentMatch.length === 2) {
          const attachmentFileName = attachmentMatch[1].trim();
          const imageFile = imageFiles.find(file => file.fileName === attachmentFileName);
          if (imageFile) {
            imageUrl = imageFile.data;
            message = message.replace(attachmentMatch[0], '');
          }
        }

        const messageObject = {
          time,
          sender: sender === senderName ? sender : 'Me',
          message,
          imageUrl
        };

        parsedMessages.push(messageObject);
      }
    });

    return parsedMessages;
  };

  const openLightbox = (imageUrl) => {
    setLightboxImage(imageUrl);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  return (
    <div>
      <h1>WhatsApp Chat Reader</h1>
      <input type="file" accept=".zip" onChange={handleFileUpload} />
      <div className="chat-container">
        {messages.map((message, index) => (
          <div key={index} className={`chat-bubble ${message.sender === 'Me' ? 'chat-right' : 'chat-left'}`}>
            <p className="sender">{message.sender}</p>
            <p className="time">{message.time}</p>
            {message.imageUrl && (
              <img
                src={message.imageUrl}
                alt="Attached"
                onClick={() => openLightbox(message.imageUrl)}
                className="chat-image"
              />
            )}
            <p className="message">{message.message}</p>
          </div>
        ))}
      </div>
      {lightboxImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content">
            <img src={lightboxImage} alt="Attached" className="lightbox-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

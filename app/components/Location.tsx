import { useState } from 'react';
import { useChat } from 'ai/react';

const Location = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/location',
  });

  // Render messages (original content)
  const renderMessages = () => {
    console.log(messages)
    return messages.map((msg, index) => {
      // Initially assume the message is just a text
      let displayText = msg.content;
      let confirmationFlag = false;
  
      // Check if the message is from the bot and try to parse the JSON content
      if (msg.role === 'assistant') {
        try {
          // First, extract the 'message' attribute from the bot's response
          const botMessage = JSON.parse(msg.content).choices[0].message.content;
          // Now, parse the JSON content of the 'message' attribute to access its fields
          const messageContent = JSON.parse(botMessage);
  
          // Extract the 'message' and 'confirmationFlag' from the parsed content
          displayText = messageContent.message;
          confirmationFlag = messageContent.confirmationFlag;
        } catch (e) {
          console.error("Error parsing message content:", e);
          // In case of any error during parsing, use a default error message
          displayText = "Error: Message content could not be parsed.";
        }
      }
  
      // Render the extracted or default message
      return (
        <div key={index} className={`message ${msg.role}`}>
          <span>{msg.role === 'user' ? 'You: ' : 'Bot: '}</span>
          {displayText}
          {/* Optionally, display something based on the confirmationFlag */}
          {confirmationFlag && <div>Confirmation Received!</div>}
        </div>
      );
    });
  };
  



  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await handleSubmit(event); // Modify handleSubmit to update setStreamCompleted(true) when the stream is complete
     
    } catch (e) {
      setError('An error occurred while submitting your location. Please try again.');
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="chat-line">
      <h2>Do you have a location where you would like to work?</h2>
      <div className="messages-container">
        {renderMessages()}
      </div>
      <br />
      
      <form onSubmit={onSubmit} className="mainForm">
        <input
          name="input-location"
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter your preferred location"
          aria-label="Preferred location"
          disabled={loading}
        />
        <button type="submit" className="mainButton" disabled={loading}>
          Submit
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Location;

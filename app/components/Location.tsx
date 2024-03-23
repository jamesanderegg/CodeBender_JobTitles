import { useState } from 'react';
import { useChat } from 'ai/react';

const Location = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [streamCompleted, setStreamCompleted] = useState(false); // New state variable to track stream completion

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/location',
  });

  // Render messages (original content)
  const renderMessages = () => {
    return messages.map((msg, index) => (
      <div key={index} className={`message ${msg.role}`}>
        <span>{msg.role === 'user' ? 'You: ' : 'Bot: '}</span>
        {msg.content}
      </div>
    ));
  };

  // Render messages with JSON parsing
  const renderMessages1 = () => {
    return messages.map((msg, index) => {
      let contentObj;
      try {
        contentObj = JSON.parse(msg.content);
      } catch (e) {
        console.error("Error parsing message content:", e);
        contentObj = null;
      }

      const displayText = contentObj ? 
        (msg.role === 'user' ? 'You: ' : 'Bot: ') + contentObj.message : 
        "Error: Message content could not be parsed.";

      return (
        <div key={index} className={`message ${msg.role}`}>
          <span>{displayText}</span>
        </div>
      );
    });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setStreamCompleted(false); // Reset stream completion status
    try {
      await handleSubmit(event); // Modify handleSubmit to update setStreamCompleted(true) when the stream is complete
      setStreamCompleted(true); // Assume the stream is completed after handleSubmit (adjust based on actual logic)
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
      {streamCompleted && ( // Only render if the stream is completed
        <div>
          {renderMessages1()}
        </div>
      )}
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

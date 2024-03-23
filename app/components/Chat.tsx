import { useState, useEffect } from 'react';
import { useChat } from 'ai/react';

const Chat = () => {
  const [submitType, setSubmitType] = useState<'text'|'image'>("text");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/openai',
  });

  // Initial message definition
  const initialMessage = {
    id: 'initial-message',
    content: "Hello! I am USAJOBS Bot, I can help you find a job. Do you know the location you'd like to work?",
    role: 'assistant',
  };

  // Ensure initial message is always included and not duplicated
  const combinedMessages = [initialMessage, ...messages.filter(m => m.id !== 'initial-message')];

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitType === 'text') {
      handleSubmit(event);
    }
  };

  const userColors = {
    user: '#00c0ff',
    assistant: '#e02aff',
    function: '#fff',
    system: '#fff',
    tool: '#fff',
    data: '#fff'
  };

  const renderResponse = () => {
    return (
      <div className="response">
        {combinedMessages.map((m, index) => (
          <div key={m.id || index} className="chat-line">
            <span style={{color: userColors[m.role as keyof typeof userColors]}}>{m.role === 'user' ? 'User: ' : '⚡️USAJOBS Bot: '}</span>
            {m.content}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {renderResponse()}
      <form onSubmit={onSubmit} className="mainForm">
        <input name="input-field" placeholder="Say anything" onChange={handleInputChange} value={input} />
        <button type="submit" className="mainButton" disabled={loading} onClick={() => setSubmitType('text')}>
          TEXT
        </button>
      </form>
    </>
  );
};

export default Chat;

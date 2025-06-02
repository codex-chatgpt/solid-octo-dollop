import React, { useState, useEffect } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!recognition) return;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };
    recognition.onend = () => setListening(false);
  }, []);

  const sendMessage = async (text = input) => {
    if (!text) return;
    setMessages((msgs) => [...msgs, { role: 'user', content: text }]);
    setInput('');
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json();
    setMessages((msgs) => [...msgs, { role: 'assistant', content: data.reply }]);
    speak(data.reply);
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
  };

  const startListening = () => {
    if (recognition) {
      setListening(true);
      recognition.start();
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>AI Interviewer</h1>
      <div style={{ marginBottom: '1rem' }}>
        {messages.map((m, i) => (
          <div key={i}><strong>{m.role}:</strong> {m.content}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={() => sendMessage()}>Send</button>
      <button onClick={startListening} disabled={listening || !recognition}>
        {listening ? 'Listening...' : 'Speak'}
      </button>
    </div>
  );
}

export default App;

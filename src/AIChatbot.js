import { useState, useRef, useEffect } from 'react';
import './AIChatbot.css';
import { getAIResponse, isAIConfigured } from './geminiService';

const SUGGESTIONS = [
  'How to create a sale?',
  'How to add a customer?',
  'How to add an item?',
  'How to view reports?',
  'How to record a purchase?',
  'How to change currency?',
];

function AIChatbot({ isOpen, onClose }) {
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [isTyping, setIsTyping]   = useState(false);
  const [isOnline]                = useState(isAIConfigured());
  const endRef                    = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 1,
        role: 'bot',
        text: "👋 Hi! I'm your **bizBuddy AI Assistant** powered by Llama 3!\n\nI can help you with sales, purchases, inventory, customers, reports, and settings.\n\nWhat would you like to know? 😊",
        time: new Date(),
      }]);
    }
  }, [isOpen]);

  function addMessage(role, text) {
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      role,
      text,
      time: new Date(),
    }]);
  }

  async function sendMessage(textArg) {
    const text = (textArg !== undefined ? textArg : input).trim();
    if (!text || isTyping) return;

    addMessage('user', text);
    setInput('');
    setIsTyping(true);

    try {
      const reply = await getAIResponse(text);
      addMessage('bot', reply);
    } catch (err) {
      addMessage('bot', `⚠️ Sorry, something went wrong:\n${err.message}`);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function formatTime(d) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Render bold text (**word**)
  function renderText(text) {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.+?)\*\*/g);
      return (
        <div key={i} className={line === '' ? 'msg-spacer' : ''}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
        </div>
      );
    });
  }

  if (!isOpen) return null;

  return (
    <div className="cb-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cb-window">

        {/* Header */}
        <div className="cb-header">
          <div className="cb-header-left">
            <div className="cb-avatar">🤖</div>
            <div>
              <div className="cb-title">bizBuddy Assistant</div>
              <div className={`cb-status ${isOnline ? 'online' : 'offline'}`}>
                <span className="cb-dot" />
                {isOnline ? 'Online · Llama 3 AI' : 'Offline'}
              </div>
            </div>
          </div>
          <button className="cb-close" onClick={onClose} aria-label="Close chat">✕</button>
        </div>

        {/* Messages */}
        <div className="cb-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`cb-msg cb-msg--${msg.role}`}>
              {msg.role === 'bot' && <div className="cb-msg-avatar">🤖</div>}
              <div className="cb-msg-body">
                <div className="cb-msg-bubble">{renderText(msg.text)}</div>
                <div className="cb-msg-time">{formatTime(msg.time)}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="cb-msg cb-msg--bot">
              <div className="cb-msg-avatar">🤖</div>
              <div className="cb-msg-body">
                <div className="cb-msg-bubble cb-typing">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="cb-suggestions">
            {SUGGESTIONS.map((s, i) => (
              <button key={i} className="cb-chip" onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="cb-input-row">
          <textarea
            className="cb-input"
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about bizBuddy..."
            disabled={isTyping}
          />
          <button
            className="cb-send"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}

export default AIChatbot;

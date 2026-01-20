import { useState, useRef, useEffect } from "react";
import "./AIChatbot.css";
import { sendMessageToGemini, getQuickResponse } from "./geminiService";

const AIChatbot = ({ isOpen, onClose, user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your AI business assistant for bizBuddy. I can help you with sales, purchases, inventory management, customer relations, and business analytics. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef(null);



  const chatbotTips = [
    {
      title: "Be Specific with Your Questions",
      description: "The more detail you provide, the better the AI can understand your request and offer precise answers."
    },
    {
      title: "Use Keywords for Quicker Results",
      description: "Mention key terms related to your query, like \"invoice,\" \"sales report,\" or \"expense categories.\""
    },
    {
      title: "Ask Follow-Up Questions",
      description: "Don't hesitate to ask for clarification or additional information on any topic."
    },
    {
      title: "Try Different Phrasing",
      description: "If you don't get the answer you're looking for, try rephrasing your question."
    }
  ];

  const faqs = [
    {
      question: "What can the AI assistant help me with?",
      answer: "I can help with sales management, invoice creation, inventory tracking, customer management, purchase orders, and business analytics."
    },
    {
      question: "How do I create a new invoice?",
      answer: "Go to the Sales section and click 'Create New Invoice'. Select a customer, add items, and I can guide you through the process."
    },
    {
      question: "Can you access my business data?",
      answer: "Yes, I can help analyze your sales, purchases, inventory, and customer data to provide insights and answer questions."
    },
    {
      question: "Is the AI assistant available 24/7?",
      answer: "Yes, I'm available 24/7 to help with your business queries and provide guidance on using bizBuddy features."
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      console.log('🚀 Starting message send process');
      
      // Check for quick responses first
      const quickResponse = getQuickResponse(currentInput);
      if (quickResponse) {
        console.log('⚡ Using quick response');
        setTimeout(() => {
          const aiResponse = {
            id: Date.now() + 1,
            type: "bot",
            content: quickResponse,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiResponse]);
          setIsTyping(false);
          setIsConnected(true);
        }, 800);
        return;
      }

      console.log('🤖 Calling Gemini API');
      
      // Get conversation history (last 5 messages for context)
      const conversationHistory = messages.slice(-5);
      
      // Call Gemini API with simple message
      const result = await sendMessageToGemini(currentInput, conversationHistory);
      
      console.log('📨 API Result:', result);
      
      let responseContent;
      if (result.success) {
        responseContent = result.response;
        setIsConnected(true);
        console.log('✅ API call successful');
      } else {
        responseContent = result.fallbackResponse || "I apologize, but I'm having trouble processing your request right now. Please try again.";
        setIsConnected(false);
        console.error('❌ API call failed:', result.error);
      }

      const aiResponse = {
        id: Date.now() + 1,
        type: "bot",
        content: responseContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      
    } catch (error) {
      console.error('💥 Error in handleSendMessage:', error);
      const errorResponse = {
        id: Date.now() + 1,
        type: "bot",
        content: "I'm sorry, I encountered an error while processing your message. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      setIsConnected(false);
    } finally {
      setIsTyping(false);
      console.log('🏁 Message send process completed');
    }
  };



  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-overlay">
      <div className="chatbot-container">
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-title">
            <div className="ai-icon">🤖</div>
            <div>
              <h3>AI Business Assistant</h3>
              <span className={`status ${isConnected ? 'online' : 'offline'}`}>
                {isConnected ? 'Online' : 'Reconnecting...'}
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Main Content */}
        <div className="chatbot-content">
          {/* Chat Messages */}
          <div className="chat-section">
            <div className="messages-container">
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.type}`}>
                  <div className="message-content">
                    {message.content.split('\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="message bot typing">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>



            {/* Input */}
            <div className="chat-input-container">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="chat-input"
                rows="1"
              />
              <button 
                className="send-btn" 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
              >
                📤
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="chatbot-sidebar">
            {/* Tips Section */}
            <div className="sidebar-section">
              <h4>Chatbot Tips</h4>
              <div className="tips-list">
                {chatbotTips.map((tip, index) => (
                  <div key={index} className="tip-item">
                    <div className="tip-title">{tip.title}</div>
                    <div className="tip-description">{tip.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Section */}
            <div className="sidebar-section">
              <h4>FAQs</h4>
              <div className="faqs-list">
                {faqs.map((faq, index) => (
                  <details key={index} className="faq-item">
                    <summary className="faq-question">{faq.question}</summary>
                    <div className="faq-answer">{faq.answer}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="chatbot-footer">
          <span>© 2025 Smart Business Management. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
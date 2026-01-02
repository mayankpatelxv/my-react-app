import { useState, useRef, useEffect } from "react";
import "./AIChatbot.css";

const AIChatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! How can I assist you with your business today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickActions = [
    "How do I add a new client?",
    "What are my current expenses?",
    "Generate an invoice",
    "View recent purchases",
    "Summarize weekly sales"
  ];

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
      question: "Can the chatbot access my financial data?",
      answer: "Yes, the chatbot can access your business data to provide personalized insights and reports."
    },
    {
      question: "How do I get a sales summary for last quarter?",
      answer: "Simply ask 'Generate a sales summary for Q3' or specify the time period you need."
    },
    {
      question: "Is the chatbot available 24/7?",
      answer: "Yes, the AI chatbot is available 24/7 to help with your business queries and tasks."
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage) => {
    const responses = {
      "sales report": "Generating a summary sales report for Q3 2023 now. This might take a moment.\n\nYour Q3 2023 Sales Summary is ready. Total sales: $150,000, Top product: \"Premium Widget\", Region with highest sales: North America.",
      "add client": "To add a new client, go to Party Management and click 'Add New Party'. Fill in the required details like name, email, and contact information.",
      "expenses": "Your current monthly expenses total $25,000. The main categories are: Office supplies (40%), Software subscriptions (25%), Utilities (20%), Other (15%).",
      "invoice": "I can help you generate an invoice. Please specify the client name and items you'd like to include, or navigate to the Sales section to create a new invoice.",
      "purchases": "Your recent purchases include: Laptop Pro X ($2,400), Office Chair Deluxe ($750), Wireless Keyboard ($75). Total recent purchases: $3,225.",
      "weekly sales": "This week's sales summary: Total revenue: $12,500, Number of transactions: 45, Average order value: $278, Top selling item: Premium Widget."
    };

    const lowerMessage = userMessage.toLowerCase();
    let response = "I understand you're asking about business operations. Could you please be more specific about what you'd like to know? I can help with sales reports, expense tracking, client management, invoicing, and more.";

    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        response = value;
        break;
      }
    }

    return response;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: "bot",
        content: simulateAIResponse(inputMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    setInputMessage(action);
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
              <span className="status">Online</span>
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

            {/* Quick Actions */}
            <div className="quick-actions-section">
              <div className="quick-actions-grid">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="quick-action-btn"
                    onClick={() => handleQuickAction(action)}
                  >
                    {action}
                  </button>
                ))}
              </div>
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
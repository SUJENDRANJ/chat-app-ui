import React, { useState, useRef, useEffect } from 'react';
import { Send, User, UserCircle2, Search, ThumbsUp, Heart, Smile, Clock, Check, CheckCheck } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  reaction?: string;
  read?: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! How can I help you today?",
      sender: 'other',
      timestamp: new Date(Date.now() - 60000),
      read: true
    },
    {
      id: 2,
      text: "I'd like to learn more about your services.",
      sender: 'user',
      timestamp: new Date(),
      read: true
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSearch, setShowSearch] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredMessages = searchTerm
    ? messages.filter(msg => 
        msg.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : messages;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      read: false
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simulate typing indicator
    setIsTyping(true);

    // Simulate response after typing
    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: Date.now() + 1,
        text: "Thanks for your message! I'll get back to you soon.",
        sender: 'other',
        timestamp: new Date(),
        read: false
      };
      setMessages(prev => [...prev, response]);
      
      // Simulate read receipt after 2 seconds
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => msg.sender === 'user' ? { ...msg, read: true } : msg)
        );
      }, 2000);
    }, 2000);
  };

  const addReaction = (messageId: number, reaction: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, reaction: msg.reaction === reaction ? undefined : reaction }
          : msg
      )
    );
  };

  const getReadStatus = (message: Message) => {
    if (message.sender === 'other') return null;
    if (!message.read) return <Clock className="w-4 h-4 text-gray-400" />;
    return <CheckCheck className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCircle2 className="w-8 h-8" />
            <div>
              <h1 className="font-semibold">Chat Assistant</h1>
              <p className="text-xs text-indigo-200">Online</p>
            </div>
          </div>
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 hover:bg-indigo-700 rounded-full transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="p-2 bg-gray-50 border-b">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {/* Messages Container */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] flex gap-2 items-end ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {message.sender === 'other' ? (
                  <UserCircle2 className="w-6 h-6 text-indigo-600" />
                ) : (
                  <User className="w-6 h-6 text-gray-600" />
                )}
                <div className="space-y-1">
                  <div
                    className={`rounded-2xl px-4 py-2 group relative ${
                      message.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    
                    {/* Reaction buttons */}
                    <div className={`absolute ${message.sender === 'user' ? 'right-full mr-2' : 'left-full ml-2'} bottom-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1`}>
                      <button
                        onClick={() => addReaction(message.id, '👍')}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => addReaction(message.id, '❤️')}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => addReaction(message.id, '😊')}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Smile className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Reactions and Read Status */}
                  <div className={`flex items-center gap-2 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    {message.reaction && (
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                        {message.reaction}
                      </span>
                    )}
                    {getReadStatus(message)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-gray-500">
              <UserCircle2 className="w-6 h-6" />
              <div className="bg-gray-100 rounded-full px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition-colors"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
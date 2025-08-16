import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { generateResponse } from '../../lib/gemini';
import { supabase, ChatMessage } from '../../lib/supabase';

interface Lead {
  name: string;
  email: string;
  phone: string;
  service: string;
  additional_message: string;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm AssistAura's AI Assistant. How can I help?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCollectingLead, setIsCollectingLead] = useState(false);
  const [leadData, setLeadData] = useState<Partial<Lead>>({});
  const [leadStep, setLeadStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const leadQuestions = [
    { field: 'name', question: 'What\'s your name?' },
    { field: 'email', question: 'What\'s your email address?' },
    { field: 'phone', question: 'What\'s your phone number?' },
    { field: 'service', question: 'Which service are you interested in? (CGI Ads, Graphic Design, Web Development, Shopify Services, Amazon Services, Meta Ads)' },
    { field: 'additional_message', question: 'Any additional message or specific requirements?' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const saveLead = async () => {
    try {
      const { error } = await supabase
        .from('leads')
        .insert([
          {
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone,
            service: leadData.service,
            additional_message: leadData.additional_message,
            chat_history: messages
          }
        ]);

      if (error) throw error;
      
      addMessage('assistant', 'Thank you! Your information has been saved. Our team will contact you soon. Is there anything else I can help you with?');
      setIsCollectingLead(false);
      setLeadData({});
      setLeadStep(0);
    } catch (error) {
      console.error('Error saving lead:', error);
      addMessage('assistant', 'I apologize, there was an error saving your information. Please try again or contact us directly at contact@assistauraofficial.com');
    }
  };

  const handleLeadCollection = (userMessage: string) => {
    const currentQuestion = leadQuestions[leadStep];
    setLeadData(prev => ({ ...prev, [currentQuestion.field]: userMessage }));
    
    if (leadStep < leadQuestions.length - 1) {
      setLeadStep(leadStep + 1);
      addMessage('assistant', leadQuestions[leadStep + 1].question);
    } else {
      saveLead();
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    addMessage('user', userMessage);

    if (isCollectingLead) {
      handleLeadCollection(userMessage);
      return;
    }

    setIsLoading(true);

    try {
      const response = await generateResponse(userMessage, messages);
      addMessage('assistant', response);

      // Check if the response suggests collecting lead information
      const lowerResponse = response.toLowerCase();
      const lowerMessage = userMessage.toLowerCase();
      if (lowerResponse.includes('contact') || lowerResponse.includes('information') || 
          lowerResponse.includes('details') || lowerMessage.includes('interested') ||
          lowerMessage.includes('quote') || lowerMessage.includes('price') ||
          lowerMessage.includes('cost') || lowerMessage.includes('hire')) {
        setTimeout(() => {
          addMessage('assistant', 'I\'d be happy to help you get started! Let me collect some information so our team can assist you better.');
          setTimeout(() => {
            addMessage('assistant', leadQuestions[0].question);
            setIsCollectingLead(true);
            setLeadStep(0);
          }, 1000);
        }, 2000);
      }
    } catch (error) {
      addMessage('assistant', 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact us directly at contact@assistauraofficial.com');
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Widget Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-[#ffbe4a] to-[#2a3747] rounded-full shadow-lg flex items-center justify-center text-white z-50 hover:shadow-xl transition-shadow duration-300"
          >
            <MessageCircle className="w-8 h-8" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 60 : 500 
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200 font-inter"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#ffbe4a] to-[#2a3747] p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[#2a3747]" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold">AssistAura AI Assistant</h3>
                  <p className="text-white/80 text-xs">Online now</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:text-white/80 transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-white/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            {!isMinimized && (
              <>
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                          message.role === 'user'
                            ? 'bg-[#ffbe4a] text-white'
                            : 'bg-gray-100 text-[#2a3747]'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-[#2a3747] px-4 py-2 rounded-2xl text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-[#2a3747] rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-[#2a3747] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-[#2a3747] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-gray-500">typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ffbe4a] text-sm"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      className="w-10 h-10 bg-gradient-to-r from-[#ffbe4a] to-[#2a3747] rounded-full flex items-center justify-center text-white hover:shadow-lg transition-shadow duration-300 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
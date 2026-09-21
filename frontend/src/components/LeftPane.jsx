import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Zap } from 'lucide-react';
import { assistantQA } from '../mockData';

function LeftPane({ chatMessages, setChatMessages, isDark }) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const quickActions = [
    "What changed before the payment-api spike?",
    "Show downstream blast radius for redis-cache-prod",
    "Generate incident summary"
  ];

  const handleQuickAction = (question) => {
    const qa = assistantQA.find(q => q.question === question);
    if (qa) {
      setChatMessages([
        ...chatMessages,
        { id: Date.now(), type: 'user', text: question },
        {
          id: Date.now() + 1,
          type: 'assistant',
          text: qa.answer,
          confidence: `${qa.confidence}% High Confidence`,
          scope: qa.scope,
          timeRange: qa.timeRange
        }
      ]);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = { id: Date.now(), type: 'user', text: inputValue };
    setChatMessages([...chatMessages, newMessage]);

    // Simulate assistant response
    setTimeout(() => {
      const qa = assistantQA.find(q => 
        q.question.toLowerCase().includes(inputValue.toLowerCase()) ||
        inputValue.toLowerCase().includes(q.question.toLowerCase())
      );

      const assistantResponse = qa ? {
        id: Date.now() + 1,
        type: 'assistant',
        text: qa.answer,
        confidence: `${qa.confidence}% High Confidence`,
        scope: qa.scope,
        timeRange: qa.timeRange
      } : {
        id: Date.now() + 1,
        type: 'assistant',
        text: "I'm analyzing your cloud infrastructure. Try asking about specific services, deployment issues, risk forecasts, or incident investigations. For example: 'What services are failing?', 'Show me the blast radius for payment-api', or 'Which resources are at risk?'",
        confidence: null,
        scope: null,
        timeRange: null
      };

      setChatMessages(prev => [...prev, assistantResponse]);
    }, 500);

    setInputValue('');
  };

  return (
    <div className={`w-80 flex flex-col ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-r`}>
      {/* Header */}
      <div className={`p-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MessageCircle className="w-8 h-8 text-cyan-400 animate-pulse" />
            <div className="absolute inset-0 bg-cyan-400 rounded-full opacity-20 animate-ping"></div>
          </div>
          <div>
            <h1 className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Atlas Assistant</h1>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Cloud Dependency Guide</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {chatMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-3 rounded-lg ${
              msg.type === 'user'
                ? 'bg-cyan-600 text-white rounded-br-none'
                : isDark
                ? 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                : 'bg-slate-100 text-slate-900 rounded-bl-none border border-slate-300'
            }`}>
              <p className="text-sm">{msg.text}</p>
              {msg.type === 'assistant' && msg.confidence && (
                <div className={`mt-2 space-y-1 text-xs ${isDark ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-300'} border-t pt-2`}>
                  <p className="text-green-400 font-semibold">{msg.confidence}</p>
                  <p><span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Scope:</span> {msg.scope}</p>
                  <p><span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Range:</span> {msg.timeRange}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className={`px-4 py-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'} space-y-2`}>
        <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Quick Actions</p>
        <div className="space-y-2">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAction(action)}
              className={`w-full text-left text-xs p-2 rounded ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900'} transition-all flex items-start gap-2 group`}
            >
              <Zap className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0 group-hover:scale-110" />
              <span>{action}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className={`p-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question..."
            className={`flex-1 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDark ? 'bg-slate-800 text-slate-100 placeholder-slate-500' : 'bg-slate-100 text-slate-900 placeholder-slate-400'}`}
          />
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default LeftPane;

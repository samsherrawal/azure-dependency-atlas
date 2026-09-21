import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import { mockResources, mockEdges } from '../mockData';

function RootCauseAnalyzer({ selectedResource, isDark }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message when resource is selected
  useEffect(() => {
    if (selectedResource && messages.length === 0) {
      const welcome = {
        id: 1,
        type: 'bot',
        text: `Hey! I'm your incident investigation assistant for ${selectedResource.name}. I have access to your entire infrastructure topology (${mockResources.length} services across multiple layers). Ask me about this service, its dependencies, performance, or any other components in your system.`,
        timestamp: new Date(),
      };
      setMessages([welcome]);
    }
  }, [selectedResource?.id]);

  // Generate intelligent responses based on actual data
  const generateResponse = (question) => {
    const resource = selectedResource;
    const lowerQ = question.toLowerCase();

    // Find all services mentioned in the question
    const mentionedServices = mockResources.filter(svc =>
      lowerQ.includes(svc.name.toLowerCase()) ||
      lowerQ.includes(svc.name.split('-')[0].toLowerCase())
    );

    // Query about current service's health
    if (lowerQ.includes('health') || lowerQ.includes('status') || lowerQ.includes('how is')) {
      const healthColor = resource.healthScore >= 90 ? 'excellent' : 
                         resource.healthScore >= 70 ? 'good' : 
                         resource.healthScore >= 50 ? 'fair' : 'poor';
      return {
        text: `${resource.name} is currently ${resource.status} with a health score of ${resource.healthScore}%. ${healthColor === 'excellent' ? 'Everything looks great!' : healthColor === 'good' ? 'Operating normally.' : 'Some attention needed.'} Latency: ${resource.telemetry.latency}ms, RPS: ${resource.telemetry.rps}, Error Rate: ${(resource.telemetry.errorRate * 100).toFixed(3)}%. CPU: ${resource.telemetry.cpuUsage}%, Memory: ${resource.telemetry.memoryUsage}%.`,
        actions: ['Dependencies', 'Telemetry Details', 'Cost Info'],
      };
    }

    // Query about dependencies
    if (lowerQ.includes('depend') || lowerQ.includes('upstream') || lowerQ.includes('downstream')) {
      const deps = mockResources.filter(s => resource.dependencies?.includes(s.id));
      const depList = deps.length > 0 
        ? deps.map(d => `${d.name} (${d.status})`).join(', ')
        : 'No dependencies found';
      return {
        text: `${resource.name} depends on: ${depList}. These are critical for the service to function. Would you like details about any of these dependencies?`,
        actions: deps.slice(0, 3).map(d => `Info on ${d.name}`),
      };
    }

    // Query about performance/latency
    if (lowerQ.includes('slow') || lowerQ.includes('latency') || lowerQ.includes('performance')) {
      const latency = resource.telemetry.latency;
      const status = latency < 50 ? 'excellent' : latency < 100 ? 'good' : latency < 200 ? 'acceptable' : 'slow';
      return {
        text: `${resource.name} latency is ${latency}ms, which is ${status}. Current RPS: ${resource.telemetry.rps}, Error Rate: ${(resource.telemetry.errorRate * 100).toFixed(3)}%. Typical causes: database query optimization, cache hit rates, or network conditions.`,
        actions: ['Check Cache', 'Check Database', 'Scale Up'],
      };
    }

    // Query about errors/failure
    if (lowerQ.includes('error') || lowerQ.includes('fail') || lowerQ.includes('broken')) {
      return {
        text: `${resource.name} error rate is ${(resource.telemetry.errorRate * 100).toFixed(3)}%. Dependencies: ${resource.dependencies?.length || 0} services. Check if any dependent services are failing. Review logs for specific error messages.`,
        actions: ['Check Logs', 'Test Dependencies', 'View Errors'],
      };
    }

    // Query about cost
    if (lowerQ.includes('cost') || lowerQ.includes('price') || lowerQ.includes('expense')) {
      return {
        text: `${resource.name} costs $${resource.cost30d} for the past 30 days. Owner: ${resource.owner}. Region: ${resource.region}. Consider optimization if costs are rising.`,
        actions: ['Optimize', 'Scale Down', 'Budget Info'],
      };
    }

    // Query about resources (CPU/Memory)
    if (lowerQ.includes('cpu') || lowerQ.includes('memory') || lowerQ.includes('resource')) {
      return {
        text: `${resource.name} CPU usage: ${resource.telemetry.cpuUsage}%, Memory: ${resource.telemetry.memoryUsage}%. ${resource.telemetry.cpuUsage > 80 || resource.telemetry.memoryUsage > 80 ? 'High usage detected. Consider scaling up.' : 'Resource usage is normal.'}`,
        actions: ['Scale Up', 'Check Processes', 'Monitor'],
      };
    }

    // Questions about other services in topology
    if (mentionedServices.length > 0 && mentionedServices[0].id !== resource.id) {
      const svc = mentionedServices[0];
      return {
        text: `${svc.name} Status: ${svc.status}, Health: ${svc.healthScore}%, Owner: ${svc.owner}. Type: ${svc.type}, Region: ${svc.region}. Latency: ${svc.telemetry.latency}ms, Error Rate: ${(svc.telemetry.errorRate * 100).toFixed(3)}%.`,
        actions: ['Dependencies', 'Cost', 'Health Details'],
      };
    }

    // Overview of all layers
    if (lowerQ.includes('overview') || lowerQ.includes('all services') || lowerQ.includes('topology')) {
      const appCount = mockResources.filter(s => s.layer === 'application').length;
      const infraCount = mockResources.filter(s => s.layer === 'infrastructure').length;
      const dataCount = mockResources.filter(s => s.layer === 'data').length;
      const healthyCount = mockResources.filter(s => s.status === 'healthy').length;
      return {
        text: `Your infrastructure has ${mockResources.length} total services: ${appCount} application layer, ${infraCount} infrastructure, ${dataCount} data layer. ${healthyCount} services are healthy. Total edges (connections): ${mockEdges.length}.`,
        actions: ['App Layer', 'Infrastructure', 'Data Layer'],
      };
    }

    // Default: try to extract component name from question
    const words = lowerQ.split(/\s+/);
    for (const word of words) {
      const matchedService = mockResources.find(s => 
        s.name.toLowerCase().includes(word) || s.tags?.some(t => t.includes(word))
      );
      if (matchedService) {
        return {
          text: `Found ${matchedService.name}: Status is ${matchedService.status} with ${matchedService.healthScore}% health. Type: ${matchedService.type}. Owner: ${matchedService.owner}. Region: ${matchedService.region}. Latency: ${matchedService.telemetry.latency}ms.`,
          actions: ['Dependencies', 'Performance', 'Cost'],
        };
      }
    }

    // Generic fallback
    return {
      text: `I'm analyzing your infrastructure. Try asking about: "health", "dependencies", "performance", "errors", "cost", "resources", or name a specific service like "${mockResources[0]?.name}". What would you like to know?`,
      actions: ['Health Status', 'All Services', 'Performance'],
    };
  };

  const handleSend = (messageText = input) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMsg = {
      id: messages.length + 1,
      type: 'user',
      text: messageText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Generate and display bot response
    setTimeout(() => {
      const response = generateResponse(messageText);
      const botMsg = {
        id: messages.length + 2,
        type: 'bot',
        text: response.text,
        actions: response.actions,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsLoading(false);
    }, 800);
  };

  if (!selectedResource) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'} p-6 text-center`}>
        <MessageCircle className={`w-12 h-12 mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Select a resource to start incident analysis
        </p>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className={`p-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'} flex-shrink-0`}>
        <div className="flex items-center gap-2 mb-1">
          <MessageCircle className="w-4 h-4 text-cyan-400" />
          <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Infrastructure Assistant</h3>
        </div>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Ask about {selectedResource?.name} or any service
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs rounded-lg p-3 ${
                  msg.type === 'user'
                    ? isDark
                      ? 'bg-cyan-600 text-white'
                      : 'bg-cyan-100 text-cyan-900'
                    : isDark
                    ? 'bg-slate-800 text-slate-100 border border-slate-700'
                    : 'bg-white text-slate-900 border border-slate-300'
                }`}
              >
                <p className="text-sm">{msg.text}</p>

                {msg.actions && msg.type === 'bot' && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.actions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(action)}
                        className={`text-xs px-2 py-1 rounded transition-all ${
                          isDark
                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-100'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                        }`}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex gap-1 p-3 rounded-lg w-fit ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}
          >
            <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'} flex-shrink-0`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about health, performance, dependencies, cost..."
            className={`flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            } border transition-colors`}
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default RootCauseAnalyzer;

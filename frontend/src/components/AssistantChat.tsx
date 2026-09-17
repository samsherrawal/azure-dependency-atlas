import React, { useState } from 'react';

interface AssistantChatProps {
  selectedService?: any;
}

export default function AssistantChat({ selectedService }: AssistantChatProps) {
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your infrastructure assistant. Ask me about dependencies, recent deployments, or what might be causing issues.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input, timestamp: new Date() }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/assistant/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input,
          context: { selectedId: selectedService?.id },
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer,
          evidence: data.evidence,
          confidence: data.confidence,
          next_steps: data.next_steps,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error: Could not process request', timestamp: new Date() }]);
    }

    setLoading(false);
  };

  return (
    <div className="panel assistant-panel">
      <div className="assistant-header">
        <h2>🤖 Atlas Assistant</h2>
        {selectedService && <div className="context-badge">{selectedService.name}</div>}
      </div>

      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
            {msg.confidence && <div className="confidence">Confidence: {Math.round(msg.confidence * 100)}%</div>}
            {msg.next_steps && (
              <div className="next-steps">
                <strong>Next steps:</strong>
                <ul>
                  {msg.next_steps.map((step: string, i: number) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="message-time">{msg.timestamp.toLocaleTimeString()}</div>
          </div>
        ))}
        {loading && <div className="message assistant loading">Investigating...</div>}
      </div>

      <form onSubmit={handleAsk} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What depends on this? What changed? Why is this failing?"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          Ask
        </button>
      </form>

      <div className="suggested-questions">
        <small>Try asking:</small>
        <div className="question-chips">
          <button onClick={() => setInput('What depends on this service?')} className="chip">
            What depends on this?
          </button>
          <button onClick={() => setInput('What changed before this?')} className="chip">
            What changed?
          </button>
          <button onClick={() => setInput('Why might this fail?')} className="chip">
            Risk assessment
          </button>
        </div>
      </div>
    </div>
  );
}

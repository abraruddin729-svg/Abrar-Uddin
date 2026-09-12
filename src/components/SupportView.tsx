import React, { useState } from 'react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const SupportView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Hello! I am your HomeCare Pro Assistant. I can assist you with service questions, booking changes, verified professional criteria, or safety policies. How can I help you today?',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const quickQuestions = [
    'How does the price protection guarantee work?',
    'What background checks do you perform on technicians?',
    'Can I reschedule an appointment?',
    'Do repairs come with a warranty?',
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const response = await fetch('/api/ai/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      });
      if (response.ok) {
        const data = await response.json();
        const botMsg: ChatMessage = {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: data.reply || 'All HomeCare Pro technicians are verified and background checked. We guarantee upfront transparent rates with zero unexpected fees.',
          timestamp: 'Just now',
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch {
      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: 'All HomeCare Pro technicians are certified and backed by our ₹50,000 damage protection guarantee. You only pay after work is fully completed and verified.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div id="support-view-container" className="px-4 pt-5 pb-28 flex flex-col gap-4 max-w-md mx-auto w-full">
      <div>
        <h1 className="text-[22px] font-bold text-[#131b2e] tracking-tight">
          24/7 HomeCare Support
        </h1>
        <p className="text-[13px] text-[#434655]">
          Instant AI assistance and verified professional escalation
        </p>
      </div>

      {/* Emergency Helpline Card */}
      <div className="bg-gradient-to-r from-[#004ac6] to-[#1d4ed8] text-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">support_agent</span>
          </div>
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Emergency Dispatch Hotline
            </span>
            <span className="text-base font-extrabold text-white">
              1800-419-7788 (Toll Free)
            </span>
          </div>
        </div>
        <a
          href="tel:18004197788"
          className="px-3 py-1.5 rounded-full bg-white text-[#004ac6] text-xs font-bold shadow-xs hover:bg-[#f2f3ff] transition-colors"
        >
          Call Now
        </a>
      </div>

      {/* Chat Messages Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#eaedff] shadow-sm flex flex-col gap-3 min-h-[300px] max-h-[380px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
            }`}
          >
            <div
              className={`p-3 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#004ac6] text-white rounded-br-xs'
                  : 'bg-[#f2f3ff] text-[#131b2e] rounded-bl-xs'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-[#737686] mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}
        {isSending && (
          <div className="self-start bg-[#f2f3ff] text-[#004ac6] text-xs px-3 py-2 rounded-2xl flex items-center gap-1.5 animate-pulse">
            <span className="material-symbols-outlined text-[16px] animate-spin">
              autorenew
            </span>
            <span>HomeCare Assistant is typing...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold text-[#737686] uppercase tracking-wider">
          Suggested Topics:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="text-[11px] bg-[#eaedff] text-[#0039b5] hover:bg-[#dbe1ff] px-2.5 py-1.5 rounded-full text-left font-medium transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question about repairs, warranty, pricing..."
          className="flex-1 h-12 px-4 rounded-xl bg-white border border-[#eaedff] text-xs text-[#131b2e] outline-none focus:ring-2 focus:ring-[#004ac6]"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="h-12 w-12 rounded-xl bg-[#004ac6] hover:bg-[#1d4ed8] text-white flex items-center justify-center disabled:opacity-50 transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-[20px]">send</span>
        </button>
      </form>
    </div>
  );
};

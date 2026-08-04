import React, { useState } from 'react';
import { useSystem } from '../../context/SystemContext';

export function AICoach() {
  const { hunter, quests, habits } = useSystem();
  const [messages, setMessages] = useState([
    {
      sender: 'system',
      text: `Greetings Hunter ${hunter.name}. I am your System AI Coach. My neural matrices have evaluated your recent ${habits.length} habits and ${quests.filter(q => !q.completed).length} active quests. How may I assist your leveling trajectory today?`,
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');

  const quickPrompts = [
    "Recommend today's optimal focus strategy",
    "Analyze my stat allocation efficiency",
    "What is my risk of triggering a Penalty Quest?",
    "How can I level up faster this week?",
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    setTimeout(() => {
      let replyText = `System evaluation complete: Based on your Level ${hunter.level} status (${hunter.rank}), completing your Daily Quests and maintaining your ${hunter.streakDays}-day streak will maximize your weekly XP gain by +2,500 XP.`;

      if (query.toLowerCase().includes('stat')) {
        replyText = `Stat Allocation Advisory: You currently have ${hunter.unallocatedPoints} unallocated stat points. Given your current Strength (${hunter.stats.strength}) and Intelligence (${hunter.stats.intelligence}), I recommend allocating +2 to Intelligence to increase your deep work velocity.`;
      } else if (query.toLowerCase().includes('penalty')) {
        replyText = `Penalty Risk Assessment: Low. You have zero overdue daily quests today. Keep your daily push-ups and code refactoring tasks on schedule before 23:59.`;
      } else if (query.toLowerCase().includes('focus')) {
        replyText = `Focus Strategy Recommendation: Initialize a 45-minute Focus Chamber session right now. Playing the 'Digital Quiet' ambient track yields an estimated +450 XP bonus upon completion.`;
      }

      const botMsg = { sender: 'system', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto h-[calc(100vh-180px)]">
      {/* Header */}
      <div className="bg-surface p-6 rounded-2xl border border-black/5 premium-shadow flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary-gold/20 flex items-center justify-center text-secondary-gold border border-secondary-gold/40">
            <span className="material-symbols-outlined text-2xl">smart_toy</span>
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-primary flex items-center gap-2">
              System AI Coach
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </h1>
            <p className="text-xs text-on-surface-variant">Neural Productivity & Directive Assistant</p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-surface-container-highest text-primary">
          ONLINE • V2.4
        </span>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-surface p-6 rounded-2xl border border-black/5 premium-shadow flex-1 overflow-y-auto flex flex-col gap-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 max-w-[80%] ${
              m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              m.sender === 'user' ? 'bg-primary text-white' : 'gold-gradient text-white'
            }`}>
              {m.sender === 'user' ? 'YOU' : 'AI'}
            </div>
            <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
              m.sender === 'user'
                ? 'bg-primary text-white font-medium rounded-tr-none'
                : 'bg-surface-container-low text-primary border border-black/5 rounded-tl-none'
            }`}>
              <p>{m.text}</p>
              <span className={`text-[9px] block mt-1 ${m.sender === 'user' ? 'text-slate-300 text-right' : 'text-on-surface-variant/60'}`}>
                {m.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            className="px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-container text-xs font-semibold text-primary border border-black/5 whitespace-nowrap shadow-sm transition-colors"
          >
            💬 {qp}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={e => { e.preventDefault(); handleSend(); }}
        className="bg-surface p-3 rounded-2xl border border-black/10 premium-shadow flex items-center gap-3"
      >
        <input
          type="text"
          placeholder="Ask the System AI Coach for advice or quest strategy..."
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container-low text-xs text-primary focus:outline-none focus:ring-2 focus:ring-secondary-gold"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl gold-gradient text-white font-bold text-xs shadow-md hover:scale-105 transition-transform flex items-center gap-1"
        >
          <span>Send</span>
          <span className="material-symbols-outlined text-sm">send</span>
        </button>
      </form>
    </div>
  );
}

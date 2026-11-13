import React, { useState, useRef, useEffect } from 'react';
import { useTransit } from '../../context/TransitContext';
import { askTransitAssistant } from '../../services/aiAssistantService';
import {
  Bot,
  Send,
  X,
  Sparkles,
  Key,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  Bus,
  AlertTriangle
} from 'lucide-react';

export default function AIAssistantModal({ isOpen, onClose }) {
  const { buses, routes, rideShares, alerts, geminiApiKey, setGeminiApiKey } = useTransit();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Namaskara! I am **YatraAI Transit Assistant** 🌱. How can I help your rural commute today? Ask about upcoming buses, route disruptions, breakdown recovery, or student carpools.',
      source: 'YatraAI Knowledge Engine'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [tempKey, setTempKey] = useState(geminiApiKey);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await askTransitAssistant({
        prompt: query,
        contextData: { buses, routes, rideShares, alerts },
        apiKey: geminiApiKey
      });

      const botMsg = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        source: response.source
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `b-err-${Date.now()}`,
          sender: 'bot',
          text: 'Apologies, I encountered a temporary issue. Please check the route schedule or carpool tab directly.',
          source: 'System Fallback'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveKey = (e) => {
    e.preventDefault();
    setGeminiApiKey(tempKey.trim());
    setShowKeyInput(false);
  };

  const quickQuestions = [
    'What should I do if Bus 4 broke down at Mani?',
    'When is the next bus to Sahyadri Campus?',
    'Are there any student carpools available?',
    'Is the KSRTC student concession pass valid?'
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[620px] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">YatraAI Transit Assistant</h3>
                <span className="bg-emerald-400 text-emerald-950 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Active
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                {geminiApiKey ? 'Gemini 1.5 Flash Connected' : 'Heuristic Rural Mobility Engine (Offline Ready)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="p-2 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10 transition"
              title="Configure Gemini API Key"
            >
              <Key className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Optional Gemini API Key Drawer */}
        {showKeyInput && (
          <form onSubmit={handleSaveKey} className="bg-slate-100 p-3 border-b border-slate-200 flex items-center gap-2 text-xs">
            <Key className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="Paste Google Gemini API Key (Optional - stored in localStorage)"
              className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
            />
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg whitespace-nowrap"
            >
              Save Key
            </button>
            {geminiApiKey && (
              <button
                type="button"
                onClick={() => {
                  setGeminiApiKey('');
                  setTempKey('');
                }}
                className="text-rose-600 hover:text-rose-800 text-xs px-2"
              >
                Clear
              </button>
            )}
          </form>
        )}

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
              </div>

              {msg.source && (
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  Source: {msg.source}
                </span>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-2xl px-3 py-2 w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>YatraAI is analyzing rural transit data...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-3 py-2 bg-slate-100/70 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Quick:
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about buses, breakdowns, carpools, or rural routes..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold p-2.5 rounded-xl shadow-md transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

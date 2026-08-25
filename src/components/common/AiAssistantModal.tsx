import React, { useState, useEffect, useRef } from 'react';
import { Artifact } from '../../types';
import { 
  X, 
  Sparkles, 
  Send, 
  BookOpen, 
  FileText, 
  Languages, 
  HelpCircle, 
  RotateCcw,
  Bot
} from 'lucide-react';
import { api } from '../../services/api';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextArtifact?: Artifact | null;
  onSelectArtifact?: (artifact: Artifact) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'docent';
  text: string;
  timestamp: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  contextArtifact
}) => {
  if (!isOpen) return null;

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'docent',
      text: contextArtifact
        ? `Welcome to the HeritageHub Archival Research Desk. I am loaded with the complete archaeological dossier for **${contextArtifact.title}** (${contextArtifact.catalogNumber}, ${contextArtifact.period}). You may ask about its provenance, mineral composition, cultural symbology, or epigraphy.`
        : `Greetings. I am the HeritageHub Archival Docent, trained on global archaeological registries, UNESCO conservation protocols, and epigraphic corpora. How may I assist your exploration of ancient civilizations and material culture today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await api.askArchivalDocent(textToSend, contextArtifact);
      const docentMsg: Message = {
        id: `docent-${Date.now()}`,
        sender: 'docent',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, docentMsg]);
    } catch {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'docent',
        text: 'I encountered a temporary communication interruption with the archival server. Please try submitting your inquiry again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = contextArtifact
    ? [
        `What is the provenance history of this ${contextArtifact.category}?`,
        `How was the ${contextArtifact.medium} prepared and fired?`,
        `Explain the symbolic meaning in ${contextArtifact.culture} society.`,
        `Generate an academic museum placard for exhibition.`
      ]
    : [
        'How did Indus Valley sanitation and urban grids work?',
        'Explain the difference between Greek black-figure and red-figure pottery.',
        'What were the primary trade goods along the Maritime Silk Road?',
        'How do conservators use multispectral imaging on ancient vellum?'
      ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-[#faf9f5] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-[#c4c7c7] h-[85vh] max-h-[700px] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c4c7c7]/50 bg-[#efeeea]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#94492d] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[15px] font-display font-bold text-[#1b1c1a] flex items-center gap-2">
                Archival AI Docent
                <span className="text-[10px] uppercase tracking-wider font-sans bg-[#cca730]/20 text-[#735c00] px-2 py-0.5 rounded font-bold">
                  Curator Edition
                </span>
              </h3>
              <p className="text-[11px] text-[#444748]">
                {contextArtifact ? `Focus: ${contextArtifact.title}` : 'Connected to /api/ai/ archival knowledge graph'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessages([messages[0]])}
              className="p-2 rounded-full hover:bg-[#e9e8e4] text-[#444748] transition-colors cursor-pointer"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#e9e8e4] text-[#1b1c1a] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-grow overflow-y-auto p-5 space-y-4 bg-[#faf9f5]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-4 text-[14px] leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#94492d] text-white rounded-br-none'
                    : 'bg-[#efeeea] text-[#1b1c1a] border border-[#c4c7c7]/50 rounded-bl-none'
                }`}
              >
                {msg.sender === 'docent' && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#94492d] mb-1.5">
                    <Bot className="w-3.5 h-3.5" /> Archival Docent
                  </div>
                )}
                <div className="whitespace-pre-line">{msg.text}</div>
                <div
                  className={`text-[10px] mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-white/70' : 'text-[#747878]'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start">
              <div className="bg-[#efeeea] border border-[#c4c7c7]/50 rounded-xl rounded-bl-none p-4 text-[13px] text-[#444748] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#94492d] animate-spin" />
                <span>Consulting archaeological records & provenance indices...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-2.5 bg-[#efeeea]/60 border-t border-[#c4c7c7]/30 flex gap-2 overflow-x-auto text-[12px] no-scrollbar">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 bg-[#faf9f5] hover:bg-white text-[#1b1c1a] border border-[#c4c7c7]/60 rounded-full whitespace-nowrap text-xs font-medium cursor-pointer transition-colors shadow-2xs shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#c4c7c7]/50 bg-[#efeeea]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={contextArtifact ? `Ask about ${contextArtifact.title}...` : "Ask a historical or provenance question..."}
              className="flex-grow px-4 py-2.5 rounded-xl bg-white border border-[#c4c7c7] text-[#1b1c1a] placeholder:text-[#747878] text-[14px] focus:outline-none focus:border-[#cca730] shadow-xs"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-2.5 bg-[#94492d] hover:bg-[#773319] disabled:opacity-40 text-white rounded-xl font-semibold text-[13px] tracking-wider uppercase flex items-center justify-center transition-colors cursor-pointer shadow-xs shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

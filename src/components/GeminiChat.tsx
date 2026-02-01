'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles, User, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const PORTFOLIO_DATA = {
  name: "Ankit Gole",
  title: "AI Engineer & Researcher",
  education: "Masters in AI at WPI, GPA: 3.88/4.0, Graduating May 2026",
  email: "aggole@wpi.edu",
  phone: "+1 (774) 525-2916",
  location: "Worcester, MA",
  achievements: ["MVP in GQP Team", "Best Data Science GQP Team Fall 2025"],
  experience: [
    { role: "Applied LLM Researcher", company: "PayPal x WPI", highlight: "0.85 F1 with LoRA fine-tuning" },
    { role: "AI Researcher", company: "WPI", highlight: "87.4% accuracy at 93% lower cost" },
    { role: "AI Agent Builder Intern", company: "NeuralSeek", highlight: "~95% intent routing accuracy" },
  ],
  projects: [
    "AI Resume & Job Tracker - RAG-guided automation",
    "MADWE - Multi-Agent Diffusion World Engine",
    "Drag-A-GAN Reimplementation",
    "TumorLytix - Brain tumor detection",
    "Fake Review Bounty Hunter - Graph analytics",
  ],
  skills: ["PyTorch", "LLMs", "RAG", "LoRA", "Diffusion Models", "LangChain", "FastAPI", "Azure ML", "GCP"],
};

function generateLocalResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('experience') || q.includes('work') || q.includes('job')) {
    return `Ankit has worked as:\n\n${PORTFOLIO_DATA.experience.map(e => `• ${e.role} at ${e.company}: ${e.highlight}`).join('\n')}\n\nVisit the Experience page for more details!`;
  }
  if (q.includes('project')) {
    return `Ankit's top projects include:\n\n${PORTFOLIO_DATA.projects.map(p => `• ${p}`).join('\n')}\n\nCheck out the Projects page for full details!`;
  }
  if (q.includes('skill') || q.includes('tech')) {
    return `Ankit's key skills: ${PORTFOLIO_DATA.skills.join(', ')}.\n\nSee the Skills page for the complete stack!`;
  }
  if (q.includes('education') || q.includes('school') || q.includes('degree')) {
    return `${PORTFOLIO_DATA.education}\n\nAchievements: ${PORTFOLIO_DATA.achievements.join(', ')}`;
  }
  if (q.includes('contact') || q.includes('email') || q.includes('reach')) {
    return `You can reach Ankit at:\n• Email: ${PORTFOLIO_DATA.email}\n• Phone: ${PORTFOLIO_DATA.phone}\n• Location: ${PORTFOLIO_DATA.location}\n\nOr use the Contact page!`;
  }
  if (q.includes('achievement') || q.includes('award')) {
    return `Ankit's achievements:\n${PORTFOLIO_DATA.achievements.map(a => `• ${a}`).join('\n')}\n\nVisit the Achievements page for more!`;
  }
  if (q.includes('who') || q.includes('about') || q.includes('tell me')) {
    return `${PORTFOLIO_DATA.name} is an ${PORTFOLIO_DATA.title} pursuing ${PORTFOLIO_DATA.education}. He specializes in LLMs, RAG systems, and Generative AI.\n\nExplore the sections to learn more!`;
  }

  return `I can help you learn about Ankit! Try asking about:\n• Work experience\n• Projects\n• Skills\n• Education\n• Achievements\n• Contact info\n\nOr explore the sections using the navigation!`;
}

interface GeminiChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GeminiChat({ isOpen, onClose }: GeminiChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Ankit's AI assistant. Ask me anything about his experience, projects, or skills!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulate a brief delay for natural feel
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    const response = generateLocalResponse(userMessage);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-6 w-[380px] h-[500px] glass-strong rounded-3xl
                     flex flex-col overflow-hidden z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0a84ff] to-[#5e5ce6]
                              flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Assistant</h3>
                <p className="text-white/50 text-xs">Powered by Gemini</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} className="text-white/70" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                  ${message.role === 'user'
                    ? 'bg-white/10'
                    : 'bg-gradient-to-r from-[#0a84ff] to-[#5e5ce6]'
                  }`}
                >
                  {message.role === 'user'
                    ? <User size={16} className="text-white/70" />
                    : <Sparkles size={16} className="text-white" />
                  }
                </div>
                <div className={`max-w-[75%] p-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-[#0a84ff] text-white'
                    : 'bg-white/5 text-white/90'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0a84ff] to-[#5e5ce6]
                                flex items-center justify-center">
                  <Loader2 size={16} className="text-white animate-spin" />
                </div>
                <div className="bg-white/5 p-3 rounded-2xl">
                  <p className="text-sm text-white/50">Thinking...</p>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Ankit..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5
                           text-white placeholder:text-white/30 text-sm
                           focus:outline-none focus:border-[#0a84ff]/50 transition-colors"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-full bg-gradient-to-r from-[#0a84ff] to-[#5e5ce6]
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:shadow-lg hover:shadow-[#0a84ff]/25 transition-all"
              >
                <Send size={18} className="text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

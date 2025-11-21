import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { askGeminiBotanist } from '../services/geminiService';

const AiAdvisor: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Ciao! Sono il tuo esperto botanico AI. Fammi una domanda sull\'irrigazione, sulle tue piante o sull\'evapotraspirazione!',
      timestamp: Date.now()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await askGeminiBotanist(input);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section id="ai-expert" className="py-24 bg-leaf-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4">
            <Sparkles className="text-leaf-600 w-6 h-6 mr-2" />
            <span className="font-bold text-leaf-800">Powered by Gemini AI</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">L'Esperto Risponde</h2>
          <p className="text-slate-600 mt-2">Hai dubbi su quanto innaffiare? Chiedi consigli personalizzati.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[600px]">
          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-800 ml-3' : 'bg-leaf-600 mr-3'}`}>
                    {msg.role === 'user' ? <User className="text-white w-6 h-6" /> : <Bot className="text-white w-6 h-6" />}
                  </div>
                  
                  <div 
                    className={`p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-slate-800 text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
                    }`}
                  >
                    <div className="markdown-body" dangerouslySetInnerHTML={{ 
                      __html: msg.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                    }} />
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                 <div className="flex flex-row items-center bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 ml-14">
                    <div className="w-2 h-2 bg-leaf-500 rounded-full animate-bounce mr-1"></div>
                    <div className="w-2 h-2 bg-leaf-500 rounded-full animate-bounce mr-1 delay-75"></div>
                    <div className="w-2 h-2 bg-leaf-500 rounded-full animate-bounce delay-150"></div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Es. Quanta acqua serve ai pomodori con 30 gradi?"
                className="flex-1 p-4 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-leaf-500 text-slate-800 placeholder-slate-400 transition-all"
                disabled={loading}
              />
              <button 
                onClick={handleSend} 
                disabled={loading || !input.trim()}
                className="p-4 bg-leaf-600 hover:bg-leaf-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="text-center mt-2">
              <span className="text-xs text-slate-400">L'AI può commettere errori. Verifica sempre le informazioni importanti.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiAdvisor;
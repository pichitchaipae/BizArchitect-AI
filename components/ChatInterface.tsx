import React, { useRef, useState, useEffect } from 'react';
import { Send, Image as ImageIcon, Loader2, User, Bot, X, ChevronDown, Layers, Building, Cloud, Server, Lightbulb, ArrowRight } from 'lucide-react';
import { ChatMessage, TechStack } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, image: string | null) => void;
  isLoading: boolean;
  selectedStack: TechStack;
  onStackChange: (stack: TechStack) => void;
}

const STACK_LABELS: Record<TechStack, { label: string; icon: React.ElementType; color: string; desc: string }> = {
  opensource: { label: 'Modern Open Source', icon: Layers, color: 'text-emerald-400', desc: 'Best for Startups/Portfolios (Next.js, Supabase)' },
  enterprise: { label: 'Enterprise (Microsoft)', icon: Building, color: 'text-blue-400', desc: 'Best for Corp/Banking (Azure, SQL Server)' },
  aws: { label: 'Cloud Native (AWS)', icon: Server, color: 'text-orange-400', desc: 'Standard Cloud Scale (Amplify, DynamoDB)' },
  google: { label: 'Google Cloud', icon: Cloud, color: 'text-red-400', desc: 'High Performance/AI (Spanner, Cloud Run)' },
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  isLoading,
  selectedStack,
  onStackChange
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isStackMenuOpen, setIsStackMenuOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;
    onSendMessage(inputText, selectedImage);
    setInputText('');
    setSelectedImage(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const ActiveIcon = STACK_LABELS[selectedStack].icon;

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
             <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">BizArchitect AI</h2>
            
            {/* Stack Selector */}
            <div className="relative mt-0.5">
              <button 
                onClick={() => setIsStackMenuOpen(!isStackMenuOpen)}
                className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-white transition-colors hover:bg-slate-800/50 -ml-1 px-1 py-0.5 rounded-md"
                title="Select the technology infrastructure for resource planning"
              >
                <span>Tech Strategy:</span>
                <ActiveIcon className={`w-3 h-3 ${STACK_LABELS[selectedStack].color}`} />
                <span className="font-medium text-slate-300">{STACK_LABELS[selectedStack].label}</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </button>

              {isStackMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsStackMenuOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 py-1 overflow-hidden">
                    <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider bg-slate-900/50 border-b border-slate-700">
                      Select Infrastructure Model
                    </div>
                    {(Object.keys(STACK_LABELS) as TechStack[]).map((stackKey) => {
                      const ItemIcon = STACK_LABELS[stackKey].icon;
                      return (
                        <button
                          key={stackKey}
                          onClick={() => {
                            onStackChange(stackKey);
                            setIsStackMenuOpen(false);
                          }}
                          className={`w-full flex items-start gap-3 px-3 py-3 text-left transition-colors border-b border-slate-700/50 last:border-0 ${
                            selectedStack === stackKey 
                              ? 'bg-indigo-600/10' 
                              : 'hover:bg-slate-700'
                          }`}
                        >
                          <ItemIcon className={`w-4 h-4 mt-0.5 ${STACK_LABELS[stackKey].color}`} />
                          <div>
                            <div className={`text-xs font-medium ${selectedStack === stackKey ? 'text-indigo-300' : 'text-slate-200'}`}>
                              {STACK_LABELS[stackKey].label}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                              {STACK_LABELS[stackKey].desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="mt-8 px-4">
            <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-inner">
                <Lightbulb className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Build Your Business Model</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">
                I help SMEs and Analysts turn rough ideas into structured strategies. Select a tech stack and describe your vision.
              </p>
              
              <div className="grid gap-2">
                {[
                  "Plan a new Coffee Shop with an app",
                  "Create a SaaS platform for HR",
                  "Start a Digital Marketing Agency"
                ].map((prompt, i) => (
                  <button 
                    key={i}
                    onClick={() => onSendMessage(prompt, null)}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/30 transition-all text-left group"
                  >
                    <span className="text-sm text-slate-300 group-hover:text-indigo-300">{prompt}</span>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transform group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-700' : 'bg-indigo-600'}`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-slate-300" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            
            <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-slate-800 text-slate-100 rounded-tr-none border border-slate-700' 
                  : 'bg-indigo-950/40 text-slate-100 rounded-tl-none border border-indigo-500/20'
              }`}>
                {msg.image && (
                  <img src={msg.image} alt="User upload" className="max-w-full h-auto rounded-lg mb-3 border border-slate-600" />
                )}
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-indigo-900/10 rounded-2xl rounded-tl-none px-4 py-3 flex items-center border border-indigo-500/10">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin mr-2" />
              <span className="text-xs text-indigo-300">Analyzing via {STACK_LABELS[selectedStack].label}...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        {selectedImage && (
          <div className="mb-2 relative inline-block">
            <img src={selectedImage} alt="Selected" className="h-20 rounded-lg border border-slate-600" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <div className="flex items-end gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700 focus-within:border-indigo-500/50 transition-colors">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded-lg transition-colors"
            title="Upload napkin sketch or diagram"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Describe your business idea..."
            className="flex-1 bg-transparent text-slate-200 text-sm placeholder:text-slate-500 resize-none focus:outline-none py-2 max-h-32 min-h-[40px] custom-scrollbar"
            rows={1}
            style={{ height: 'auto', minHeight: '40px' }}
          />
          
          <button
            onClick={handleSend}
            disabled={(!inputText.trim() && !selectedImage) || isLoading}
            className={`p-2 rounded-lg transition-all duration-200 ${
              (!inputText.trim() && !selectedImage) || isLoading
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
            }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
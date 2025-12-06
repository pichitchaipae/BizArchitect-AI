import React, { useState } from 'react';
import { LayoutDashboard, MessageSquare } from 'lucide-react';
import { BusinessCanvas } from './components/BusinessCanvas';
import { ChatInterface } from './components/ChatInterface';
import { EditModal } from './components/EditModal';
import { BusinessCanvasState, ChatMessage, TechStack, CanvasSection, CanvasItem } from './types';
import { INITIAL_CANVAS_STATE } from './constants';
import { analyzeBusinessIdea } from './services/geminiService';

const App: React.FC = () => {
  const [canvasState, setCanvasState] = useState<BusinessCanvasState>(INITIAL_CANVAS_STATE);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'canvas'>('chat');
  const [selectedStack, setSelectedStack] = useState<TechStack>('opensource'); 
  
  // Modal State
  const [editingSection, setEditingSection] = useState<CanvasSection | null>(null);

  const handleSendMessage = async (text: string, image: string | null) => {
    // Optimistic UI update
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      image: image || undefined,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const result = await analyzeBusinessIdea(messages, text, image, canvasState, selectedStack);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: result.responseToUser,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, aiMsg]);
      setCanvasState(result.canvasUpdate);
      
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I encountered an error analyzing your idea. Please try again.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (section: CanvasSection) => {
    setEditingSection(section);
  };

  const handleModalSave = (section: CanvasSection, updatedItem: CanvasItem) => {
    setCanvasState(prev => ({
      ...prev,
      [section]: updatedItem
    }));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-200">
      {/* Edit Modal */}
      <EditModal 
        isOpen={!!editingSection}
        sectionKey={editingSection}
        item={editingSection ? canvasState[editingSection] : INITIAL_CANVAS_STATE.valueProposition}
        onClose={() => setEditingSection(null)}
        onSave={handleModalSave}
      />

      {/* Mobile Tab Navigation (Visible only on small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-around z-50">
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'chat' ? 'text-indigo-400' : 'text-slate-500'}`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs font-medium">Chat</span>
        </button>
        <button 
          onClick={() => setActiveTab('canvas')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'canvas' ? 'text-indigo-400' : 'text-slate-500'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-xs font-medium">Canvas</span>
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="flex w-full h-full md:pb-0 pb-16">
        {/* Left: Chat */}
        <div className={`
          md:w-[400px] md:flex flex-col border-r border-slate-800 bg-slate-900 shadow-2xl z-10
          ${activeTab === 'chat' ? 'w-full flex' : 'hidden'}
        `}>
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            selectedStack={selectedStack}
            onStackChange={setSelectedStack}
          />
        </div>

        {/* Right: Canvas */}
        <div className={`
          flex-1 bg-slate-950 relative flex flex-col
          ${activeTab === 'canvas' ? 'w-full flex' : 'hidden md:flex'}
        `}>
          {/* Canvas Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', 
              backgroundSize: '24px 24px' 
            }} 
          />
          
          <BusinessCanvas 
            canvasState={canvasState} 
            onCardClick={handleCardClick}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
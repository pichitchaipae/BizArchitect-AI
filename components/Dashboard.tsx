import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, MessageSquare } from 'lucide-react';
import { BusinessCanvas } from './BusinessCanvas';
import { ChatInterface } from './ChatInterface';
import { EditModal } from './EditModal';
import { BusinessCanvasState, ChatMessage, TechStack, CanvasSection, CanvasItem, Theme, AnalystRole } from '../types';
import { INITIAL_CANVAS_STATE } from '../constants';
import { analyzeBusinessIdea } from '../services/geminiService';
import { db } from '../services/firebase';
import firebase from 'firebase/compat/app';

interface DashboardProps {
  user: firebase.User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  // App State
  const [canvasState, setCanvasState] = useState<BusinessCanvasState>(INITIAL_CANVAS_STATE);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'canvas'>('chat');
  const [selectedStack, setSelectedStack] = useState<TechStack>('opensource'); 
  const [analystRole, setAnalystRole] = useState<AnalystRole>('business_dev');
  const [theme, setTheme] = useState<Theme>('system');
  
  // Modal State
  const [editingSection, setEditingSection] = useState<CanvasSection | null>(null);

  // Sync Control to prevent loops
  const isRemoteUpdate = useRef(false);

  // Real-time Database Sync (Firestore)
  useEffect(() => {
    if (!user || !db) return;

    const projectDocRef = db.collection('projects').doc(user.uid);
    
    // Listen for changes from Firestore
    const unsubscribeSnapshot = projectDocRef.onSnapshot((docSnapshot) => {
      if (docSnapshot.exists) {
        const data = docSnapshot.data();
        if (data) {
          isRemoteUpdate.current = true;
          
          // Update local state with remote data
          if (data.canvasData) setCanvasState(data.canvasData);
          if (data.stack) setSelectedStack(data.stack as TechStack);
          if (data.persona) setAnalystRole(data.persona as AnalystRole);
          
          // Reset flag after a short delay to allow state updates to settle
          setTimeout(() => { isRemoteUpdate.current = false; }, 100);
        }
      }
    });

    return () => unsubscribeSnapshot();
  }, [user]);

  // Save changes to Firestore
  useEffect(() => {
    if (!user || !db || isRemoteUpdate.current) return;

    const saveToFirestore = async () => {
      try {
        await db.collection('projects').doc(user.uid).set({
          userId: user.uid,
          email: user.email,
          photoURL: user.photoURL,
          canvasData: canvasState,
          stack: selectedStack,
          persona: analystRole,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      } catch (error) {
        console.error("Error saving to Firestore:", error);
      }
    };

    // Debounce save
    const timeoutId = setTimeout(saveToFirestore, 1000);
    return () => clearTimeout(timeoutId);

  }, [canvasState, selectedStack, analystRole, user]);


  // Theme Management
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const handleSendMessage = async (text: string, image: string | null) => {
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
      const result = await analyzeBusinessIdea(messages, text, image, canvasState, selectedStack, analystRole);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: result.responseToUser,
        timestamp: Date.now(),
        suggestions: result.suggestions
      };

      setMessages(prev => [...prev, aiMsg]);
      setCanvasState(result.canvasUpdate);
      
    } catch (error: any) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: error.message || "I encountered an error analyzing your idea. Please try again.",
        timestamp: Date.now(),
        suggestions: ["Check API Key", "Try simpler text", "Restart chat"]
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
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors duration-300">
      {/* Edit Modal */}
      <EditModal 
        isOpen={!!editingSection}
        sectionKey={editingSection}
        item={editingSection ? canvasState[editingSection] : INITIAL_CANVAS_STATE.valueProposition}
        onClose={() => setEditingSection(null)}
        onSave={handleModalSave}
      />

      {/* Mobile Tab Navigation (Visible only on small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around z-50 transition-colors">
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'chat' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs font-medium">Chat</span>
        </button>
        <button 
          onClick={() => setActiveTab('canvas')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'canvas' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-xs font-medium">Canvas</span>
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="flex w-full h-full md:pb-0 pb-16">
        {/* Left: Chat */}
        <div className={`
          md:w-[400px] md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl z-10 transition-colors
          ${activeTab === 'chat' ? 'w-full flex' : 'hidden'}
        `}>
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            selectedStack={selectedStack}
            onStackChange={setSelectedStack}
            theme={theme}
            onThemeChange={setTheme}
            analystRole={analystRole}
            onRoleChange={setAnalystRole}
            userPhotoURL={user.photoURL}
          />
        </div>

        {/* Right: Canvas */}
        <div className={`
          flex-1 bg-slate-50 dark:bg-slate-950 relative flex flex-col transition-colors
          ${activeTab === 'canvas' ? 'w-full flex' : 'hidden md:flex'}
        `}>
          {/* Canvas Background Pattern */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', 
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

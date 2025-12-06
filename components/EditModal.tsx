import React, { useState, useEffect } from 'react';
import { CanvasItem, CanvasSection } from '../types';
import { SECTION_LABELS } from '../constants';
import { X, Check, AlertTriangle, HelpCircle, CheckCircle } from 'lucide-react';

interface EditModalProps {
  sectionKey: CanvasSection | null;
  item: CanvasItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (sectionKey: CanvasSection, updatedItem: CanvasItem) => void;
}

export const EditModal: React.FC<EditModalProps> = ({ sectionKey, item, isOpen, onClose, onSave }) => {
  const [content, setContent] = useState(item.content);
  const [status, setStatus] = useState(item.status);
  const [reasoning, setReasoning] = useState(item.reasoning);

  useEffect(() => {
    setContent(item.content);
    setStatus(item.status);
    setReasoning(item.reasoning);
  }, [item, isOpen]);

  if (!isOpen || !sectionKey) return null;

  const handleSave = () => {
    onSave(sectionKey, { content, status, reasoning });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{SECTION_LABELS[sectionKey]}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Refine the details for this business component.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Status Selector */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'strong', label: 'Validated', icon: CheckCircle, color: 'text-emerald-500 dark:text-emerald-400', border: 'peer-checked:border-emerald-500', bg: 'peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-500/10' },
              { value: 'assumed', label: 'Assumed', icon: HelpCircle, color: 'text-amber-500 dark:text-amber-400', border: 'peer-checked:border-amber-500', bg: 'peer-checked:bg-amber-50 dark:peer-checked:bg-amber-500/10' },
              { value: 'missing', label: 'Missing', icon: AlertTriangle, color: 'text-rose-500 dark:text-rose-400', border: 'peer-checked:border-rose-500', bg: 'peer-checked:bg-rose-50 dark:peer-checked:bg-rose-500/10' },
            ].map((opt) => (
              <label key={opt.value} className="cursor-pointer">
                <input 
                  type="radio" 
                  name="status" 
                  value={opt.value} 
                  checked={status === opt.value}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="peer hidden" 
                />
                <div className={`flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750 transition-all ${opt.border} ${opt.bg}`}>
                  <opt.icon className={`w-5 h-5 mb-1 ${opt.color}`} />
                  <span className={`text-xs font-medium ${opt.color}`}>{opt.label}</span>
                </div>
              </label>
            ))}
          </div>

          {/* Content Editor */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Detailed Content</label>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none leading-relaxed transition-colors"
              placeholder="Enter bullet points or detailed description..."
            />
          </div>

          {/* Reasoning/Notes Editor */}
          <div>
            <label htmlFor="reasoning" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Analyst Notes / AI Reasoning</label>
            <textarea
              id="reasoning"
              name="reasoning"
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              className="w-full h-20 p-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-colors"
              placeholder="Why is this section important? What questions remain?"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 transition-colors">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-lg shadow-indigo-500/20 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
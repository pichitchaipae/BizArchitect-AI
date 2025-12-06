import React from 'react';
import { CanvasItem } from '../types';
import { Info, CheckCircle, AlertTriangle, HelpCircle, Edit2 } from 'lucide-react';

interface CanvasCardProps {
  title: string;
  item: CanvasItem;
  gridArea: string;
  onClick: () => void;
}

export const CanvasCard: React.FC<CanvasCardProps> = ({ title, item, gridArea, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'strong': return 'border-emerald-500/30 bg-emerald-900/5 hover:bg-emerald-900/10 hover:border-emerald-500/50';
      case 'assumed': return 'border-amber-500/30 bg-amber-900/5 hover:bg-amber-900/10 hover:border-amber-500/50';
      case 'missing': return 'border-rose-500/30 bg-rose-900/5 hover:bg-rose-900/10 hover:border-rose-500/50';
      default: return 'border-slate-800 bg-slate-900/50 hover:bg-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'strong': return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
      case 'assumed': return <HelpCircle className="w-3.5 h-3.5 text-amber-500" />;
      case 'missing': return <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />;
      default: return <Info className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div 
      onClick={onClick}
      style={{ gridArea }}
      className={`group relative p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden shadow-sm hover:shadow-md ${getStatusColor(item.status)}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-200 transition-colors">{title}</h3>
        <div className="flex items-center gap-2">
          {getStatusIcon(item.status)}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-grow overflow-y-auto pr-1 custom-scrollbar">
        {item.content ? (
           <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
             {item.content}
           </p>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-800 rounded-lg group-hover:border-slate-700 transition-colors">
            <span className="text-xs text-slate-500 text-center leading-relaxed">
              {item.reasoning || "Click to add details..."}
            </span>
          </div>
        )}
      </div>

      {/* Hover Edit Action */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-200">
        <div className="p-1.5 bg-slate-800 rounded-md border border-slate-700 text-slate-300 shadow-sm">
          <Edit2 className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
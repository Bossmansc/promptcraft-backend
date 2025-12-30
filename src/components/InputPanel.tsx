import React from 'react';
import { PenLine } from 'lucide-react';
import { motion } from 'framer-motion';

interface InputPanelProps {
  value: string;
  onChange: (val: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export default function InputPanel({ value, onChange, onGenerate, isLoading }: InputPanelProps) {
  const charCount = value.length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
    >
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-slate-700">
          <PenLine className="w-4 h-4" />
          <span className="font-semibold text-sm">Input Prompt</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">{charCount} chars</span>
      </div>
      
      <div className="flex-1 p-4 relative">
        <textarea
          className="w-full h-full resize-none outline-none text-slate-700 placeholder-slate-300 text-lg custom-scrollbar"
          placeholder="E.g., Build a dashboard for a coffee shop inventory system with charts and dark mode..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <button
          onClick={onGenerate}
          disabled={!value.trim() || isLoading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all shadow-md
            ${!value.trim() || isLoading 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] hover:shadow-lg'
            }`}
        >
          {isLoading ? 'Processing...' : 'Generate Structured Prompt'}
        </button>
      </div>
    </motion.div>
  );
}

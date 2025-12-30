import React from 'react';
import { Terminal, History, Sparkles } from 'lucide-react';

interface HeaderProps {
  onToggleHistory: () => void;
}

export default function Header({ onToggleHistory }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">PromptCraft Assistant</h1>
            <p className="text-xs text-slate-500 font-medium">Casual to Structured Converter</p>
          </div>
        </div>
        
        <button 
          onClick={onToggleHistory}
          className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-slate-50"
        >
          <History className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">History</span>
        </button>
      </div>
    </header>
  );
}

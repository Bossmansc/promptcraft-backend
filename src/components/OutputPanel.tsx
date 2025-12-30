import React, { useState } from 'react';
import { Copy, Download, Check, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OutputPanelProps {
  content: string;
  onChange: (val: string) => void;
}

export default function OutputPanel({ content, onChange }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt-craft-output.txt';
    a.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl shadow-md overflow-hidden"
    >
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-slate-300">
          <FileCode className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-sm">Generated Output</span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Copy to Clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button 
            onClick={handleDownload}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Download .txt"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-0 relative group">
        <textarea
          className="w-full h-full p-4 resize-none outline-none bg-slate-900 text-slate-300 font-mono text-sm leading-relaxed custom-scrollbar selection:bg-blue-500/30"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          placeholder="Generated prompt will appear here..."
        />
      </div>
    </motion.div>
  );
}

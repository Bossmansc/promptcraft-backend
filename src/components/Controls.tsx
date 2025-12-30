import React from 'react';
import { Settings2 } from 'lucide-react';

interface ControlsProps {
  stack: string;
  setStack: (val: string) => void;
  style: string;
  setStyle: (val: string) => void;
}

export default function Controls({ stack, setStack, style, setStyle }: ControlsProps) {
  const stackOptions = ['Auto-Infer', 'Frontend Only', 'Full Stack', 'Mobile App'];
  const styleOptions = ['Auto-Infer', 'Clean Corporate', 'Modern SaaS', 'Playful / Retro', 'Dark Mode'];

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div className="flex items-center space-x-2 text-slate-400 mb-2 sm:mb-0">
        <Settings2 className="w-5 h-5" />
        <span className="text-sm font-semibold uppercase tracking-wider">Configuration</span>
      </div>
      
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">Stack Level</label>
          <select 
            value={stack} 
            onChange={(e) => setStack(e.target.value)}
            className="form-select block w-full rounded-md border-slate-300 bg-slate-50 text-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          >
            {stackOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase">Visual Style</label>
          <select 
            value={style} 
            onChange={(e) => setStyle(e.target.value)}
            className="form-select block w-full rounded-md border-slate-300 bg-slate-50 text-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          >
            {styleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { X, Trash2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryItem } from '../lib/api';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onLoadItem: (item: HistoryItem) => void;
  onDeleteItem: (id: number) => void;
}

export default function HistorySidebar({ isOpen, onClose, history, onLoadItem, onDeleteItem }: HistorySidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-20"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-30 flex flex-col border-l border-slate-200"
          >
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-800">Prompt History</h2>
              <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
              {history.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No history yet.
                </div>
              ) : (
                history.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-3 rounded-lg border border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all group"
                  >
                    <div 
                      className="cursor-pointer"
                      onClick={() => onLoadItem(item)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {item.stack_type}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 line-clamp-2 font-medium mb-1">
                        {item.user_input}
                      </p>
                    </div>
                    <div className="flex justify-end mt-2 pt-2 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
                        className="text-xs text-red-400 hover:text-red-600 flex items-center"
                      >
                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

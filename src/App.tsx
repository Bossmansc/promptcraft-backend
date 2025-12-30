import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import Controls from './components/Controls';
import HistorySidebar from './components/HistorySidebar';
import { generatePrompt, fetchHistory, deleteHistoryItem, HistoryItem } from './lib/api';

function App() {
  const [inputText, setInputText] = useState('');
  const [outputPrompt, setOutputPrompt] = useState('');
  const [stack, setStack] = useState('Auto-Infer');
  const [style, setStyle] = useState('Auto-Infer');
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    refreshHistory();
  }, []);

  const refreshHistory = async () => {
    try {
      const data = await fetchHistory();
      setHistory(data);
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const data = await generatePrompt({
        inputText,
        selectedStack: stack,
        selectedStyle: style
      });
      setOutputPrompt(data.generatedPrompt);
      await refreshHistory();
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to connect to backend. Ensure Flask is running on port 5000.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHistory = async (id: number) => {
    try {
      await deleteHistoryItem(id);
      await refreshHistory();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setInputText(item.user_input);
    setOutputPrompt(item.generated_prompt);
    setStack(item.stack_type);
    setStyle(item.style_type);
    setIsHistoryOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header onToggleHistory={() => setIsHistoryOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        
        {/* Controls Section */}
        <section>
          <Controls 
            stack={stack} setStack={setStack}
            style={style} setStyle={setStyle}
          />
        </section>

        {/* Main Editor Section */}
        <section className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
          <InputPanel 
            value={inputText}
            onChange={setInputText}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
          
          <OutputPanel 
            content={outputPrompt}
            onChange={setOutputPrompt}
          />
        </section>

      </main>

      <HistorySidebar 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadItem={loadHistoryItem}
        onDeleteItem={handleDeleteHistory}
      />
    </div>
  );
}

export default App;

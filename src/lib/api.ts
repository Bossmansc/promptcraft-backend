// Use environment variable if available, otherwise fallback to localhost
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface PromptData {
  id?: number;
  inputText: string;
  selectedStack: string;
  selectedStyle: string;
}

export interface HistoryItem {
  id: number;
  user_input: string;
  generated_prompt: string;
  stack_type: string;
  style_type: string;
  created_at: string;
}

export const generatePrompt = async (data: PromptData) => {
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

export const fetchHistory = async () => {
  const response = await fetch(`${API_BASE}/history`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

export const deleteHistoryItem = async (id: number) => {
  await fetch(`${API_BASE}/history/${id}`, { method: 'DELETE' });
};

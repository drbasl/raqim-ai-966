import { useState, useEffect } from 'react';

export interface SavedPrompt {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  isFavorite: boolean;
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

export function usePromptManager() {
  const [savedPrompts, setSavedPrompts] = useLocalStorage<SavedPrompt[]>('raqim-prompts', []);

  const savePrompt = (prompt: Omit<SavedPrompt, 'id' | 'createdAt'>) => {
    const { nanoid } = require('nanoid');
    const newPrompt: SavedPrompt = {
      ...prompt,
      id: nanoid(),
      createdAt: new Date().toISOString(),
    };
    setSavedPrompts([...savedPrompts, newPrompt]);
    return newPrompt;
  };

  const deletePrompt = (id: string) => {
    setSavedPrompts(savedPrompts.filter(p => p.id !== id));
  };

  const updatePrompt = (id: string, updates: Partial<SavedPrompt>) => {
    setSavedPrompts(savedPrompts.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ));
  };

  const toggleFavorite = (id: string) => {
    updatePrompt(id, { 
      isFavorite: !savedPrompts.find(p => p.id === id)?.isFavorite 
    });
  };

  const exportPrompts = () => {
    const dataStr = JSON.stringify(savedPrompts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `raqim-prompts-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importPrompts = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setSavedPrompts([...savedPrompts, ...imported]);
          resolve(imported.length);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    });
  };

  return {
    savedPrompts,
    savePrompt,
    deletePrompt,
    updatePrompt,
    toggleFavorite,
    exportPrompts,
    importPrompts,
  };
}

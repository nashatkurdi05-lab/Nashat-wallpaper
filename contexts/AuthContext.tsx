import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

// --- Interfaces ---
export interface User {
  username: string;
}

export interface HistoryItem {
  prompt: string;
  negativePrompt: string;
}

interface AuthContextType {
  currentUser: User | null;
  history: HistoryItem[];
  login: (username: string) => void;
  logout: () => void;
  addHistoryItem: (item: HistoryItem) => void;
}

// --- Local Storage Keys ---
const SESSION_KEY = 'ai_wallpaper_session_user';
const HISTORY_KEY_PREFIX = 'ai_wallpaper_history_';

// --- Context Definition ---
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  history: [],
  login: () => {},
  logout: () => {},
  addHistoryItem: () => {},
});

// --- Provider Component ---
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Check for an active session on initial load
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem(SESSION_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error("Failed to parse user from session storage:", error);
      sessionStorage.removeItem(SESSION_KEY);
    }
  }, []);

  // Load user's history when they log in or change
  useEffect(() => {
    if (currentUser) {
      try {
        const historyKey = `${HISTORY_KEY_PREFIX}${currentUser.username}`;
        const storedHistory = localStorage.getItem(historyKey);
        setHistory(storedHistory ? JSON.parse(storedHistory) : []);
      } catch (error) {
        console.error("Failed to load or parse user history:", error);
        setHistory([]);
      }
    } else {
      // Clear history when user logs out
      setHistory([]);
    }
  }, [currentUser]);

  const login = useCallback((username: string) => {
    const user = { username };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  }, []);

  const addHistoryItem = useCallback((item: HistoryItem) => {
    if (!currentUser) return;

    // Avoid duplicates
    const isDuplicate = history.some(h => h.prompt === item.prompt && h.negativePrompt === item.negativePrompt);
    if (isDuplicate) return;

    const updatedHistory = [item, ...history];
    setHistory(updatedHistory);
    
    try {
      const historyKey = `${HISTORY_KEY_PREFIX}${currentUser.username}`;
      localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Failed to save history to local storage:", error);
    }
  }, [currentUser, history]);
  
  const value = { currentUser, history, login, logout, addHistoryItem };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

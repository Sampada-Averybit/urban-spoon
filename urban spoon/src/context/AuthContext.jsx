import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for token and user on app load
    const storedToken = localStorage.getItem('urbanSpoonToken');
    const storedUser = localStorage.getItem('urbanSpoonUser');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        console.error('Failed to parse user data from localStorage');
        localStorage.removeItem('urbanSpoonToken');
        localStorage.removeItem('urbanSpoonUser');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('urbanSpoonToken', newToken);
    localStorage.setItem('urbanSpoonUser', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('urbanSpoonToken');
    localStorage.removeItem('urbanSpoonUser');
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication on mount
    const storedUser = localStorage.getItem('citylife_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('citylife_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Admin login (hardcoded for now - in production, this would be API-based)
      if (email === 'citylife32@outlook.com' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin-1',
          email: 'citylife32@outlook.com',
          name: 'Matthew Kenner',
          role: 'admin'
        };
        setUser(adminUser);
        localStorage.setItem('citylife_user', JSON.stringify(adminUser));
        setIsLoading(false);
        return true;
      }
      
      // Demo client login
      if (email === 'client@demo.com' && password === 'client123') {
        const clientUser: User = {
          id: 'client-1',
          email: 'client@demo.com',
          name: 'Demo Client',
          role: 'client'
        };
        setUser(clientUser);
        localStorage.setItem('citylife_user', JSON.stringify(clientUser));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('citylife_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
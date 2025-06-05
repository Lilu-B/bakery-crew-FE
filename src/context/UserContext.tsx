import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';   // используем наш кастомный экземпляр с интерсептором
import camelcaseKeys from 'camelcase-keys';
import { AxiosError } from 'axios';
interface UserProviderProps { // Типизация пропсов для провайдера
  children: React.ReactNode;
}

// Тип пользователя
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'manager' | 'developer';
  isApproved: boolean;
  shift?: '1st' | '2nd' | 'night';
  phone?: string;
  managerId?: number;
}

// Тип для самого контекста
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  loading: boolean; 
}

// Создание контекста с undefined по умолчанию
const UserContext = createContext<UserContextType | undefined>(undefined);

// Провайдер пользователя
export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('token');
  };

  // Попытка автоавторизации (напр. при обновлении страницы)  + отлов ошибок через AxiosError
  useEffect(() => {
    let isMounted = true; // защита от обновления размонтированного компонента
    const token = sessionStorage.getItem('token');

    if (token && !user) {
      api.get('/protected')
        .then((res) => {
            if (isMounted) {
                const normalizedUser = camelcaseKeys(res.data, { deep: true });
                setUser(normalizedUser as User);
            }
        })
        .catch((err: AxiosError<{ message?: string }>) => {
          const message = err.response?.data?.message || 'Session expired. Please log in again.';
          console.error('❌ Auth error:', message);
          alert(message);
          logout();
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
        } else {
        setLoading(false);
        }

        return () => {
        isMounted = false;
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, logout, loading }}>
        {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used inside UserProvider');
  return context;
};
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const { user, loading } = useUser();     // хук для доступа к контексту пользователя
  // проверяем, загружается ли информация о пользователе
  // и если да, то показываем индикатор загрузки
  // если пользователь не авторизован, не одобрен - перенаправляем на страницу логина
  // если пользователь авторизован и одобрен, отображаем защищённый контент
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
    if (!user.isApproved) {
        return <Navigate to="/login" replace />;
    }                                                                                       
  return <>{children}</>; // оборачиваем в React Fragment
};

export default ProtectedRoute;
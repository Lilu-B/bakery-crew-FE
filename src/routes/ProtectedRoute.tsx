import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const { user, loading } = useUser();   

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
    if (!user.isApproved) {
        return <Navigate to="/login" replace />;
    }                                                                                       
  return <>{children}</>; 
};

export default ProtectedRoute;
import { UserService } from '@/services/userServices';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const user = UserService.useAuth();

  try {
    localStorage.setItem('notify', 'true');
  } catch (error) {
    console.warn('LocalStorage is disabled, notify feature is not available.');
  }

  return user ? children : <Navigate to="/sign-in" />;
};

export default PrivateRoute;

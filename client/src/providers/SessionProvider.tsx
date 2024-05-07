import React, { createContext, useContext, useEffect } from 'react';
import { UserService } from '@/services/userServices';
import { useNavigate } from 'react-router-dom';

const SessionContext = createContext<{
  user: UserWithSubscritions | null | undefined;
  refetch: () => void;
}>({ user: null, refetch: () => {} });

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const { user, refetch } = UserService.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== undefined && !user) {
      // navigate("/sign-in");
    }
  }, [user, navigate]);

  return (
    <SessionContext.Provider value={{ user, refetch }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): {
  user: UserWithSubscritions | null | undefined;
  refetch: () => void;
} => useContext(SessionContext);

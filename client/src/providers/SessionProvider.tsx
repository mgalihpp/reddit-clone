import React, { createContext, useContext, useEffect } from "react";
import { UserService } from "@/services/userServices";
import { useNavigate } from "react-router-dom";

const SessionContext = createContext<User | null | undefined>(null);

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const user = UserService.useSession();
  const navigate = useNavigate();

  console.log(user)

  useEffect(() => {
    if (user !== undefined && !user) {
      navigate("/sign-in");
    }
  }, [user, navigate]);

  return (
    <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
  );
};

export const useSession = (): User | null | undefined =>
  useContext(SessionContext);

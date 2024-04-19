import { UserService } from "@/services/userServices";
import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const user = UserService.useAuth();

  return user ? children : <Navigate to="/sign-in" />;
};

export default PrivateRoute;

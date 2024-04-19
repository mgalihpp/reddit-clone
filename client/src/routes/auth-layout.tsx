import { UserService } from "@/services/userServices";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function AuthLayout() {
  const user = UserService.useAuth();
  const navigate = useNavigate();

  // Redirect to home page if user is authenticated
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center mx-auto">
      <Outlet />
    </div>
  );
}

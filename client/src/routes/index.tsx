import App from "@/App";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import RootLayout from "./root-layout";
import AuthLayout from "./auth-layout";
import SignUp from "@/components/auth/sign-up";
import SignIn from "@/components/auth/sign-in";
import PrivateRoute from "./private-route";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* PROTECTED ROUTES */}
      {/* Home Page */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <RootLayout />
          </PrivateRoute>
        }
      >
        <Route path="/home" element={<App />} />
      </Route>
      {/* PROTECTED ROUTES */}

      {/* PUBLIC ROUTES */}
      {/* Authentication Page */}
      <Route element={<AuthLayout />}>
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Route>
      {/* PUBLIC ROUTES */}
    </>
  )
);

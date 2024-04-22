/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import RootLayout from './root-layout';
import AuthLayout from './auth-layout';
import SignUp from '@/components/auth/sign-up';
import SignIn from '@/components/auth/sign-in';
import PrivateRoute from './private-route';
import { SessionProvider } from '@/providers/SessionProvider';
import NotFound from '@/not-found';

const App = React.lazy(() => import('@/App'));
const CreateCommunityPage = React.lazy(() => import('@/pages/r/create/create-community'),);
const CommunitySlugPage = React.lazy(() => import('@/pages/r/community-slug'));

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* PROTECTED ROUTES */}
      {/* Home Page */}
      <Route
        path="/"
        element={
          <SessionProvider>
            <PrivateRoute>
              <RootLayout />
            </PrivateRoute>
          </SessionProvider>
        }
      >
        <Route path="/" element={<App />} />
        <Route path="/home" element={<App />} />
        <Route path="/r/create" element={<CreateCommunityPage />} />
        <Route path="/r/:slug" element={<CommunitySlugPage />} />
      </Route>
      {/* PROTECTED ROUTES */}

      {/* PUBLIC ROUTES */}
      {/* Authentication Page */}
      <Route element={<AuthLayout />}>
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Route>

      <Route path="*" element={<NotFound />} />
      {/* PUBLIC ROUTES */}
    </>,
  ),
);

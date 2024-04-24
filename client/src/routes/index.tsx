/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import RootLayout from '@/layout/root-layout';
import AuthLayout from '@/layout/auth-layout';
import SignUp from '@/components/auth/sign-up';
import SignIn from '@/components/auth/sign-in';
import { SessionProvider } from '@/providers/SessionProvider';
import NotFound from '@/not-found';
import CreatePost from '@/pages/r/submit/create-post';

const App = React.lazy(() => import('@/App'));
const PrivateRoute = React.lazy(() => import('@/routes/private-route'));
const CreateCommunityPage = React.lazy(
  () => import('@/pages/r/create/create-community'),
);
const CommunitySlugPage = React.lazy(() => import('@/pages/r/community-slug'));
const SinglePost = React.lazy(() => import('@/pages/r/post/single-post'));

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
        <Route path="/r/:slug/submit" element={<CreatePost />} />
        <Route path="/r/:slug/post/:id" element={<SinglePost />} />
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

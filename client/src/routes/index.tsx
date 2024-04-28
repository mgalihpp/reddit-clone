/* eslint-disable react-refresh/only-export-components */
import React, { Suspense } from 'react';
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
import Loader from '@/components/loader';

const App = React.lazy(() => import('@/App'));
const PrivateRoute = React.lazy(() => import('@/routes/private-route'));
const CreateCommunityPage = React.lazy(
  () => import('@/pages/r/create/create-community'),
);
const CommunitySlugPage = React.lazy(() => import('@/pages/r/community-slug'));
const SinglePost = React.lazy(() => import('@/pages/r/post/single-post'));
const UserSettings = React.lazy(() => import('@/pages/settings/user-settings'));

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* PROTECTED ROUTES */}
      {/* Home Page */}
      <Route
        path="/"
        element={
          <Suspense fallback={<Loader container />}>
            <SessionProvider>
              <PrivateRoute>
                <RootLayout />
              </PrivateRoute>
            </SessionProvider>
          </Suspense>
        }
      >
        <Route
          path="/"
          element={
            <Suspense fallback={<Loader container2 />}>
              <App />
            </Suspense>
          }
        />
        <Route
          path="/home"
          element={
            <Suspense fallback={<Loader container2 />}>
              <App />
            </Suspense>
          }
        />
        <Route
          path="/settings"
          element={
            <Suspense fallback={<Loader container2 />}>
              <UserSettings />
            </Suspense>
          }
        />
        <Route
          path="/r/create"
          element={
            <Suspense fallback={<Loader container2 />}>
              <CreateCommunityPage />
            </Suspense>
          }
        />
        <Route
          path="/r/:slug"
          element={
            <Suspense fallback={<Loader container2 />}>
              <CommunitySlugPage />
            </Suspense>
          }
        />
        <Route
          path="/r/:slug/submit"
          element={
            <Suspense fallback={<Loader container2 />}>
              <CreatePost />
            </Suspense>
          }
        />
        <Route
          path="/r/:slug/post/:id"
          element={
            <Suspense fallback={<Loader container2 />}>
              <SinglePost />
            </Suspense>
          }
        />
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

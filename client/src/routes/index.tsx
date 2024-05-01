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
const UserPage = React.lazy(() => import('@/pages/user/user-page'));
const UserOverView = React.lazy(() => import('@/pages/user/user-overview'));
const UserPosts = React.lazy(() => import('@/pages/user/user-posts'));
const UserComments = React.lazy(() => import('@/pages/user/user-comments'));

const privateRoutesPath = [
  { path: '/settings', element: UserSettings },
  { path: '/r/create', element: CreateCommunityPage },
  { path: '/r/:slug', element: CommunitySlugPage },
  { path: '/r/:slug/post/:id', element: SinglePost },
  { path: '/r/:slug/submit', element: CreatePost },
  // { path: '/user/:username', element: UserPage },
];

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Home Page */}
      <Route
        path="/"
        element={
          <Suspense fallback={<Loader container />}>
            <SessionProvider>
              <RootLayout />
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

        {/* USER ROUTES */}
        <Route
          path="/user/:username/*"
          element={
            <Suspense fallback={<Loader container2 />}>
              <UserPage />
            </Suspense>
          }
        >
          <Route
            path=""
            element={
              <Suspense fallback={<Loader />}>
                <UserOverView />
              </Suspense>
            }
          />
          <Route
            path="posts"
            element={
              <Suspense fallback={<Loader />}>
                <UserPosts />
              </Suspense>
            }
          />
          <Route
            path="comments"
            element={
              <Suspense fallback={<Loader />}>
                <UserComments />
              </Suspense>
            }
          />
        </Route>

        {/* PRIVATE ROUTES */}
        {privateRoutesPath.map(({ path, element: Component }, index) => (
          <Route
            key={index}
            path={path}
            element={
              <Suspense fallback={<Loader container2 />}>
                <PrivateRoute>
                  <Component />
                </PrivateRoute>
              </Suspense>
            }
          />
        ))}
      </Route>

      {/* Authentication Page */}
      <Route element={<AuthLayout />}>
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </>,
  ),
);

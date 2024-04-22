import React, { Suspense } from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import store, { persistor } from "@/store";
import { router } from "@/routes";
import QueryProvider from "@/providers/QueryClientProvider";
import Loader from "@/components/loader";

import("react-toastify/dist/ReactToastify.css");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Suspense fallback={<Loader container />}>
          <RouterProvider router={router} />
          </Suspense>
        </PersistGate>
      </Provider>
    </QueryProvider>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />
  </React.StrictMode>
);

import axios from "axios";

export const apiInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "https://reddit-clone-server-umber.vercel.app"
      : "https://reddit-clone-server-umber.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

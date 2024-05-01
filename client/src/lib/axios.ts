import axios from "axios";

export const apiInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? import.meta.env.VITE_SERVER_URL
      : import.meta.env.VITE_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

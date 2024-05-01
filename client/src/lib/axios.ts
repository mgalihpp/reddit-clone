import axios from 'axios';

export const apiInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? import.meta.env.VITE_SERVER_URL
      : 'https://reddit-clone-server-umber.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

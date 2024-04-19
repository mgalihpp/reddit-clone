import axios from "axios";
import Token from "@/utils/token";

export const apiInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development" ? "http://localhost:5000" : "",
  headers: {
    "Content-Type": "application/json",
  },
});

export const authenticateInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development" ? "http://localhost:5000" : "",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Token.getAuthToken()}`,
  },
});

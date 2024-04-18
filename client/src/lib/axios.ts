import axios from "axios";

const apiInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development" ? "http://localhost:5000" : "",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiInstance;

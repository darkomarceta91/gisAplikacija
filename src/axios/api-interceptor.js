import axios from "axios";

export const api = axios.create({
  baseURL: "",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt")
    ? localStorage.getItem("jwt")
    : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {  
    return Promise.reject(error);
  }
);

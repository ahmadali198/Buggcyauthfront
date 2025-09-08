// src/utils/auth.js
import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// 🚀 Automatically attach token from cookies
API.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Auth utilities
export const auth = {
  // check if logged in
  isAuthenticated: () => !!Cookies.get("token"),

  // get current user from cookie
  getUser: () => {
    const user = Cookies.get("user");
    return user ? JSON.parse(user) : null;
  },

  // logout user
  logout: () => {
    Cookies.remove("token");
    Cookies.remove("user");
    window.location.href = "/login";
  },
};

export default API;

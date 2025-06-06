import axios from 'axios';

const baseURL =
  (import.meta.env.MODE === "production" ? 
    "https://mern-stack-chat-app-fggj.onrender.com/api" : "http://localhost:5001");

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
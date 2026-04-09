import axios from 'axios';

// In production, use the deployed backend URL
// In development, vite proxy handles /api → localhost:5000
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

export default instance;

// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dcasa.onrender.com/api',  // Dirección de tu API en Render
});

export default api;

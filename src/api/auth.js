import axios from 'axios';

console.log('VITE_API_URL =', import.meta.env.VITE_API_URL);
console.log('VITE_AUTH_URL =', import.meta.env.VITE_AUTH_URL);

const auth = axios.create({
   baseURL: import.meta.env.VITE_AUTH_URL,
});

export default auth;

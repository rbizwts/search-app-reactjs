import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://wtshub.com:3001',
  baseURL: 'https://wts.wtshub.com:3001',
  // baseURL: 'https://localhost:3001',
  /* other custom settings */
});

export default axiosInstance

const axios = require('axios');
const queryString = require('query-string');

const axiosClient = axios.create({
  baseURL: process.env.API_DOTNET_URL || 'https://localhost:5001',
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: (param) => queryString.stringify(param),
});

axiosClient.interceptors.request.use(
  (config) => {
    // Setup token - Do something before req is sent
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    // if (response && response.data) return response.data;
    return response;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);
module.exports = axiosClient;

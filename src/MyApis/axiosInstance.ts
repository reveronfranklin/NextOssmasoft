import axios from 'axios';

const axiosClient = axios.create();

// Replace this with our own backend base URL
axiosClient.defaults.baseURL = 'https://api.example.org/';

/*type headers = {
  'Content-Type': string;
  Accept: string;
  Authorization: string;
};*/

/*axiosClient.headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
} as headers ;*/

// Adding Authorization header for all requests

axiosClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access-token');

    if (token) {
      // Configure this as per your backend requirements
      config.headers!['Authorization'] = token;
    }

    return config;

  },
  error => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  res => {
    return res;
  },
  async err => {
    const originalConfig = err.config;

    if (originalConfig.url !== '/user/login' && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const rs = await axios.post(
            'https://api.example.org/user/refresh',
            {
              headers: {
                Authorization: localStorage.getItem('refresh-token')!
              }
            }
          );

          const access = rs.data.data['X-Auth-Token'];
          const refresh = rs.data.data['X-Refresh-Token'];

          localStorage.setItem('access-token', access);
          localStorage.setItem('refresh-token', refresh);

          return axiosClient(originalConfig);
        } catch (_error) {


          // Logging out the user by removing all the tokens from local

          localStorage.removeItem('access-token');
          localStorage.removeItem('refresh-token');

          // Redirecting the user to the landing page
          window.location.href = window.location.origin;

          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default axiosClient;

import axios from 'axios'
import authConfig from 'src/configs/auth'

const urlProduction     = process.env.NEXT_PUBLIC_BASE_URL_API_N8N_PRODUCTION
const urlDevelopment    = process.env.NEXT_PUBLIC_BASE_URL_API_N8N
const tokenApiN8N       = process.env.NEXT_PUBLIC_TOKEN_API_N8N

export const ossmmasofApiN8N = axios.create({
  baseURL: !authConfig.isProduction ? urlDevelopment : urlProduction
})

ossmmasofApiN8N.interceptors.request.use(
  config => {
    if (tokenApiN8N) {
      config.headers!['Authorization'] = 'Bearer ' + tokenApiN8N
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

ossmmasofApiN8N.interceptors.request.use(
  config => {
    if (tokenApiN8N) {
      config.headers!['Authorization'] = 'Bearer ' + tokenApiN8N
    }

    if (!authConfig.isProduction) {
      if (config.headers) {
        config.headers['X-Dev-Mode'] = 'true'
      }
    }

    const formulacionRoutes = [
      '/invoices/load',
    ]

    const isFormulacion = formulacionRoutes.some(route => config.url?.includes(route))
    const useGateway = true;

    if (useGateway && isFormulacion) {
      const originalUrl = (config.baseURL ?? '') + (config.url ?? '')
      const originalMethod = config.method?.toUpperCase() || 'POST'

      const formData = new FormData();
      formData.append('method', originalMethod);
      formData.append('url', originalUrl);
      formData.append('timeoutSeconds', '30');

      if (config.data instanceof FormData) {
        for (const [key, value] of config.data.entries()) {
          formData.append(key, value);
        }
      } else {
        formData.append('body', JSON.stringify(config.data));
      }

      config.baseURL = 'https://ossmmasoft.com.ve:5001/api/gateway/execute'
      config.url = ''
      config.method = 'post'
      config.data = formData

      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${tokenApiN8N}`,
        'X-Custom-Header': 'custom-value'
      };
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)


ossmmasofApiN8N.interceptors.response.use(
  res => {
    const isGateway = res.config.baseURL === 'https://ossmmasoft.com.ve:5001/api/gateway/execute';

    if (isGateway && res.data && res.data.content !== undefined) {
      const response = res.data.content;

      return {...res, data: response };
    }

    return res;
  },
  async err => {
    const originalConfig = err.config

    if (originalConfig && originalConfig.url !== '/login' && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true

        try {
          const rs = await axios.post(authConfig.refreshEndPoint, {
            headers: {
              Authorization: 'Bearer' + localStorage.getItem(authConfig.storageTokenKeyName)!
            }
          })

          console.log(
            'desde el interceptor de la repuesta para evaluar el token de las cookies rs.data.data',
            rs.data.data
          )

          return ossmmasofApiN8N(originalConfig)
        } catch (_error) {
          console.log('Session time out. Please login again.', { id: 'sessionTimeOut' })

          /*toast.error('Session time out. Please login again.', {
                        id: 'sessionTimeOut'
                    });*/
          // Logging out the user by removing all the tokens from local

          localStorage.removeItem(authConfig.storageTokenKeyName)
          localStorage.removeItem(authConfig.onTokenExpiration)

          // Redirecting the user to the landing page
          window.location.href = window.location.origin

          return Promise.reject(_error)
        }
      }
    }

    return Promise.reject(err)
  }
)

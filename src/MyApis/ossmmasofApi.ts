import axios from 'axios'
import authConfig from 'src/configs/auth'

const urlProduction = process.env.NEXT_PUBLIC_BASE_URL_API_NET_PRODUCTION
const urlDevelopment = process.env.NEXT_PUBLIC_BASE_URL_API_NET

export const ossmmasofApi = axios.create({
  baseURL: !authConfig.isProduction ? urlDevelopment : urlProduction
})

ossmmasofApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem(authConfig.storageTokenKeyName)

    if (token) {
      // Configure this as per your backend requirements
      config.headers!['Authorization'] = 'Bearer ' + token
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

ossmmasofApi.interceptors.response.use(
  res => {
    return res
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

          return ossmmasofApi(originalConfig)
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

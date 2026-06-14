import axios from 'axios'
import authConfig from 'src/configs/auth'

const urlProduction = process.env.NEXT_PUBLIC_BASE_URL_API_NET_VERTICAL_PRODUCTION
const urlDevelopment = process.env.NEXT_PUBLIC_BASE_URL_API_NET_VERTICAL

export const ossmmasofApiVertical = axios.create({
  baseURL: !authConfig.isProduction ? urlDevelopment : urlProduction
})

const getAuthResponseValue = (data: any, camelCaseKey: string, pascalCaseKey: string) => {
  return data?.[camelCaseKey] ?? data?.[pascalCaseKey] ?? ''
}

const getStoredRefreshToken = () => {
  const directToken =
    localStorage.getItem(authConfig.onTokenExpiration) ||
    localStorage.getItem('refreshToken') ||
    localStorage.getItem('RefreshToken')

  if (directToken) {
    return directToken
  }

  try {
    const userData = localStorage.getItem('userData')
    const parsedUserData = userData ? JSON.parse(userData) : null

    return parsedUserData?.refreshToken || parsedUserData?.RefreshToken || ''
  } catch {
    return ''
  }
}

ossmmasofApiVertical.interceptors.request.use(
  config => {
    const token = localStorage.getItem(authConfig.storageTokenKeyName)

    if (token) {
      // Configure this as per your backend requirements
      config.headers!['Authorization'] = 'Bearer ' + token
    }

    const refreshToken = getStoredRefreshToken()

    if (refreshToken) {
      config.headers!['X-Refresh-Token'] = refreshToken
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

ossmmasofApiVertical.interceptors.response.use(
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
          const currentAccessToken = localStorage.getItem(authConfig.storageTokenKeyName) || ''
          const currentRefreshToken = getStoredRefreshToken()

          const rs = await axios.post(
            authConfig.refreshEndPoint,
            {
              accessToken: currentAccessToken,
              refreshToken: currentRefreshToken
            },
            {
              headers: {
                Authorization: 'Bearer ' + currentAccessToken
              }
            }
          )

          const accessToken = getAuthResponseValue(rs.data, 'accessToken', 'AccessToken')
          const refreshToken = getAuthResponseValue(rs.data, 'refreshToken', 'RefreshToken')

          if (!accessToken || !refreshToken) {
            throw new Error('Invalid refresh token response.')
          }

          localStorage.setItem(authConfig.storageTokenKeyName, accessToken)
          localStorage.setItem(authConfig.onTokenExpiration, refreshToken)

          console.log(
            'desde el interceptor de la repuesta para evaluar el token de las cookies rs.data.data',
            rs.data.data
          )

          originalConfig.headers = {
            ...originalConfig.headers,
            Authorization: 'Bearer ' + accessToken,
            'X-Refresh-Token': refreshToken
          }

          return ossmmasofApiVertical(originalConfig)
        } catch (_error) {
          console.log('Session time out. Please login again.', { id: 'sessionTimeOut' })

          /*toast.error('Session time out. Please login again.', {
						id: 'sessionTimeOut'
					});*/
          // Logging out the user by removing all the tokens from local

          localStorage.removeItem(authConfig.storageTokenKeyName)
          localStorage.removeItem(authConfig.onTokenExpiration)
          localStorage.removeItem('userData')

          // Redirecting the user to login
          window.location.href = `${window.location.origin}/login/`

          return Promise.reject(_error)
        }
      }
    }

    return Promise.reject(err)
  }
)

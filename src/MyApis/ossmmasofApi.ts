import axios from 'axios'
import authConfig from 'src/configs/auth'

const urlProduction = process.env.NEXT_PUBLIC_BASE_URL_API_NET_PRODUCTION
const urlDevelopment = process.env.NEXT_PUBLIC_BASE_URL_API_NET

export const ossmmasofApi = axios.create({
  baseURL: !authConfig.isProduction ? urlDevelopment : urlProduction
})

const getAuthResponseValue = (data: any, camelCaseKey: string, pascalCaseKey: string) => {
  return data?.[camelCaseKey] ?? data?.[pascalCaseKey] ?? ''
}

let refreshTokenRequest: Promise<{ accessToken: string; refreshToken: string }> | null = null

const refreshAuthToken = async () => {
  if (!refreshTokenRequest) {
    refreshTokenRequest = (async () => {
      const currentAccessToken = localStorage.getItem(authConfig.storageTokenKeyName) || ''
      const currentRefreshToken = localStorage.getItem(authConfig.onTokenExpiration) || ''

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

      return { accessToken, refreshToken }
    })().finally(() => {
      refreshTokenRequest = null
    })
  }

  return refreshTokenRequest
}

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
          const { accessToken, refreshToken } = await refreshAuthToken()

          originalConfig.headers = {
            ...originalConfig.headers,
            Authorization: 'Bearer ' + accessToken,
            'X-Refresh-Token': refreshToken
          }

          return ossmmasofApi(originalConfig)
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

// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const getStoredUserData = (): UserDataType | null => {
  try {
    const userData = window.localStorage.getItem('userData')

    return userData ? JSON.parse(userData) : null
  } catch {
    return null
  }
}

const getAuthResponseValue = (data: any, camelCaseKey: string, pascalCaseKey: string) => {
  return data?.[camelCaseKey] ?? data?.[pascalCaseKey] ?? ''
}

const getAuthUserData = (data: any) => {
  return data?.userData ?? data?.UserData ?? null
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      const refreshToken = window.localStorage.getItem(authConfig.onTokenExpiration)!
      const storedUserData = getStoredUserData()

      if (storedUserData && (!storedToken || !refreshToken)) {
        window.localStorage.removeItem('userData')
      }

      if (storedUserData && storedToken && refreshToken) {
        setUser(storedUserData)
        setLoading(false)

        return
      }

      setUser(null)
      setLoading(false)
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {

    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        const accessToken = getAuthResponseValue(response.data, 'accessToken', 'AccessToken')
        const refreshToken = getAuthResponseValue(response.data, 'refreshToken', 'RefreshToken')
        const userData = getAuthUserData(response.data)

        if (!accessToken || !refreshToken || !userData) {
          throw new Error('Respuesta de autenticacion invalida.')
        }

        window.localStorage.setItem(authConfig.storageTokenKeyName, accessToken)
        window.localStorage.setItem(authConfig.onTokenExpiration, refreshToken)
        const returnUrl = router.query.returnUrl


        setUser({ ...userData })
        window.localStorage.setItem('userData', JSON.stringify(userData))


        //if(response.data.accessToken.length<= 0) handleLogout();
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL as string)
      })

      .catch(err => {

        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem(authConfig.onTokenExpiration)
    router.push('/login')
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.registerEndpoint, params,)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ email: params.email, password: params.password })
        }
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }

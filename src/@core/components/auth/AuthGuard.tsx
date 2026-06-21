// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(
    () => {
      if (!router.isReady) {
        return
      }

      if (auth.user === null) {
        const userData = window.localStorage.getItem('userData')
        const hasAccessToken = window.localStorage.getItem('accessToken')
        const hasRefreshToken = window.localStorage.getItem('refreshToken')

        if (userData && (!hasAccessToken || !hasRefreshToken)) {
          window.localStorage.removeItem('userData')
        }

        if (userData && hasAccessToken && hasRefreshToken) {
          try {
            auth.setUser(JSON.parse(userData))

            return
          } catch {
            window.localStorage.removeItem('userData')
          }
        }
      }

      if (auth.user === null && !window.localStorage.getItem('userData')) {
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace('/login')
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route, auth.user]
  )

  if (auth.loading) {
    return fallback
  }

  if (auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard

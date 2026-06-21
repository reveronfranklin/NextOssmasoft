// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'

/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = (role: string) => {
  if (role === 'client') return '/acl'
  else return '/dashboards/ecommerce'
}

const Home = () => {
  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady || auth.loading) {
      return
    }

    if (auth.user?.role) {
      router.replace(getHomeRoute(auth.user.role))

      return
    }

    router.replace('/login')
  }, [auth.loading, auth.user, router])

  return <Spinner sx={{ height: '100%' }} />
}

export default Home

import { useContext, useMemo } from 'react'
import { AuthContext } from 'src/context/AuthContext'

const readStoredUserId = () => {
  if (typeof window === 'undefined') {
    return 0
  }

  try {
    const userData = window.localStorage.getItem('userData')
    const parsedUserData = userData ? JSON.parse(userData) : null
    const id = Number(parsedUserData?.id ?? parsedUserData?.codigoUsuario ?? 0)

    return Number.isFinite(id) ? id : 0
  } catch {
    return 0
  }
}

export const useSupportCurrentUserId = () => {
  const auth = useContext(AuthContext)

  return useMemo(() => {
    const authUserId = Number(auth.user?.id ?? 0)

    if (Number.isFinite(authUserId) && authUserId > 0) {
      return authUserId
    }

    return readStoredUserId()
  }, [auth.user?.id])
}

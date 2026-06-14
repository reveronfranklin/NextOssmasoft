// ** React Imports
import { useEffect, useState } from 'react'

// ** Axios Import
//import axios from 'axios'

// ** Type Import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import authConfig from 'src/configs/auth'
import navigation from 'src/navigation/vertical'

const supportMenu = {
  title: 'Soporte',
  children: [
    {
      title: 'Tickets',
      path: '/apps/soporte/tickets'
    },
    {
      title: 'Dashboard',
      path: '/apps/soporte/dashboard'
    },
    {
      title: 'Notificaciones',
      path: '/apps/soporte/notificaciones'
    },
    {
      title: 'Configuracion',
      path: '/apps/soporte/configuracion'
    }
  ]
}

const securityMenu = {
  title: 'Seguridad',
  path: '/apps/sis/seguridad'
}

const sisUsersMenu = {
  title: 'Usuarios',
  path: '/apps/sis/usuarios'
}

const userRolesMenu = {
  title: 'Roles Usuario',
  path: '/apps/sis/usuario-rol'
}

const cloneMenu = (items: any[]) => JSON.parse(JSON.stringify(items))

const getStoredUserData = () => {
  try {
    const userData = localStorage.getItem('userData')

    return userData ? JSON.parse(userData) : null
  } catch {
    return null
  }
}

const isAdminUser = () => {
  const userData = getStoredUserData()
  const role = String(userData?.role || '').toLowerCase()
  const roles = Array.isArray(userData?.roles) ? userData.roles : []
  const isSuperuser = userData?.isSuperuser === true || userData?.IsSuperuser === true || Number(userData?.IS_SUPERUSER ?? 0) === 1

  return isSuperuser || role === 'admin' || roles.some((item: any) => String(item?.role || item).toLowerCase() === 'admin')
}

const ensureAdminMenus = (items: any[]) => {
  if (!isAdminUser()) {
    return items
  }

  const hasSecurity = JSON.stringify(items).includes('/apps/sis/seguridad')
  const hasSupport = JSON.stringify(items).includes('/apps/soporte')
  const hasSisUsers = JSON.stringify(items).includes('/apps/sis/usuarios')
  const hasUserRoles = JSON.stringify(items).includes('/apps/sis/usuario-rol')
  let sistema = items.find(item => item?.title === 'Sistema')

  if (!sistema) {
    sistema = {
      title: 'Sistema',
      icon: 'mdi:shield-account-outline',
      children: []
    }
    items.push(sistema)
  }

  if (!Array.isArray(sistema.children)) {
    sistema.children = []
  }

  if (!hasUserRoles) {
    sistema.children.push(userRolesMenu)
  }

  if (!hasSisUsers) {
    sistema.children.push(sisUsersMenu)
  }

  if (!hasSecurity) {
    sistema.children.push(securityMenu)
  }

  if (!hasSupport) {
    sistema.children.push(supportMenu)
  }

  return items
}

const ensureSecurityMenu = (items: any[]) => {
  const adminItems = ensureAdminMenus(items)
  const hasSecurity = JSON.stringify(items).includes('/apps/sis/seguridad')

  if (hasSecurity) {
    return adminItems
  }

  const sistema = adminItems.find(item => item?.title === 'Sistema')
  const soporte = sistema?.children?.find((item: any) => item?.title === 'Soporte')

  if (soporte?.children && Array.isArray(soporte.children)) {
    soporte.children.push(securityMenu)
  }

  return adminItems
}

const ServerSideNavItems = () => {
  // ** State
  const [menuItems, setMenuItems] = useState<VerticalNavItemsType>([])

  useEffect(() => {
    const getStoredUserLogin = () => {
      try {
        const userData = localStorage.getItem('userData')
        const parsedUserData = userData ? JSON.parse(userData) : null

        return parsedUserData?.username || parsedUserData?.login || parsedUserData?.email || ''
      } catch {
        return ''
      }
    }

    const normalizeMenuResponse = (data: any[]) => {
      let menuArray: any[] = []

      data.forEach(function(item: any) {
        try {
          const parsedMenu = typeof item.menu === 'string' ? JSON.parse(item.menu) : item.menu

          if (Array.isArray(parsedMenu)) {
            menuArray = menuArray.concat(parsedMenu)
          }
        } catch (error) {
          console.warn('Menu invalido omitido', item, error)
        }
      })

      return ensureSecurityMenu(menuArray)
    }

    const loadMenu = async () => {
      const login = getStoredUserLogin()
      const refreshToken = localStorage.getItem(authConfig.onTokenExpiration) || ''

      try {
        if (!login || !refreshToken) {
          throw new Error('Usuario o refresh token no disponible.')
        }

        const response = await ossmmasofApi.post<any>(
          '/SisUsuarios/GetMenuByUsuario',
          { login },
          {
            headers: {
              'X-Refresh-Token': refreshToken
            }
          }
        )

        setMenuItems(normalizeMenuResponse(response.data))
      } catch (error) {
        console.warn('No se pudo cargar menu por usuario.', error)
        setMenuItems(ensureSecurityMenu(cloneMenu(navigation())))
      }
    }

    loadMenu()

  }, [])

  return { menuItems }
}

export default ServerSideNavItems

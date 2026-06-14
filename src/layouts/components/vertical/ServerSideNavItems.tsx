// ** React Imports
import { useEffect, useState } from 'react'

// ** Axios Import
//import axios from 'axios'

// ** Type Import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import authConfig from 'src/configs/auth'

const ensureSecurityMenu = (items: any[]) => {
  const hasSecurity = JSON.stringify(items).includes('/apps/sis/seguridad')

  if (hasSecurity) {
    return items
  }

  const sistema = items.find(item => item?.title === 'Sistema')
  const soporte = sistema?.children?.find((item: any) => item?.title === 'Soporte')

  if (soporte?.children && Array.isArray(soporte.children)) {
    soporte.children.push({
      title: 'Seguridad',
      path: '/apps/sis/seguridad',
      permissions: ['soporte.usuarios.configurar']
    })
  }

  return items
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
        console.warn('No se pudo cargar menu por POST, se intenta endpoint GET legado.', error)

        const response = await ossmmasofApi.get<any>('/SisUsuarios/GetMenu')

        setMenuItems(normalizeMenuResponse(response.data))
      }
    }

    loadMenu()

  }, [])

  return { menuItems }
}

export default ServerSideNavItems

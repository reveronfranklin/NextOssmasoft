// ** React Imports
import { useEffect, useState } from 'react'

// ** Axios Import
//import axios from 'axios'

// ** Type Import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import authConfig from 'src/configs/auth'

const normalizeServerMenuItem = (item: any): any => {
  if (!item || typeof item !== 'object') {
    return item
  }

  const { children, ...rest } = item
  delete rest.action
  delete rest.subject

  return {
    ...rest,
    ...(Array.isArray(children) ? { children: children.map(normalizeServerMenuItem) } : {})
  }
}

const normalizeServerMenu = (items: any[]) => items.map(normalizeServerMenuItem)

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

      return normalizeServerMenu(menuArray)
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
        setMenuItems([])
      }
    }

    loadMenu()

  }, [])

  return { menuItems }
}

export default ServerSideNavItems

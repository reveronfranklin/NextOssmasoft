// ** React Imports
import { useEffect, useState } from 'react'

// ** Axios Import
//import axios from 'axios'

// ** Type Import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'

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

    let menuArray: any[]=[]
    ossmmasofApi.get<any>('/SisUsuarios/GetMenu').then(response => {
      console.log('response menu>>>',response.data)
      response.data.forEach(function(item:any) {
        try {
          const parsedMenu = typeof item.menu === 'string' ? JSON.parse(item.menu) : item.menu

          if (Array.isArray(parsedMenu)) {
            menuArray = menuArray.concat(parsedMenu)
          }
        } catch (error) {
          console.warn('Menu invalido omitido', item, error)
        }

      });

      setMenuItems(ensureSecurityMenu(menuArray))
    })

  }, [])

  return { menuItems }
}

export default ServerSideNavItems

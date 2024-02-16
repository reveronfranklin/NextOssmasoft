// ** React Imports
import { useEffect, useState } from 'react'

// ** Axios Import
//import axios from 'axios'

// ** Type Import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'

const ServerSideNavItems = () => {
  // ** State
  const [menuItems, setMenuItems] = useState<VerticalNavItemsType>([])

  useEffect(() => {

    let menuArray: any[]=[]
    ossmmasofApi.get<any>('/SisUsuarios/GetMenu').then(response => {
      console.log('response menu>>>',response.data)
      response.data.forEach(function(item:any) {
        //menuArray = JSON.parse(item.menu)
        menuArray=menuArray.concat(JSON.parse(item.menu));

      });

      setMenuItems(menuArray)
    })

  }, [])

  return { menuItems }
}

export default ServerSideNavItems

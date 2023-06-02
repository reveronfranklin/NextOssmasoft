// ** React Imports
import { useCallback, useEffect, useState } from 'react'

// ** Axios Import
import axios from 'axios'

// ** Type Import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'

const ServerSideNavItems = () => {
  // ** State
  const [menuItems, setMenuItems] = useState<VerticalNavItemsType>([])


  const fetchTableData = useCallback(
    async () => {

      //const filterHistorico:FilterHistorico={desde:new Date('2023-01-01T14:29:29.623Z'),hasta:new Date('2023-04-05T14:29:29.623Z')}

      const responseAll= await ossmmasofApi.get<any>('/SisUsuarios/GetMenu');



      console.log('Respuesta llamando al menu======>',responseAll.data)

      setMenuItems(responseAll.data)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    /*axios.get('/api/vertical-nav/data').then(response => {
      const menuArray = response.data
      console.log(role)
      setMenuItems(menuArray)
    })*/
    //fetchTableData();


    let menuArray: any[]=[]
    ossmmasofApi.get<any>('/SisUsuarios/GetMenu').then(response => {





      response.data.forEach(function(item:any) {
        //menuArray = JSON.parse(item.menu)
        menuArray=menuArray.concat(JSON.parse(item.menu));
        console.log(menuArray);
    });



      setMenuItems(menuArray)
    })

  }, [])

  return { menuItems }
}

export default ServerSideNavItems

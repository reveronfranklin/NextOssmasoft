import { SyntheticEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import CircularProgress from '@mui/material/CircularProgress'
import Icon from 'src/@core/components/icon'

import { InvoiceType } from 'src/types/apps/invoiceTypes'
import ViewDireccion from 'src/adm/proveedor/view/ViewDireccion'


/* import UserViewBilling from './UserViewBilling'
import PersonaViewOverview from './PersonaViewOverview'

import UserViewConnection from './UserViewConnection'
 */

/* import UserViewSecurity from './UserViewSecurity'
import UserViewNotification from './UserViewNotification'
import PersonaViewDirecciones from './PersonaViewDirecciones' */

interface Props {
  tab: string
  invoiceData: InvoiceType[]
}

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 40,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('md')]: {
      minWidth: 130
    }
  }
}))

const ViewRight = ({ tab, invoiceData }: Props) => {
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const router = useRouter()

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/apps/adm/proveedor/view/${value.toLowerCase()}`
      })
      .then(() => setIsLoading(false))
  }

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [tab])

  useEffect(() => {
    if (invoiceData) {
      setIsLoading(false)
    }
  }, [invoiceData])

  return (
    <TabContext value={activeTab}>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
      >
        <Tab
          value='resumen'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:account-outline' />
              Resumen
            </Box>
          }
        />
        <Tab
          value='direccion'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:map-marker-outline' />
              Direcciones
            </Box>
          }
        />
        <Tab
          value='contacto'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:bookmark-outline' />
              Contactos
            </Box>
          }
        />
        <Tab
          value='comunicacion'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:bell-outline' />
              Comunicacion
            </Box>
          }
        />
        <Tab
          value='actividad'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:link' />
              Actividades
            </Box>
          }
        />
      </TabList>
      <Box sx={{ mt: 4 }}>
        {isLoading ? (
          <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <>
            <TabPanel sx={{ p: 0 }} value='resumen'>
             {/*  <PersonaViewOverview /> */}
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='direccion'>
              <ViewDireccion />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='contacto'>
              {/* <UserViewBilling /> */}
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='comunicacion'>
              {/* <UserViewNotification  /> */}
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='actividad'>
              {/* <UserViewConnection /> */}
            </TabPanel>
          </>
        )}
      </Box>
    </TabContext>
  )
}

export default ViewRight

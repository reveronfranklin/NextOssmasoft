// ** React Imports
import { SyntheticEvent, useState, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components Imports
import UserViewBilling from './UserViewBilling'
import PersonaViewOverview from './PersonaViewOverview'

import UserViewConnection from './UserViewConnection'


// ** Types
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import UserViewSecurity from './UserViewSecurity'
import UserViewNotification from './UserViewNotification'

interface Props {
  tab: string
  invoiceData: InvoiceType[]
}

// ** Styled Tab component
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

const PersonaViewRight = ({ tab, invoiceData }: Props) => {
  // ** State
  const [activeTab, setActiveTab] = useState<string>(tab)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // ** Hooks
  const router = useRouter()

  const handleChange = (event: SyntheticEvent, value: string) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/apps/rh/persona/view/${value.toLowerCase()}`

      })
      .then(() => setIsLoading(false))
  }

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          value='security'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:lock-outline' />
              Comunicacion
            </Box>
          }
        />
        <Tab
          value='billing-plan'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:bookmark-outline' />
              Familiares
            </Box>
          }
        />
        <Tab
          value='notification'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:bell-outline' />
              Educacion
            </Box>
          }
        />
        <Tab
          value='connection'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize={20} icon='mdi:link' />
              Variacion
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
              <PersonaViewOverview />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='security'>
              <UserViewSecurity />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='billing-plan'>
              <UserViewBilling />

            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='notification'>
              <UserViewNotification  />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='connection'>
              <UserViewConnection />
            </TabPanel>
          </>
        )}
      </Box>
    </TabContext>
  )
}

export default PersonaViewRight

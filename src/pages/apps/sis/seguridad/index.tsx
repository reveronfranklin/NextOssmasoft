import { SyntheticEvent, useState } from 'react'
import { Card, CardContent, Grid, Tab } from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import SisSeguridadUsuarioView from 'src/sis/seguridad/views/SisSeguridadUsuarioView'
import SisSeguridadRolesView from 'src/sis/seguridad/views/SisSeguridadRolesView'
import SisSeguridadMenuView from 'src/sis/seguridad/views/SisSeguridadMenuView'

const SisSeguridadPage = () => {
  const [tab, setTab] = useState('usuarios')

  const handleTabChange = (_event: SyntheticEvent, value: string) => {
    setTab(value)
  }

  return (
    <TabContext value={tab}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pb: 0 }}>
              <TabList onChange={handleTabChange}>
                <Tab value='usuarios' label='Usuarios' />
                <Tab value='roles' label='Roles' />
                <Tab value='menu' label='Menu' />
              </TabList>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <TabPanel value='usuarios' sx={{ p: 0 }}>
            <Grid container spacing={6}>
              <SisSeguridadUsuarioView />
            </Grid>
          </TabPanel>
          <TabPanel value='roles' sx={{ p: 0 }}>
            <Grid container spacing={6}>
              <SisSeguridadRolesView />
            </Grid>
          </TabPanel>
          <TabPanel value='menu' sx={{ p: 0 }}>
            <Grid container spacing={6}>
              <SisSeguridadMenuView />
            </Grid>
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default SisSeguridadPage

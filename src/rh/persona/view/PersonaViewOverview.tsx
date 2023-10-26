// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'

// ** Types

import { ThemeColor } from 'src/@core/layouts/types'

// ** Demo Component Imports

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { IRhTipoNominaCargosResponseDto } from 'src/interfaces/rh/RhTipoNominaCargosResponseDto'

import AdministrativoList from 'src/rh/administrativos/views/AdministrativoList'


interface ColorsType {
  [key: string]: ThemeColor
}

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>(({ theme }) => ({
  margin: 0,
  padding: 0,
  marginLeft: theme.spacing(0.75),
  '& .MuiTimelineItem-root': {
    '&:before': {
      display: 'none'
    },
    '&:last-child': {
      minHeight: 60
    }
  }
}))
const roleColors: ColorsType = {
  error: 'error',
  info: 'info',
  warning: 'warning',
  success: 'success',
  primary: 'primary',
  secondary: 'secondary'
}
const PersonaViewOverview = () => {
  const [data, setData] = useState<IRhTipoNominaCargosResponseDto[]>([])
  const {personaSeleccionado} = useSelector((state: RootState) => state.nomina)

  useEffect(() => {




    const getData = async () => {
      //dispatch(setTiposNominaSeleccionado(tiposNomina[0]));
      if(personaSeleccionado.codigoPersona>0){
        const filter={codigoPersona:personaSeleccionado.codigoPersona}
        const responseAll= await ossmmasofApi.post<IRhTipoNominaCargosResponseDto[]>('/RhHistoricoPersonalCargo/GetListCargosPorPersona',filter);

        setData(responseAll.data);
      }


    };

     getData();




  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaSeleccionado]);

  return (
    <Grid container spacing={6}>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Historico de Cargos' />
          <CardContent>
            <Timeline>

            {data.map((item,i) =>  {

              return(
               <TimelineItem key={i}>
                <TimelineSeparator>
                  <TimelineDot color={roleColors[item.color]} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Box
                    sx={{
                      mb: 2,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                      {item.descripcionCargo}
                    </Typography>
                    <Typography variant='caption'>{item.tipoNomina}</Typography>
                  </Box>
                  <Typography variant='body2'>Desde:{item.desde} Hasta:{item.hasta}</Typography>
                </TimelineContent>
             </TimelineItem>
              )
              })}

            </Timeline>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>

        <AdministrativoList></AdministrativoList>
      </Grid>


    </Grid>
  )
}

export default PersonaViewOverview

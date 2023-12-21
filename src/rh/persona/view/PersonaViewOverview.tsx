// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'
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
import PersonaHistoricoPagoListTable from './PersonaHistoricoPagoListTable'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DialogRhRelacionCargoInfo from 'src/rh/relacionCargo/views/DialogRhRelacionCargoInfo'
import { ReactDatePickerProps } from 'react-datepicker'
import Icon from 'src/@core/components/icon'

import { CardActions, IconButton, Tooltip } from '@mui/material'
import { IRhRelacionCargoDto } from 'src/interfaces/rh/i-rh-relacion-cargo-dto'
import { monthByIndex } from 'src/utilities/ge-date-by-object'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import { setOperacionCrudRhRelacionCargo, setRhRelacionCargoSeleccionado, setVerRhRelacionCargoActive } from 'src/store/apps/rh-relacion-cargo'
import { useDispatch } from 'react-redux'


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

  const dispatch = useDispatch();
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const [data, setData] = useState<IRhTipoNominaCargosResponseDto[]>([])
  const {personaSeleccionado} = useSelector((state: RootState) => state.nomina)


  const fechaActual = new Date()

  const currentYear  = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentMonthString ='00' + monthByIndex(currentMonth).toString();

  const currentDay =new Date().getDate();
  const currentDayString = '00' + currentDay.toString();
  const defaultDate :IFechaDto = {year:currentYear.toString(),month:currentMonthString.slice(-2),day:currentDayString.slice(-2)}

  const defaultDateString = fechaActual.toISOString();

  const handleAdd=  ()=>{


    // Operacion Crud 1 = Crear titulo


      const defaultValues:IRhRelacionCargoDto = {
        codigoRelacionCargo:0,
        codigoCargo :0,
        denominacionCargo :'',
        codigoPersona :personaSeleccionado.codigoPersona,
        nombre:'',
        apellido :'',
        cedula:0,
        sueldo :0,
        fechaFin:fechaActual,
        fechaIni:fechaActual,
        fechaIniObj:defaultDate,
        fechaFinObj:defaultDate,
        fechaIniString:defaultDateString,
        fechaFinString:defaultDateString,
        codigoRelacionCargoPre :0,
        searchText:'',
        tipoNomina:0,
        codigoIcp:0

      }


      dispatch(setRhRelacionCargoSeleccionado(defaultValues))
      dispatch(setOperacionCrudRhRelacionCargo(3));
      dispatch(setVerRhRelacionCargoActive(true))


  }
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
          <CardActions>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Agregar'>
            <IconButton  color='primary' size='small' onClick={() => handleAdd()}>
            <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip>

        </Box>



        </CardActions>
          {personaSeleccionado.codigoPersona>0 ?
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
              : <div></div>
          }


        </Card>
      </Grid>

      <Grid item xs={12}>
      {personaSeleccionado.codigoPersona>0 ?
        <AdministrativoList></AdministrativoList>
        : <div></div>
      }
      </Grid>
      <Grid item xs={12}>
      {personaSeleccionado.codigoPersona>0 ?
        <PersonaHistoricoPagoListTable></PersonaHistoricoPagoListTable>
        : <div></div>
      }
      </Grid>

      <DatePickerWrapper>
          <DialogRhRelacionCargoInfo  popperPlacement={popperPlacement} />
        </DatePickerWrapper>
    </Grid>
  )
}

export default PersonaViewOverview

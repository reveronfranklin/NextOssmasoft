// ** React Imports
import { Ref, forwardRef, ReactElement} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'

import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

//import CardContent from '@mui/material/CardContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'

import { setPresupuesto, setVerPresupuestoActive } from 'src/store/apps/presupuesto';
import { RootState } from 'src/store'
import { useSelector } from 'react-redux'



// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import CustomInputs from 'src/views/forms/form-elements/pickers/PickersCustomInput'

import { getDateByObject } from 'src/utlities/ge-date-by-object'


import { IFechaDto } from '../../../../interfaces/fecha-dto';
import { IUpdatePrePresupuesto } from 'src/interfaces/Presupuesto/i-update-pre-presupuesto.dto'

import { fechaToFechaObj } from 'src/utlities/fecha-to-fecha-object'


// ** Custom Component Imports

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogPrePresupuestoInfo = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] })  => {


  // ** States
  const dispatch = useDispatch();
  const {verPresupuestoActive,presupuestoSeleccionado} = useSelector((state: RootState) => state.presupuesto)


  const handlerDesde=(desde:Date)=>{

    const fechaObj:IFechaDto =fechaToFechaObj(desde);
    const presupuestoTmp= {...presupuestoSeleccionado,fechaDesde:desde.toISOString(),fechaDesdeObj:fechaObj};
    dispatch(setPresupuesto(presupuestoTmp))

  }
  const handlerHasta=(hasta:Date)=>{


    const fechaObj:IFechaDto =fechaToFechaObj(hasta);

    const presupuestoTmp= {...presupuestoSeleccionado,fechaHasta:hasta.toISOString(),fechaHastaObj:fechaObj};
    dispatch(setPresupuesto(presupuestoTmp))

  }

  const handlerFechaAprobacion=(aprobacion:Date)=>{


    const fechaObj:IFechaDto =fechaToFechaObj(aprobacion);

    const presupuestoTmp= {...presupuestoSeleccionado,fechaAprobacion:aprobacion.toISOString(),fechaAprobacionObj:fechaObj};
    dispatch(setPresupuesto(presupuestoTmp))

  }
  const handlerFechaOrdenanza=(fechaOrdenanza:Date)=>{


    const fechaObj:IFechaDto =fechaToFechaObj(fechaOrdenanza);

    const presupuestoTmp= {...presupuestoSeleccionado,fechaOrdenanza:fechaOrdenanza.toISOString(),fechaOrdenanzaObj:fechaObj};
    dispatch(setPresupuesto(presupuestoTmp))

  }


  const handleSetShow= (active:boolean)=>{

    dispatch(setVerPresupuestoActive(active))
  }

  const handleSave= ()=>{




    const updatePresupuesto:IUpdatePrePresupuesto= {

      codigoPresupuesto:presupuestoSeleccionado.codigoPresupuesto,
      denominacion:presupuestoSeleccionado.denominacion,
      descripcion:presupuestoSeleccionado.descripcion,
      ano:presupuestoSeleccionado.ano,
      fechaDesde:presupuestoSeleccionado.fechaDesde,
      fechaHasta:presupuestoSeleccionado.fechaHasta,
      fechaAprobacion:presupuestoSeleccionado.fechaAprobacion,
      numeroOrdenanza:presupuestoSeleccionado.numeroOrdenanza,
      fechaOrdenanza:presupuestoSeleccionado.fechaOrdenanza,
      extra1:presupuestoSeleccionado.extra1,
      extra2:presupuestoSeleccionado.extra2,
      extra3:presupuestoSeleccionado.extra3,
    };

    console.log('Guardar:',presupuestoSeleccionado,updatePresupuesto)
  }


/*   useEffect(() => {


    console.log('presupuestoSeleccionado useEffect',presupuestoSeleccionado);

    if(presupuestoSeleccionado!= null && presupuestoSeleccionado.fechaDesde.length>0){

      const date = getDate(presupuestoSeleccionado.fechaDesde);
      //setFechaDesde(date);
    }

    if(presupuestoSeleccionado!= null && presupuestoSeleccionado.fechaHasta.length>0){

      const date = getDate(presupuestoSeleccionado.fechaHasta);
      setFechaHasta(date);
    }



    const aprobacion = new Date(presupuestoSeleccionado.fechaAprobacion)
    setFechaAprobacion(aprobacion);
    const ordenanza = new Date(presupuestoSeleccionado.fechaOrdenanza)
    setFechaAprobacion(ordenanza);


    //setDateTime(presupuestoSeleccionado.fechaDesde)

  }, []); */




    return (
      <Card>
        {/* <CardContent sx={{ textAlign: 'center', '& svg': { mb: 2 } }}>

          <Icon icon='mdi:account-outline' fontSize='2rem' />
          <Typography variant='h6' sx={{ mb: 4 }}>
            Edit User Info
          </Typography>
          <Typography sx={{ mb: 3 }}>{presupuestoSeleccionado.descripcion}</Typography>
          <Button variant='contained' onClick={() => handleSetShow(true)}>
            Show
          </Button>
        </CardContent> */}
        <Dialog
          fullWidth
          open={verPresupuestoActive}
          maxWidth='md'
          scroll='body'
          onClose={() => handleSetShow(false)}
          TransitionComponent={Transition}
          onBackdropClick={() => handleSetShow(false)}
        >
          <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
            <IconButton
              size='small'
              onClick={() => handleSetShow(false)}
              sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            >
              <Icon icon='mdi:close' />
            </IconButton>

            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h4' sx={{ mb: 3 }}>

                  MANTENIMIENTO DE PRESUPUESTO
              </Typography>
              <Typography variant='h5' sx={{ mb: 3 }}>

                {presupuestoSeleccionado.descripcion}
              </Typography>

            </Box>
            <Grid container spacing={6}>

              <Grid item sm={2} xs={12}>
                <TextField fullWidth defaultValue={presupuestoSeleccionado.codigoPresupuesto} label='Codigo' disabled  />
              </Grid>
              <Grid item xs={10}>
                <TextField fullWidth defaultValue={presupuestoSeleccionado.denominacion} label='Denominacion'  />
              </Grid>
              <Grid item sm={12} xs={12}>
                <TextField fullWidth defaultValue={presupuestoSeleccionado.descripcion} label='Descripcion' />
              </Grid>

              <Grid item sm={3} xs={12}>
                <TextField fullWidth label='Año' defaultValue={presupuestoSeleccionado.ano} />
              </Grid>

              <Grid item sm={3} xs={12}>
              <div>
                <DatePicker

                  selected={ getDateByObject(presupuestoSeleccionado.fechaDesdeObj)}
                  id='date-time-picker-desde'
                  dateFormat='dd/MM/yyyy'
                  popperPlacement={popperPlacement}
                  onChange={(date: Date) => handlerDesde(date)}
                  customInput={<CustomInputs label='Desde' />}
                />
              </div>

               {/*    <TextField fullWidth label='Fecha Desde' defaultValue={presupuestoSeleccionado.fechaDesde} /> */}
              </Grid>
              <Grid item sm={3} xs={12}>
                <div>
                  <DatePicker

                    selected={  getDateByObject(presupuestoSeleccionado.fechaHastaObj)}
                    id='date-time-picker-hasta'
                    dateFormat='dd/MM/yyyy'
                    popperPlacement={popperPlacement}
                    onChange={(date: Date) => handlerHasta(date)}
                    customInput={<CustomInputs label='Hasta' />}
                  />
                </div>
              </Grid>
              <Grid item sm={3} xs={12}>
                <div>
                  <DatePicker

                    selected={ getDateByObject(presupuestoSeleccionado.fechaAprobacionObj)}
                    id='date-time-picker-hasta'
                    dateFormat='dd/MM/yyyy'
                    popperPlacement={popperPlacement}
                    onChange={(date: Date) => handlerFechaAprobacion(date)}
                    customInput={<CustomInputs label='Aprobacion' />}
                  />
                </div>
              </Grid>
              <Grid item sm={9} xs={12}>
                <TextField fullWidth defaultValue={presupuestoSeleccionado.numeroOrdenanza} label='Numero Ordenanza' />
              </Grid>
              <Grid item sm={3} xs={12}>
                <div>
                  <DatePicker

                    selected={ getDateByObject(presupuestoSeleccionado.fechaOrdenanzaObj)}
                    id='date-time-picker-hasta'
                    dateFormat='dd/MM/yyyy'
                    popperPlacement={popperPlacement}

                    onChange={(date: Date) => handlerFechaOrdenanza(date)}
                    customInput={<CustomInputs label='Fecha Ordenanza' />}
                  />
                </div>
              </Grid>
              <Grid item sm={12} xs={12}>
                <TextField fullWidth defaultValue={presupuestoSeleccionado.extra1} label='Extra1' />
              </Grid>
              <Grid item sm={12} xs={12}>
                <TextField fullWidth defaultValue={presupuestoSeleccionado.extra2} label='Extra2' />
              </Grid>
              <Grid item sm={12} xs={12}>
                <TextField fullWidth defaultValue={presupuestoSeleccionado.extra3} label='Extra3' />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
            <Button variant='contained' sx={{ mr: 1 }} onClick={() => handleSave()}>
              Guardar
            </Button>
            <Button variant='outlined' color='secondary' onClick={() => handleSetShow(false)}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

      </Card>
    )


}

export default DialogPrePresupuestoInfo

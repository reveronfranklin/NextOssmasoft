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

import CardContent from '@mui/material/CardContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'



// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import { Tooltip } from '@mui/material'
import { setVerDetallePreVSaldoActive, setVerPreDetalleDocumentoBloqueadoActive, setVerPreDetalleDocumentoCausadoActive, setVerPreDetalleDocumentoCompromisosActive, setVerPreDetalleDocumentoPagadoActive, setVerPreDetalleDocumentoModificadoActive, setVerPreDetalleSaldoPorPartidaActive } from 'src/store/apps/presupuesto';
import { RootState } from 'src/store'
import { useSelector } from 'react-redux'

import DialogPreVSaldoDocumentosCompromisoInfo from './DialogPreVSaldoDocumentosCompromisoInfo'
import DialogPreVSaldoDocumentosCausadoInfo from './DialogPreVSaldoDocumentosCausadoInfo'
import DialogPreVSaldoDocumentosPagadoInfo from './DialogPreVSaldoDocumentosPagadoInfo'
import DialogPreVSaldoDocumentosBloqueadoInfo from './DialogPreVSaldoDocumentosBloqueadoInfo'
import DialogPreVSaldoDocumentosModificadoInfo from './DialogPreVSaldoDocumentosModificadoInfo'
import DialogPreVSaldoPorPartidaInfo from './DialogPreVSaldoPorPartidaInfo'


const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogPreVSaldoInfo = () => {

  // ** States
  const dispatch = useDispatch();
  const {verDetallePreVSaldoActive,preVSaldoSeleccionado} = useSelector((state: RootState) => state.presupuesto)




  const handleSetShow= (active:boolean)=>{

    dispatch(setVerDetallePreVSaldoActive(active))
  }
  const handleSetShowComprometido= (active:boolean)=>{

    dispatch(setVerPreDetalleDocumentoCompromisosActive(active))
  }
  const handleSetShowCausado= (active:boolean)=>{

    dispatch(setVerPreDetalleDocumentoCausadoActive(active))
  }
  const handleSetShowPagado= (active:boolean)=>{

    dispatch(setVerPreDetalleDocumentoPagadoActive(active))
  }
  const handleSetShowBloqueado= (active:boolean)=>{

    dispatch(setVerPreDetalleDocumentoBloqueadoActive(active))
  }
  const handleSetShowModificado= (active:boolean)=>{

    dispatch(setVerPreDetalleDocumentoModificadoActive(active))
  }
  const handleSetShowSaldoPorPartida= (active:boolean)=>{

    dispatch(setVerPreDetalleSaldoPorPartidaActive(active))
  }


  return (
    <Card>
      <CardContent sx={{ textAlign: 'center', '& svg': { mb: 2 } }}>
        <Icon icon='mdi:account-outline' fontSize='2rem' />
        <Typography variant='h6' sx={{ mb: 4 }}>
          Edit User Info
        </Typography>
        <Typography sx={{ mb: 3 }}>{preVSaldoSeleccionado.descripcionFinanciado}</Typography>
        <Button variant='contained' onClick={() => handleSetShow(true)}>
          Show
        </Button>
      </CardContent>
      <Dialog
        fullWidth
        open={verDetallePreVSaldoActive}
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

                SALDOS POR FUENTE DE FINANCIAMIENTO
            </Typography>
            <Typography variant='h5' sx={{ mb: 3 }}>

              {preVSaldoSeleccionado.descripcionPresupuesto}
            </Typography>
            <Typography variant='body2'>{preVSaldoSeleccionado.descripcionFinanciado}</Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item sm={6} xs={12}>
              <TextField fullWidth defaultValue={preVSaldoSeleccionado.unidadEjecutora} label='Dpto' placeholder='John' />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField fullWidth defaultValue={preVSaldoSeleccionado.codigoIcpConcat} label='ICP Concat' />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth defaultValue={preVSaldoSeleccionado.denominacionIcp} label='Denominacion ICP'  />
            </Grid>
            <Grid item sm={3} xs={12}>
            <Tooltip title='Double click Ver Detalle Por Partida'>
                <TextField fullWidth label='Codigo Puc Concat' defaultValue={preVSaldoSeleccionado.codigoPucConcat}
                    onDoubleClick={() => handleSetShowSaldoPorPartida(true)}
                    sx={{ input: { color: 'green' } }}
                  />
              </Tooltip>

            </Grid>

            <Grid item sm={9} xs={12}>
              <TextField fullWidth label='Denominacion' defaultValue={preVSaldoSeleccionado.denominacionPuc}  multiline
          maxRows={4}/>
            </Grid>

            <Grid item sm={4} xs={12}>
              <TextField fullWidth label='Asignacion' defaultValue={preVSaldoSeleccionado.asignacionFormat} />
            </Grid>
            <Grid item sm={4} xs={12}>
              <TextField fullWidth label='Presupuestado' defaultValue={preVSaldoSeleccionado.presupuestadoFormat} />
            </Grid>
            <Grid item sm={4} xs={12}>
              <Tooltip title='Double click Ver Documentos'>
                <TextField fullWidth label='Bloqueado' defaultValue={preVSaldoSeleccionado.bloqueadoFormat}
                    onDoubleClick={() => handleSetShowBloqueado(true)}
                    sx={{ input: { color: 'green' } }}
                  />
              </Tooltip>

            </Grid>
            <Grid item sm={4} xs={12}>
            <Tooltip title='Double click Ver Documentos'>
            <TextField fullWidth label='Modificado' defaultValue={preVSaldoSeleccionado.modificadoFormat}
               onDoubleClick={() => handleSetShowModificado(true)}
               sx={{ input: { color: 'green' } }}
              />
            </Tooltip>

            </Grid>
            <Grid item sm={4} xs={12}>
              <TextField fullWidth label='Ajustado' defaultValue={preVSaldoSeleccionado.ajustadoFormat} />
            </Grid>
            <Grid item sm={4} xs={12}>
              <TextField fullWidth label='Vigente' defaultValue={preVSaldoSeleccionado.vigenteFormat} />
            </Grid>
            <Grid item sm={4} xs={12}>
            <Tooltip title='Double click Ver Documentos'>
            <TextField fullWidth label='Comprometido' defaultValue={preVSaldoSeleccionado.comprometidoFormat}
               onDoubleClick={() => handleSetShowComprometido(true)}
               sx={{ input: { color: 'green' } }}
              />
            </Tooltip>


            </Grid>
            <Grid item sm={4} xs={12}>
              <TextField fullWidth label='Disponible' defaultValue={preVSaldoSeleccionado.disponibleFormat} />
            </Grid>
            <Grid item sm={4} xs={12}>
            <Tooltip title='Double click Ver Documentos'>
                <TextField fullWidth label='Causado' defaultValue={preVSaldoSeleccionado.causadoFormat}
                  onDoubleClick={() => handleSetShowCausado(true)}
                  sx={{ input: { color: 'green' } }}
                  />
            </Tooltip>


            </Grid>
            <Grid item sm={4} xs={12}>

            <Tooltip title='Double click Ver Documentos'>
            <TextField fullWidth label='Pagado*' defaultValue={preVSaldoSeleccionado.pagadoFormat}
               onDoubleClick={() => handleSetShowPagado(true)}
               sx={{ input: { color: 'green' } }}
              />
            </Tooltip>


            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
          <Button variant='contained' sx={{ mr: 1 }} onClick={() => handleSetShow(false)}>
            Cerrar
          </Button>

        </DialogActions>
      </Dialog>
      <DialogPreVSaldoDocumentosCompromisoInfo/>
      <DialogPreVSaldoDocumentosCausadoInfo/>
      <DialogPreVSaldoDocumentosPagadoInfo/>
      <DialogPreVSaldoDocumentosBloqueadoInfo/>
      <DialogPreVSaldoDocumentosModificadoInfo/>
      <DialogPreVSaldoPorPartidaInfo/>

    </Card>
  )
}

export default DialogPreVSaldoInfo

// ** React Imports
import { Ref, forwardRef, ReactElement, useEffect, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'


import Card from '@mui/material/Card'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'


import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

//import CardContent from '@mui/material/CardContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'



// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import { setPreDetalleDocumentoCausado, setVerPreDetalleDocumentoModificadoActive } from 'src/store/apps/presupuesto';
import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import { IFilterDocumentosPreVSaldo } from 'src/interfaces/Presupuesto/i-filter-documentos-pre-VSaldo'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { IPreDetalleDocumentoGetDto } from 'src/interfaces/Presupuesto/i-pre-detalle-documento-get-dto'

import TableBasicModificado from './TableBasicModificado'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface Props {
  data: IPreDetalleDocumentoGetDto[]
  titulo:string

}
const DialogPreVSaldoDocumentosModificadoInfo = () => {

  // ** States
  const dispatch = useDispatch();
  const {verPreDetalleDocumentoModificadoActive,preVSaldoSeleccionado} = useSelector((state: RootState) => state.presupuesto)


  const props:Props={
    data:[],
    titulo:"Documentos Compromiso"
  }
  const fetchTableData = useCallback(
    async (codigoPresupuesto:number,codigoSaldo:number) => {


      const filter:IFilterDocumentosPreVSaldo={codigoPresupuesto:codigoPresupuesto,codigoSaldo:codigoSaldo}
      const responseAll= await ossmmasofApi.post<any>('/PreVDocModificado/GetAllByCodigoSaldo',filter);
      let data:any=[];
      if(responseAll.data.data!=null){
        data=responseAll.data.data
      }
      dispatch(setPreDetalleDocumentoCausado(data));
      props.data=data


    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )



  useEffect(() => {
    fetchTableData(preVSaldoSeleccionado.codigoPresupuesto,preVSaldoSeleccionado.codigoSaldo);

    //fetchTableExcel();
  }, [fetchTableData, preVSaldoSeleccionado.codigoPresupuesto, preVSaldoSeleccionado.codigoSaldo])

  const handleSetShow= (active:boolean)=>{

    dispatch(setVerPreDetalleDocumentoModificadoActive(active))
  }

  return (
    <Card>
      {/* <CardContent sx={{ textAlign: 'center', '& svg': { mb: 2 } }}>
        <Icon icon='mdi:account-outline' fontSize='2rem' />
        <Typography variant='h6' sx={{ mb: 4 }}>
          Edit User Info
        </Typography>
        <Typography sx={{ mb: 3 }}>{preVSaldoSeleccionado.descripcionFinanciado}</Typography>
        <Button variant='contained' onClick={() => handleSetShow(true)}>
          Show
        </Button>
      </CardContent> */}
      <Dialog
        fullWidth
        open={verPreDetalleDocumentoModificadoActive}
        maxWidth='lg'
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

                Detalle Modificado
            </Typography>
            <Typography variant='h5' sx={{ mb: 3 }}>

              {preVSaldoSeleccionado.descripcionPresupuesto}
            </Typography>
            <Typography variant='body2'>{preVSaldoSeleccionado.descripcionFinanciado}</Typography>
          </Box>
          <TableBasicModificado/>
        </DialogContent>
        <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
          <Button variant='contained' sx={{ mr: 1 }} onClick={() => handleSetShow(false)}>
            Cerrar
          </Button>

        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default DialogPreVSaldoDocumentosModificadoInfo

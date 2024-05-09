// ** React Imports
import { Ref, forwardRef, ReactElement, useEffect, useState } from 'react'

// ** MUI Imports

import Card from '@mui/material/Card'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'

import IconButton from '@mui/material/IconButton'

//import CardContent from '@mui/material/CardContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'

import { RootState } from 'src/store'
import { useSelector } from 'react-redux'

// ** Third Party Imports
//import { ReactDatePickerProps } from 'react-datepicker'

// ** Third Party Imports

//import QRCode from "react-qr-code";

import { setBm1Seleccionado, setListBmBienesFotoResponseDto, setVerBmBm1ActiveActive } from 'src/store/apps/bm'
import { Divider, ImageListItemBar, Typography } from '@mui/material'

import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { IBmBienesFotoResponseDto } from 'src/interfaces/Bm/BmBienesFoto/BmBienesFotoResponseDto'
import FormBmFotosBienesAsync from '../forms/FormBmFotosBienesAsync'

// ** Custom Component Imports

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogBm1Info = () => {
  // ** States
  const dispatch = useDispatch()
  const { verBmBm1Active, bmBm1Seleccionado, listBmBienesFotoResponseDto } = useSelector(
    (state: RootState) => state.bmBm1
  )
  const [data, setData] = useState<IBmBienesFotoResponseDto[]>([])
  const handleSetShow = (active: boolean) => {
    if (active == false) {
      const defaultValues = {}
      dispatch(setBm1Seleccionado(defaultValues))
    }
    dispatch(setVerBmBm1ActiveActive(active))
  }

  useEffect(() => {
    const getData = async () => {
      if (bmBm1Seleccionado.numeroPlaca != undefined) {
        const filter = {
          numeroPlaca: bmBm1Seleccionado.numeroPlaca
        }
        const responseAll = await ossmmasofApi.post<any>('/BmBienesFotos/GetByNumeroPlaca', filter)

        dispatch(setListBmBienesFotoResponseDto(responseAll.data.data))
        setData(responseAll.data.data)
        console.log(data)
      }
    }

    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bmBm1Seleccionado])

  return (
    <Card>
      <Dialog
        fullWidth
        open={verBmBm1Active}
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
          <Divider></Divider>
          <FormBmFotosBienesAsync></FormBmFotosBienesAsync>
          <Divider></Divider>
          {bmBm1Seleccionado.numeroPlaca && listBmBienesFotoResponseDto ? (
            <>
              {/*                 <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "80%", width: "80%" }}
                  value={bmBm1Seleccionado.numeroPlaca + '-' + bmBm1Seleccionado.articulo + '-' + bmBm1Seleccionado.unidadTrabajo}
                  viewBox={`0 0 128 128`}
                  /> */}

              <ImageList sx={{ width: 700, height: 700 }} cols={2} rowHeight={164}>
                {listBmBienesFotoResponseDto.map(item => (
                  <ImageListItem key={item.codigoBienFoto}>
                    <img srcSet={`${item.patch}`} src={`${item.patch}`} alt={item.titulo} loading='lazy' />
                    {/*  <img
                                  srcSet={`${item.patch}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                  src={`${item.patch}?w=164&h=164&fit=crop&auto=format`}
                                  alt={item.titulo}
                                  loading="lazy"
                                  /> */}

                    <ImageListItemBar title={item.titulo} subtitle={<span>{item.numeroPlaca}</span>} position='below' />
                  </ImageListItem>
                ))}
              </ImageList>
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {bmBm1Seleccionado.numeroPlaca} - {bmBm1Seleccionado.articulo}- {bmBm1Seleccionado.unidadTrabajo}-
                {bmBm1Seleccionado.responsableBien}-{bmBm1Seleccionado.especificacion}
              </Typography>
            </>
          ) : (
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              No Data
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
          <Button variant='outlined' color='secondary' onClick={() => handleSetShow(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default DialogBm1Info

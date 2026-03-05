import { Box, Card, CardActions, Grid, IconButton, Tooltip, Chip, Avatar, CardHeader } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ReactDatePickerProps } from 'react-datepicker'
import Icon from 'src/@core/components/icon'
import { DataGrid  } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles'
import { useDispatch } from 'react-redux';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import Spinner from 'src/@core/components/spinner';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import DialogRhVariacionInfo from './DialogRhVariacionInfo';
import { IRhPersonasMovControlResponseDto } from 'src/interfaces/rh/RhPersonasMovControlResponseDto';
import { setOperacionCrudRhPersonaMovCtr, setRhPersonaMovCtrSeleccionado, setVerRhPersonaMovCtrActive } from 'src/store/apps/rh-persona-mov-ctrl';
import { setConceptos } from 'src/store/apps/rh';
import useColumnsDataGrid from '../components/headers/ColumnsDataGrid';
import validateAmount from 'src/utilities/validateAmount';
import FormatNumber from 'src/utilities/format-numbers';

interface TotalesState {
  montoTotal: string | number;
  asignacionesTotales: string | number;
  deduccionesTotales: string | number;
}

const VariacionList = () => {
  const theme           = useTheme()
  const { direction }   = theme
  const columnsDataGrid = useColumnsDataGrid()

  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const handleView=  (row : IRhPersonasMovControlResponseDto) => {
   if (personaSeleccionado && personaSeleccionado.codigoPersona>0) {
      dispatch(setRhPersonaMovCtrSeleccionado(row))
      dispatch(setOperacionCrudRhPersonaMovCtr(2));
      dispatch(setVerRhPersonaMovCtrActive(true))
   }
  }

  const handleDoubleClick=(row:any)=>{
    handleView(row.row)
  }

  const handleAdd = () => {
    if (personaSeleccionado && personaSeleccionado.codigoPersona<=0) {

      return;
    }

    const defaultValues:IRhPersonasMovControlResponseDto = {
      codigoPersonaMovCtrl:0,
      codigoPersona :personaSeleccionado.codigoPersona,
      codigoConcepto :0,
      controlAplica :0,
      descripcionControlAplica:'',
      descripcionConcepto:''
    }

    dispatch(setRhPersonaMovCtrSeleccionado(defaultValues));
    dispatch(setOperacionCrudRhPersonaMovCtr(1));
    dispatch(setVerRhPersonaMovCtrActive(true))
  }

  const dispatch = useDispatch();

  const {verRhPersonaMovCtrActive=false} = useSelector((state: RootState) => state.rhPersonaMovCtrl)
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IRhPersonasMovControlResponseDto[]>([])
  const {personaSeleccionado} = useSelector((state: RootState) => state.nomina)
  const [totales, setTotales] = useState<TotalesState>({
    montoTotal: 0,
    asignacionesTotales: 0,
    deduccionesTotales: 0
  })

  const getTotal = (total1: any, total2: any, total3: any) => {
    const montoTotal          = validateAmount(parseFloat(total1))
    const asignacionesTotales = validateAmount(parseFloat(total2))
    const deduccionesTotales  = validateAmount(parseFloat(total3))

    return {
      montoTotal: FormatNumber(montoTotal) ?? 0,
      asignacionesTotales: FormatNumber(asignacionesTotales) ?? 0,
      deduccionesTotales: FormatNumber(deduccionesTotales) ?? 0
    }
  }

  useEffect(() => {
    const getData = async () => {
      setLoading(true)

      if (personaSeleccionado.codigoPersona>0) {
        const filter = {
          CodigoTipoNomina: 12,
          CodigoPersona: personaSeleccionado.codigoPersona,
          CodigoUsuario: 530,
          CodigoEmpresa: 13,
          PageSize: 1000,
          PageNumber: 1,
          SearchText: ""
        }

        const responseAll   = await  ossmmasofApiVertical.post<any>('/RhCalculoNomina/CalculoPorPersona', filter)
        const responseData  = responseAll.data
        setData(responseData.data)

        const totales = getTotal( responseData.total1, responseData.total2, responseData. total3)
        setTotales(totales)

        const responseAllConceptos = await ossmmasofApi.get<any>('/RhConceptos/GetAll')
        const { data } = responseAllConceptos

        if (data) {
          dispatch(setConceptos(data))
        }
      }

      setLoading(false);
    }

    getData();

  }, [verRhPersonaMovCtrActive, personaSeleccionado]);

  return (
    <Grid item xs={12}>
      <Card sx={{ my: 2 }}>
        <DialogRhVariacionInfo popperPlacement={popperPlacement} />
      </Card>

      <Card>
        <CardActions>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-end', width: '100%' }}>
            <Tooltip title='Agregar'>
              <IconButton  color='primary' size='small' onClick={() => handleAdd()}>
                <Icon icon='ci:add-row' fontSize={20} />
              </IconButton>
            </Tooltip>

            <Grid
              container
              spacing={2}
              sx={{ mx: 1, my: 1 }}
              justifyContent="center"
              alignContent="center"
              alignItems="center"
            >
              <Grid item>
                <Tooltip title='Monto total'>
                  <Chip
                    avatar={<Avatar>M</Avatar>}
                    label={totales.montoTotal}
                    variant="outlined"
                    color="primary"
                  />
                </Tooltip>
              </Grid>

              <Grid item>
                <Tooltip title='Asignaciones totales'>
                  <Chip
                    avatar={<Avatar>A</Avatar>}
                    label={totales.asignacionesTotales}
                    variant="outlined"
                    color="primary"
                  />
                </Tooltip>
              </Grid>

              <Grid item>
                <Tooltip title='Deducciones totales'>
                  <Chip
                    avatar={<Avatar>D</Avatar>}
                    label={totales.deduccionesTotales}
                    variant="outlined"
                    color="primary"
                  />
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        </CardActions>

        { loading
          ?
            <Spinner sx={{ height: '100%' }} />
          :
            <Box sx={{ height: 500 }}>
              <DataGrid
                getRowId={(row) => row.codigoMovNomina }
                columns={columnsDataGrid}
                rows={data}
                onRowDoubleClick={(row) => handleDoubleClick(row)}
              />
            </Box>
        }
      </Card>

     {/*  <DatePickerWrapper>
        <DialogRhVariacionInfo popperPlacement={popperPlacement} />
      </DatePickerWrapper> */}
    </Grid>
  )
}

export default VariacionList

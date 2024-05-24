import { Box, Card, CardActions, CardHeader, Grid, IconButton, Tooltip, Typography} from '@mui/material'
import React, { useEffect, useState } from 'react'

//import { ReactDatePickerProps } from 'react-datepicker'
import { ReactDatePickerProps } from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { DataGrid  } from '@mui/x-data-grid';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles'
import { useDispatch } from 'react-redux';

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import Spinner from 'src/@core/components/spinner';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

import { IRhAdministrativosResponseDto } from 'src/interfaces/rh/i-rh-administrativos-response-dto';
import { setListRhBancos, setListRhTipoCuenta, setOperacionCrudRhAdministrativas, setRhAdministrativoSeleccionado, setVerRhAdministrativasActive } from 'src/store/apps/rh-administrativos';
import DialogRhAdministrativosInfo from './DialogRhAdministrativosInfo';
import dayjs from 'dayjs';
import { IFechaDto } from 'src/interfaces/fecha-dto';
import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva';
import { monthByIndex } from 'src/utilities/ge-date-by-object';

interface CellType {
  row: IRhAdministrativosResponseDto
}

const AdministrativoList = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'


  const fechaActual = new Date()

  const currentYear  = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentMonthString ='00' + monthByIndex(currentMonth).toString();

  const currentDay =new Date().getDate();
  const currentDayString = '00' + currentDay.toString();
  const defaultDate :IFechaDto = {year:currentYear.toString(),month:currentMonthString.slice(-2),day:currentDayString.slice(-2)}
  const defaultDateString = fechaActual.toISOString();

  const columns = [


    {
      flex: 0.2,
      field: 'codigoAdministrativo',
      minWidth: 90,
      headerName: '# ID',
    },


    {
      with:100,
      headerName: 'Hasta',
      field: 'fechaHasta',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.fechaIngreso).format('DD/MM/YYYY') }
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 50,
      field: 'descripcionTipoPago',
      headerName: 'Tipo Pago',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.descripcionTipoPago}</Typography>
    },
    {
      flex: 0.3,
      minWidth: 125,
      field: 'descripcionBanco',
      headerName: 'Banco',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.descripcionBanco}</Typography>
    },
    {
      flex: 0.2,
      minWidth: 125,
      field: 'descripcionCuenta',
      headerName: 'Tipo Cuenta',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.descripcionCuenta}</Typography>
    },
    {
      flex: 0.4,
      minWidth: 155,
      field: 'Cuenta',
      headerName: 'No Cuenta',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.noCuenta}</Typography>
    },




  ]


  //IPreIndiceCategoriaProgramaticaGetDto
  const handleView=  (row : IRhAdministrativosResponseDto)=>{

    dispatch(setRhAdministrativoSeleccionado(row))

     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudRhAdministrativas(2));
    dispatch(setVerRhAdministrativasActive(true))


  }



  const handleDoubleClick=(row:any)=>{


      handleView(row.row)
  }
  const handleAdd=  ()=>{

    //dispatch(setPresupuesto(row))
    // Operacion Crud 1 = Crear presupuesto


      const defaultValues:IRhAdministrativosResponseDto = {
        codigoAdministrativo :0,
        codigoPersona :personaSeleccionado.codigoPersona,
        fechaIngreso:defaultDateString,
        fechaIngresoObj:defaultDate,
        tipoPago :'',
        descripcionTipoPago:'',
        bancoId :0,
        descripcionBanco :'',
        tipoCuentaId :0,
        descripcionCuenta:'',
        noCuenta:''
      }


      dispatch(setRhAdministrativoSeleccionado(defaultValues));
      dispatch(setOperacionCrudRhAdministrativas(1));
      dispatch(setVerRhAdministrativasActive(true))


  }


  const dispatch = useDispatch();


  const {verRhAdministrativasActive=false} = useSelector((state: RootState) => state.rhAdministrativos)
  const [loading, setLoading] = useState(false);
  const [viewTable, setViewTable] = useState(false);
  const [data, setData] = useState<IRhAdministrativosResponseDto[]>([])
  const {personaSeleccionado} = useSelector((state: RootState) => state.nomina)

  const handleViewTree=()=>{
    setViewTable(false);

  }

  /*const handleViewTable=()=>{
    setViewTable(true);

  }*/
  useEffect(() => {

    const getData = async () => {
      setLoading(true);
      if(personaSeleccionado.codigoPersona>0){
        const filterBanco={descripcionId:0,tituloId:18}
      const responseBanco= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterBanco);
      dispatch(setListRhBancos(responseBanco.data))

      const filterTipoCuenta={descripcionId:0,tituloId:19}
      const responseTipoCuenta= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterTipoCuenta);
      dispatch(setListRhTipoCuenta(responseTipoCuenta.data))
        const filter={codigoPersona:personaSeleccionado.codigoPersona}
        const responseAll= await ossmmasofApi.post<IRhAdministrativosResponseDto[]>('/RhAdministrativos/GetByPersona',filter);

        setData(responseAll.data);
      }


      setLoading(false);
    };




    getData();



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verRhAdministrativasActive, personaSeleccionado]);




  return (
    <Grid item xs={12}>
       <Card>
        <CardHeader title='Administrativos' />

        <CardActions>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Agregar'>
            <IconButton  color='primary' size='small' onClick={() => handleAdd()}>
            <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip>

        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Tabla'>
            <IconButton size='small'  color='primary' onClick={() => handleViewTree()}>
            <Icon icon='fluent:table-24-regular' fontSize={20} />
            </IconButton>
          </Tooltip>

        </Box>


        </CardActions>

             {/*  {
                loading
                ?   <Spinner sx={{ height: '100%' }} />
                :
                <Box sx={{ height: 500 }}>
                  <DataGrid

                  getRowId={(row) => row.codigoIcp}
                  columns={columns}
                  rows={icp} />


                </Box>


              } */}
              {viewTable
              ?  <div></div>
              :
                loading ?   <Spinner sx={{ height: '100%' }} />
                :
                <Box sx={{ height: 500 }}>
                <DataGrid
                  getRowId={(row) => row.codigoAdministrativo }

                  columns={columns}
                  rows={data}
                  onRowDoubleClick={(row) => handleDoubleClick(row)}

                  />


                </Box>

              }


        </Card>

        <DatePickerWrapper>
              <DialogRhAdministrativosInfo  popperPlacement={popperPlacement} />
        </DatePickerWrapper>
    </Grid>


  )
}

export default AdministrativoList

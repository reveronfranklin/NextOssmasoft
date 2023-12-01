import { Box, Card, CardActions, Grid, IconButton, Tooltip, Typography} from '@mui/material'
import React, { useEffect, useState } from 'react'

//import { ReactDatePickerProps } from 'react-datepicker'
import { ReactDatePickerProps } from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { DataGrid  } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles'
import { useDispatch } from 'react-redux';


import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import Spinner from 'src/@core/components/spinner';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

import { IRhAdministrativosResponseDto } from 'src/interfaces/rh/i-rh-administrativos-response-dto';
import { setOperacionCrudRhAdministrativas, setRhAdministrativoSeleccionado, setVerRhAdministrativasActive } from 'src/store/apps/rh-administrativos';
import { IFechaDto } from 'src/interfaces/fecha-dto';
import DialogRhFamiliaresInfo from './DialogRhFamiliaresInfo';
import { IRhFamiliarResponseDto } from 'src/interfaces/rh/RhFamiliarResponseDto';

interface CellType {
  row: IRhFamiliarResponseDto
}

const FamiliaresList = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'


  const fechaActual = new Date()

  const currentYear  = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentMonthString ='00' + currentMonth.toString();

  const currentDay =new Date().getDate();
  const currentDayString = '00' + currentDay.toString();
  const defaultDate :IFechaDto = {year:currentYear.toString(),month:currentMonthString.slice(-2),day:currentDayString.slice(-2)}
  const defaultDateString = fechaActual.toISOString();

  const columns = [


    {
      flex: 0.2,
      field: 'codigoFamiliar',
      minWidth: 90,
      headerName: '# ID',
    },

    {
      flex: 0.2,
      minWidth: 50,
      field: 'cedulaFamiliar',
      headerName: 'Cedula',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.cedulaFamiliar.toString()}</Typography>
    },
    {
      flex: 0.3,
      minWidth: 125,
      field: 'nombre',
      headerName: 'Nombre',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.nombre}</Typography>
    },
    {
      flex: 0.2,
      minWidth: 125,
      field: 'apellido',
      headerName: 'Apellido',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.apellido}</Typography>
    },
    {
      flex: 0.4,
      minWidth: 155,
      field: 'parienteDescripcion',
      headerName: 'Parentesco',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.parienteDescripcion}</Typography>
    },
    {
      flex: 0.4,
      minWidth: 155,
      field: 'edad',
      headerName: 'Edad',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.edad}</Typography>
    },



  ]


  //IPreIndiceCategoriaProgramaticaGetDto
  const handleView=  (row : IRhAdministrativosResponseDto)=>{

    console.log(row)
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


  const {verRhFamiliaresActive=false} = useSelector((state: RootState) => state.rhFamiliares)
  const [loading, setLoading] = useState(false);
  const [viewTable, setViewTable] = useState(false);
  const [data, setData] = useState<IRhFamiliarResponseDto[]>([])
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
        //const filterBanco={descripcionId:0,tituloId:18}
        //const responseBanco= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterBanco);
        //dispatch(setListRhBancos(responseBanco.data))

        //const filterTipoCuenta={descripcionId:0,tituloId:19}
         //const responseTipoCuenta= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterTipoCuenta);
         //dispatch(setListRhTipoCuenta(responseTipoCuenta.data))
      const filter={codigoPersona:personaSeleccionado.codigoPersona}
      const responseAll= await ossmmasofApi.post<any>('/RhFamiliares/GetByPersona',filter);
      console.log(responseAll.data)
      setData(responseAll.data.data);
      }


      setLoading(false);
    };




    getData();



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verRhFamiliaresActive, personaSeleccionado]);




  return (
    <Grid item xs={12}>
       <Card>


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
                  getRowId={(row) => row.codigoFamiliar }

                  columns={columns}
                  rows={data}
                  onRowDoubleClick={(row) => handleDoubleClick(row)}

                  />


                </Box>

              }


        </Card>

        <DatePickerWrapper>
              <DialogRhFamiliaresInfo  popperPlacement={popperPlacement} />
        </DatePickerWrapper>
    </Grid>


  )
}

export default FamiliaresList

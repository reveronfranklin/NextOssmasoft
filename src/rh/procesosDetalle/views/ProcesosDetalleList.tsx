import { Autocomplete, Box, Card, CardActions, CardHeader, Grid, IconButton, TextField, Tooltip, Typography} from '@mui/material'
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


import DialogRhProcesosDetalleInfo from './DialogRhProcesosDetalleInfo';
import { IRhProcesosDetalleResponseDto } from 'src/interfaces/rh/ProcesosDetalle/RhProcesosDetalleResponseDto';
import { setOperacionCrudRhProcesosDetalle, setRhProcesosDetalleSeleccionado, setVerRhProcesosDetalleActive } from 'src/store/apps/rh-procesosDetalle';
import { setListRhTipoNomina, setRhTipoNominaSeleccionado } from 'src/store/apps/rh-tipoNomina';



//import { IFechaDto } from 'src/interfaces/fecha-dto';
//import { monthByIndex } from 'src/utilities/ge-date-by-object';

interface CellType {
  row: IRhProcesosDetalleResponseDto
}

const ProcesosDetalleList = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'


/*   const fechaActual = new Date()

  const currentYear  = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentMonthString ='00' + monthByIndex(currentMonth).toString();

  const currentDay =new Date().getDate();
  const currentDayString = '00' + currentDay.toString();
  const defaultDate :IFechaDto = {year:currentYear.toString(),month:currentMonthString.slice(-2),day:currentDayString.slice(-2)}
  const defaultDateString = fechaActual.toISOString();
 */

  const columns = [

    {
      flex: 0.05,
      field: 'codigoDetalleProceso',
      minWidth: 30,
      headerName: '# ID',
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: 'codigoTipoNomina',
      headerName: 'Cod. Tipo Nomina',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.codigoTipoNomina}</Typography>
    },
    {
      flex: 0.2,
      minWidth: 50,
      field: 'descripcionTipoNomina',
      headerName: 'Tipo Nomina',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.descripcionTipoNomina}</Typography>
    },
    {
      flex: 0.1,
      minWidth: 50,
      field: 'codigoConcepto',
      headerName: 'Cod. Concepto',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.codigoConcepto}</Typography>
    },
    {
      flex: 0.2,
      minWidth: 50,
      field: 'descripcionConcepto',
      headerName: 'Concepto',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.descripcionConcepto}</Typography>
    },






  ]


  //IPreIndiceCategoriaProgramaticaGetDto
  const handleView=  (row : IRhProcesosDetalleResponseDto)=>{


    dispatch(setRhProcesosDetalleSeleccionado(row))

     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudRhProcesosDetalle(2));
    dispatch(setVerRhProcesosDetalleActive(true))


  }



  const handleTiposNomina= (e: any,value:any)=>{
    console.log(value)
    if(value!=null){

      dispatch(setRhTipoNominaSeleccionado(value));



    }else{

      dispatch(setRhTipoNominaSeleccionado({}));

    }
  }

  const handleDoubleClick=(row:any)=>{


      handleView(row.row)
  }

  const handleAdd=  ()=>{

    //dispatch(setPresupuesto(row))
    // Operacion Crud 1 = Crear presupuesto


    const defaultValues:IRhProcesosDetalleResponseDto = {

      codigoDetalleProceso :0,
      codigoProceso :rhProcesosSeleccionado.codigoProceso,
      codigoConcepto :0,
      descripcionConcepto :'',
      codigoTipoNomina :0,
      descripcionTipoNomina :''


    }


      dispatch(setRhProcesosDetalleSeleccionado(defaultValues));
      dispatch(setOperacionCrudRhProcesosDetalle(1));
      dispatch(setVerRhProcesosDetalleActive(true))


  }


  const dispatch = useDispatch();



  const {rhProcesosSeleccionado} = useSelector((state: RootState) => state.rhProceso)
  const {verRhProcesosDetalleActive} = useSelector((state: RootState) => state.rhProcesoDetalle)
  const {listRhTipoNomina,rhTipoNominaSeleccionado} = useSelector((state: RootState) => state.rhTipoNomina)
  const [loading, setLoading] = useState(false);
  const [viewTable] = useState(false);
  const [data, setData] = useState<IRhProcesosDetalleResponseDto[]>([])



  /*const handleViewTable=()=>{
    setViewTable(true);

  }*/






  useEffect(() => {

    const getData = async () => {
      setLoading(true);

      //await fetchDataListPresupuestoDto(dispatch);
      if(rhProcesosSeleccionado.codigoProceso>0){

        const filter={codigoProceso:rhProcesosSeleccionado.codigoProceso,codigoTipoNomina:rhTipoNominaSeleccionado.codigoTipoNomina}
        const responseAll= await ossmmasofApi.post<any>('/RhProcesosDetalle/GetByProceso',filter);

        setData(responseAll.data.data);
        console.log(responseAll.data)


        const responseAllTipoNomina= await ossmmasofApi.get<any>('/RhTipoNomina/GetAll');
        const data = responseAllTipoNomina.data;
        dispatch(setListRhTipoNomina(data));

        /*if(!rhTipoNominaSeleccionado){
          dispatch(setRhTipoNominaSeleccionado(data[0]));
        }*/




      }


      setLoading(false);
    };




    getData();



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rhProcesosSeleccionado,verRhProcesosDetalleActive,rhTipoNominaSeleccionado]);




  return (
    <Grid item xs={12}>
       <Card>
        <CardHeader title='Conceptos por Proceso y Tipo de Nomina' />

        <CardActions>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Agregar'>
            <IconButton  color='primary' size='small' onClick={() => handleAdd()}>
            <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip>
          {/* Tipo Nomina */}
          <Grid item sm={8} xs={12}>

                <Autocomplete
                            sx={{ width: 350 }}
                      options={listRhTipoNomina}
                      value={rhTipoNominaSeleccionado}
                      id='autocomplete-tipo-nomina'
                      isOptionEqualToValue={(option, value) => option.codigoTipoNomina=== value.codigoTipoNomina}
                      getOptionLabel={option => option.codigoTipoNomina + '-'+option.descripcion}
                      onChange={handleTiposNomina}
                      renderInput={params => <TextField {...params} label='Tipo Nomina' />}
                    />
        </Grid>
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
                  getRowId={(row) => row.codigoDetalleProceso }

                  columns={columns}
                  rows={data}
                  onRowDoubleClick={(row) => handleDoubleClick(row)}

                  />


                </Box>

              }


        </Card>

        <DatePickerWrapper>
              <DialogRhProcesosDetalleInfo  popperPlacement={popperPlacement} />
        </DatePickerWrapper>
    </Grid>


  )
}

export default ProcesosDetalleList

import { Box, Card, CardActions, CardHeader, Grid, IconButton, Tooltip} from '@mui/material'
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

import { IRhProcesosResponseDto } from 'src/interfaces/rh/Procesos/RhProcesosResponseDto';
import { setListProcesos, setOperacionCrudRhProcesos, setRhProcesosSeleccionado, setVerRhProcesosActive } from 'src/store/apps/rh-procesos';
import DialogRhProcesoInfo from './DialogRhProcesoInfo';
import { setListRhConceptos } from 'src/store/apps/rh-conceptos';


const ProcesosList = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'


  const columns = [


    {

      field: 'codigoProceso'
      , headerName: 'Codigo', width: 130

    },
    {

      field: 'descripcion',
      headerName: 'Descripcion',
      width: 430
    },





  ]


  const handleView=  (row : IRhProcesosResponseDto)=>{

    dispatch(setRhProcesosSeleccionado(row))

     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudRhProcesos(2));
    dispatch(setVerRhProcesosActive(true))


  }
  const handleDoubleClick=(row:any)=>{

    handleView(row.row)
}
  const handleAdd=  ()=>{


    const defaultValues = {


      codigoProceso :0,
      descripcion :'',


    }


    dispatch(setRhProcesosSeleccionado(defaultValues));

    // Operacion Crud 1 = Crear presupuesto
    dispatch(setOperacionCrudRhProcesos(1));
    dispatch(setVerRhProcesosActive(true))


  }
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [viewTable, setViewTable] = useState(false);
  const [data, setData] = useState<IRhProcesosResponseDto[]>([])

  const {verRhProcesosActive=false} = useSelector((state: RootState) => state.rhProceso)




  const handleViewTree=()=>{
    setViewTable(false);

  }

  /*const handleViewTable=()=>{
    setViewTable(true);

  }*/
  useEffect(() => {

    const getData = async () => {
      setLoading(true);



      const responseAll= await ossmmasofApi.get<any>('/RhProcesos/GetAllRhProcesoResponseDto');
      const data = responseAll.data;
      setData(responseAll.data.data);
      dispatch(setListProcesos(data));


      const responseAllConceptos= await ossmmasofApi.get<any>('/RhConceptos/GetAll');
      const dataConcepto = responseAllConceptos.data;
      dispatch(setListRhConceptos(dataConcepto));


      setLoading(false);
    };




    getData();



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verRhProcesosActive]);




  return (
    <Grid item xs={12}>
       <Card>
        <CardHeader title='Procesos de Nómina' />

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
                  getRowId={(row) => row.codigoProceso }

                  columns={columns}
                  rows={data}
                  onRowDoubleClick={(row) => handleDoubleClick(row)}

                  />


                </Box>

              }


        </Card>

        <DatePickerWrapper>
              <DialogRhProcesoInfo  popperPlacement={popperPlacement} />
        </DatePickerWrapper>
    </Grid>


  )
}

export default ProcesosList

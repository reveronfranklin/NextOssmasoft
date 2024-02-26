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


import DialogBmConteoInfo from './DialogBmConteoInfo';
import { IBmConteoResponseDto } from 'src/interfaces/Bm/BmConteo/BmConteoResponseDto';
import { setBmConteoSeleccionado, setListBmConteoResponseDto, setListConteoDescriptiva, setListIcp, setListIcpSeleccionado, setOperacionCrudBmConteo, setVerBmConteoActive } from 'src/store/apps/bmConteo';
import { fetchDataPersonasDto } from 'src/store/apps/rh/thunks';
import { ICPGetDto } from 'src/interfaces/Bm/BmConteo/ICPGetDto';


const ConteoList = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'


  const columns = [


    {

      field: 'codigoBmConteo'
      , headerName: 'Id',
       width: 80

    },
    {

      field: 'titulo'
      , headerName: 'titulo',
      width: 330

    },
    {

      field: 'nombrePersonaResponsable',
      headerName: 'Responsable',
      width: 280
    },
    {

      field: 'fechaView'
      , headerName: 'Fecha',
      width: 130

    },
    {

      field: 'totalCantidad'
      , headerName: 'Cantidad',
      width: 100

    },
    {

      field: 'totalCantidadContado'
      , headerName: 'Contado',
      width: 100

    },
    {

      field: 'totalDiferencia'
      , headerName: 'Diferencia',
      width: 100

    },



  ]


  const handleView=  (row : IBmConteoResponseDto)=>{
    console.log(row)
    dispatch(setBmConteoSeleccionado(row))

     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudBmConteo(2));
    dispatch(setVerBmConteoActive(true))


  }

  const handleSet=  (row : IBmConteoResponseDto)=>{


    dispatch(setBmConteoSeleccionado(row))

  }
  const handleDoubleClick=(row:any)=>{

    handleView(row.row)
}
const handleClick=(row:any)=>{

  handleSet(row.row)
}
  const handleAdd=  ()=>{


    const defaultValues = {

        codigoBmConteo :0,
        titulo :'',
        codigoPersonaResponsable:0,
        conteoId:0,
        fecha : null,
        fechaString :'',
        fechaObj: null,
        cantidad:0

    }


    dispatch(setBmConteoSeleccionado(defaultValues));

    // Operacion Crud 1 = Crear presupuesto
    dispatch(setOperacionCrudBmConteo(1));
    dispatch(setVerBmConteoActive(true))


  }
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [viewTable, setViewTable] = useState(false);
  const [data, setData] = useState<IBmConteoResponseDto[]>([])

  const {verBmConteoActive=false} = useSelector((state: RootState) => state.bmConteo)



  const handleViewTree=()=>{
    setViewTable(false);
    refreshData();

  }


  const refreshData = async () => {
    setLoading(true);

    const filterConteo={descripcionId:0,tituloId:7}
    const responseConteos= await ossmmasofApi.post<any>('/BmDescriptivas/GetByTitulo',filterConteo);
    dispatch(setListConteoDescriptiva(responseConteos.data))

    const responseIcps= await ossmmasofApi.get<any>('/Bm1/GetListICP');
    dispatch(setListIcp(responseIcps.data.data))
    console.log('responseIcps.data',responseIcps.data.data)

    const responseAll= await ossmmasofApi.get<any>('/BmConteo/GetAll');
    console.log(responseAll.data)
    const data = responseAll.data.data;
    if(responseAll.data.isValid && responseAll.data.data!=null){
      setData(responseAll.data.data);
      dispatch(setListBmConteoResponseDto(data));

    }else{
      setData([]);
      dispatch(setListBmConteoResponseDto(data));
    }


    setLoading(false);
  };

  /*const handleViewTable=()=>{
    setViewTable(true);

  }*/
  useEffect(() => {

    const getData = async () => {
      setLoading(true);




      const icp: ICPGetDto[]=[{
        codigoIcp: 0,
        unidadTrabajo :  ''
      }]
      dispatch(setListIcpSeleccionado(icp));

      await fetchDataPersonasDto(dispatch);

      const filterConteo={descripcionId:0,tituloId:7}
      const responseConteos= await ossmmasofApi.post<any>('/BmDescriptivas/GetByTitulo',filterConteo);
      dispatch(setListConteoDescriptiva(responseConteos.data))
      const responseAll= await ossmmasofApi.get<any>('/BmConteo/GetAll');
      const data = responseAll.data.data;
      if(responseAll.data.isValid && responseAll.data.data!=null){
        setData(responseAll.data.data);
        dispatch(setListBmConteoResponseDto(data));

      }else{
        setData([]);
        dispatch(setListBmConteoResponseDto(data));
      }


      setLoading(false);
    };

    getData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verBmConteoActive]);




  return (
    <Grid item xs={12}>
       <Card>
        <CardHeader title='Conteos en Proceso' />

        <CardActions>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Agregar'>
            <IconButton  color='primary' size='small' onClick={() => handleAdd()}>
            <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip>

        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Refrescar'>
            <IconButton size='small'  color='primary' onClick={() => handleViewTree()}>
            <Icon icon='fluent:table-24-regular' fontSize={20} />
            </IconButton>
          </Tooltip>

        </Box>


        </CardActions>


              {viewTable
              ?  <div></div>
              :
                loading ?   <Spinner sx={{ height: '100%' }} />
                :
                <Box sx={{ height: 500 }}>
                <DataGrid
                  getRowId={(row) => row.codigoBmConteo }

                  columns={columns}
                  rows={data}
                  onRowDoubleClick={(row) => handleDoubleClick(row)}
                  onRowClick={(row) => handleClick(row)}

                  />


                </Box>

              }


        </Card>

        <DatePickerWrapper>
              <DialogBmConteoInfo  popperPlacement={popperPlacement} />
        </DatePickerWrapper>
    </Grid>


  )
}

export default ConteoList

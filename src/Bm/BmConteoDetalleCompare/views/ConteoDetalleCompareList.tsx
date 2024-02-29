import { Autocomplete, Box, Card, CardActions, CardHeader, Grid, IconButton, TextField, Tooltip} from '@mui/material'
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



import { setBmConteoDetalleSeleccionado, setBmConteoSeleccionado, setListBmConteoDetalleResponseDto, setListBmConteoResponseDto,
        setOperacionCrudBmConteoDetalle, setVerBmConteoDetalleActive } from 'src/store/apps/bmConteo';
import { IBmConteoDetalleResponseDto } from 'src/interfaces/Bm/BmConteoDetalle/BmConteoDetalleResponseDto';
import DialogBmConteoDetalleCompareInfo from './DialogBmConteoDetalleCompareInfo';


const ConteoDetalleCompareList = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'


  const columns = [


    {

      field: 'codigoBmConteoDetalle'
      , headerName: 'Id',
       width: 80

    },
    {

      field: 'unidadTrabajo'
      , headerName: 'Dpto',
       width: 300

    },
    {

      field: 'codigoPlaca'
      , headerName: 'Placa',
      width: 200

    },
    {

      field: 'conteo',
      headerName: 'Conteo',
      width: 80
    },
    {

      field: 'articulo'
      , headerName: 'articulo',
      width: 230

    },
    {

      field: 'cantidad'
      , headerName: 'Cantidad',
      width: 100

    },
    {

      field: 'cantidadContada'
      , headerName: 'Cont. 1',
      width: 100

    },
    {

      field: 'cantidadContadaOtroConteo'
      , headerName: 'Cont. 2',
      width: 100

    },
    {

      field: 'diferencia'
      , headerName: 'Diferencia',
      width: 100

    },



  ]


  const handleView=  (row : IBmConteoDetalleResponseDto)=>{
    console.log('row>>>>',row)
    dispatch(setBmConteoDetalleSeleccionado(row))


     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudBmConteoDetalle(2));
    dispatch(setVerBmConteoDetalleActive(true))


  }

  const handleSet=  (row : IBmConteoDetalleResponseDto)=>{


    dispatch(setBmConteoDetalleSeleccionado(row))

  }
  const handleDoubleClick=(row:any)=>{

    handleView(row.row)
}
const handleClick=(row:any)=>{

  handleSet(row.row)
}

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [viewTable, setViewTable] = useState(false);

  const {bmConteoSeleccionado,listBmConteoResponseDto,listBmConteoDetalleResponseDto} = useSelector((state: RootState) => state.bmConteo)



  const handleViewTree=()=>{
    setViewTable(false);
    refreshData();

  }

  const handleConteo= (e: any,value:any)=>{
    console.log('handler tipo nomina',value)
    if(value!=null){
      dispatch(setBmConteoSeleccionado(value))
    }else{
      dispatch(setBmConteoSeleccionado({}))

    }
    refreshData();



  }
  const refreshData = async () => {
    setLoading(true);


    if(bmConteoSeleccionado && bmConteoSeleccionado.codigoBmConteo>0){
      const filter={codigoBmConteo:bmConteoSeleccionado.codigoBmConteo}

      const responseAll= await ossmmasofApi.post<any>('/BmConteoDetalle/GetAllByConteoComparar',filter);
      const data = responseAll.data.data;
      if(responseAll.data.isValid && responseAll.data.data!=null){
        console.log('data detalle',data)

        dispatch(setListBmConteoDetalleResponseDto(data));

      }else{

        dispatch(setListBmConteoDetalleResponseDto(data));
      }
    }





    setLoading(false);
  };

  /*const handleViewTable=()=>{
    setViewTable(true);

  }*/
  useEffect(() => {

    const getData = async () => {
      setLoading(true);



      const responseAllConteo= await ossmmasofApi.get<any>('/BmConteo/GetAll');
      const dataConteo = responseAllConteo.data.data;
      if(responseAllConteo.data.isValid && responseAllConteo.data.data!=null){
        dispatch(setListBmConteoResponseDto(dataConteo));

        dispatch(setBmConteoSeleccionado(dataConteo[0]))

      }else{

        dispatch(setListBmConteoResponseDto(dataConteo));
      }


      if(bmConteoSeleccionado && bmConteoSeleccionado.codigoBmConteo>0){

        const filter={codigoBmConteo:bmConteoSeleccionado.codigoBmConteo}

        const responseAll= await ossmmasofApi.post<any>('/BmConteoDetalle/GetAllByConteoComparar',filter);
        const data = responseAll.data.data;
        if(responseAll.data.isValid && responseAll.data.data!=null){
          console.log('data detalle',data)

          dispatch(setListBmConteoDetalleResponseDto(data));

        }else{

          dispatch(setListBmConteoDetalleResponseDto(data));
        }
      }



      setLoading(false);
    };

    getData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);




  return (
    <Grid item xs={12}>
       <Card>
        <CardHeader title='Compara Conteos en Proceso' />

        <CardActions>


        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Refrescar'>
            <IconButton size='small'  color='primary' onClick={() => handleViewTree()}>
            <Icon icon='fluent:table-24-regular' fontSize={20} />
            </IconButton>
          </Tooltip>

        </Box>

        <div>

            {listBmConteoResponseDto ?
                ( <Autocomplete

                  sx={{ width: 550 }}
                  options={listBmConteoResponseDto}
                  id='autocomplete-conteo'
                  isOptionEqualToValue={(option, value) => option.codigoBmConteo=== value.codigoBmConteo}
                  getOptionLabel={option => option.codigoBmConteo + '-'+option.titulo}
                  onChange={handleConteo}
                  renderInput={params => <TextField {...params} label='Conteo' />}
                /> ) : <div></div>
            }
            </div>
        </CardActions>


              {viewTable
              ?  <div></div>
              :
                loading ?   <Spinner sx={{ height: '100%' }} />
                :
                <Box sx={{ height: 500 }}>
                <DataGrid
                  getRowId={(row) => row.codigoBmConteoDetalle }

                  columns={columns}
                  rows={listBmConteoDetalleResponseDto}
                  onRowDoubleClick={(row) => handleDoubleClick(row)}
                  onRowClick={(row) => handleClick(row)}

                  />


                </Box>

              }


        </Card>

        <DatePickerWrapper>
              <DialogBmConteoDetalleCompareInfo  popperPlacement={popperPlacement} />
        </DatePickerWrapper>
    </Grid>


  )
}

export default ConteoDetalleCompareList

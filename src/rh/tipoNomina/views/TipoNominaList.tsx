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


import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva';

import { IRhTiposNominaResponseDto } from 'src/interfaces/rh/TipoNomina/RhTiposNominaResponseDto';
import { setListRhFrecuencia, setListRhTipoNomina, setOperacionCrudRhTipoNomina, setRhTipoNominaSeleccionado, setVerRhTipoNominaActive } from 'src/store/apps/rh-tipoNomina';
import DialogRhTipoNominaInfo from './DialogRhTipoNominaInfo';


const TipoNominaList = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'


  const columns = [


    {

      field: 'codigoTipoNomina'
      , headerName: 'Codigo', width: 130

    },
    {

      field: 'descripcion',
      headerName: 'Decripcion',
      width: 430
    },
    {

      field: 'siglasTipoNomina',
      headerName: 'Siglas',
      width: 230
    },
    {

      field: 'frecuenciaPago',
      headerName: 'Frecuencia',
      width: 130
    },
    {

      field: 'sueldoMinimo',
      headerName: 'Sueldo Minimo',
      width: 130
    },




  ]


  const handleView=  (row : IRhTiposNominaResponseDto)=>{

    dispatch(setRhTipoNominaSeleccionado(row))

     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudRhTipoNomina(2));
    dispatch(setVerRhTipoNominaActive(true))


  }
  const handleDoubleClick=(row:any)=>{

    handleView(row.row)
}
  const handleAdd=  ()=>{


    const defaultValues = {


      codigoTipoNomina :0,
      descripcion :'',
      siglasTipoNomina :'',
      frecuenciaPagoId :0,
      frecuenciaPago:'',
      sueldoMinimo :0,

    }


    dispatch(setRhTipoNominaSeleccionado(defaultValues));

    // Operacion Crud 1 = Crear presupuesto
    dispatch(setOperacionCrudRhTipoNomina(1));
    dispatch(setVerRhTipoNominaActive(true))


  }
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [viewTable, setViewTable] = useState(false);
  const [data, setData] = useState<IRhTiposNominaResponseDto[]>([])

  const {verRhTipoNominaActive=false} = useSelector((state: RootState) => state.rhTipoNomina)




  const handleViewTree=()=>{
    setViewTable(false);

  }

  /*const handleViewTable=()=>{
    setViewTable(true);

  }*/
  useEffect(() => {

    const getData = async () => {
      setLoading(true);

      const filterFrecuencia={descripcionId:0,tituloId:38}
      const responseTipoCuenta= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterFrecuencia);
      dispatch(setListRhFrecuencia(responseTipoCuenta.data))


      const responseAll= await ossmmasofApi.get<any>('/RhTipoNomina/GetAll');
      const data = responseAll.data;
      console.log('data conceptos',data)
      setData(responseAll.data);
      dispatch(setListRhTipoNomina(data));


      setLoading(false);
    };




    getData();



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verRhTipoNominaActive]);




  return (
    <Grid item xs={12}>
       <Card>
        <CardHeader title='Tipo de Nómina' />

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
                  getRowId={(row) => row.codigoTipoNomina }

                  columns={columns}
                  rows={data}
                  onRowDoubleClick={(row) => handleDoubleClick(row)}

                  />


                </Box>

              }


        </Card>

        <DatePickerWrapper>
              <DialogRhTipoNominaInfo  popperPlacement={popperPlacement} />
        </DatePickerWrapper>
    </Grid>


  )
}

export default TipoNominaList

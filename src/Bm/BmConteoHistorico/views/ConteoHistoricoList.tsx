import {  Box, Card, CardActions, CardHeader, Grid, IconButton, Tooltip} from '@mui/material'
import React, { useEffect, useState } from 'react'

//import { ReactDatePickerProps } from 'react-datepicker'
import { ReactDatePickerProps } from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { DataGrid  } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles'


import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import Spinner from 'src/@core/components/spinner';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';



import DialogBmConteoHistoricoInfo from './DialogBmConteoHistoricoInfo';
import { IBmConteoHistoricoResponseDto } from 'src/interfaces/Bm/BmConteoHistorico/BmConteoHistoricoResponseDto';
import DialogReportInfo from 'src/share/components/Reports/views/DialogReportInfo';

import { setReportName, setVerReportViewActive } from 'src/store/apps/report';
import { useDispatch } from 'react-redux';


const ConteoHistoricoList = () => {
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

      field: 'totalCantidadContada'
      , headerName: 'Contado',
      width: 100

    },
    {

      field: 'totalDiferencia'
      , headerName: 'Diferencia',
      width: 100

    },



  ]

  const dispatch = useDispatch();


  const getReport = async (row:IBmConteoHistoricoResponseDto) => {
    setLoading(true);

     const fileName = row.codigoBmConteo+".pdf";
     console.log(fileName);

    dispatch(setReportName(fileName));
    dispatch(setVerReportViewActive(true))

    setLoading(false);
  };

  const handleView=  (row : IBmConteoHistoricoResponseDto)=>{
    console.log('row>>>>',row)



  }

  const handleSet=  (row : IBmConteoHistoricoResponseDto)=>{


   console.log(row)

   getReport(row);

  }
  const handleDoubleClick=(row:any)=>{

    handleView(row.row)
}
const handleClick=(row:any)=>{

  handleSet(row.row)
}



  const [loading, setLoading] = useState(false);
  const [viewTable, setViewTable] = useState(false);
  const [listConteo, setListConteo] = useState<IBmConteoHistoricoResponseDto[]>([]);

  //const [conteo, setConteo] = useState<IBmConteoHistoricoResponseDto>({});


  const handleViewTree=()=>{
    setViewTable(false);
    refreshData();

  }


  const refreshData = async () => {
    setLoading(true);


    const responseAllConteo= await ossmmasofApi.get<any>('/BmConteoHistorico/GetAll');
    const dataConteo = responseAllConteo.data.data;
    if(responseAllConteo.data.isValid && responseAllConteo.data.data!=null){
      setListConteo(dataConteo);

    }else{

      setListConteo([]);
    }





    setLoading(false);
  };

  /*const handleViewTable=()=>{
    setViewTable(true);

  }*/
  useEffect(() => {

    const getData = async () => {
      setLoading(true);



      const responseAllConteo= await ossmmasofApi.get<any>('/BmConteoHistorico/GetAll');
      const dataConteo = responseAllConteo.data.data;
      if(responseAllConteo.data.isValid && responseAllConteo.data.data!=null){
        setListConteo(dataConteo);

      }else{

        setListConteo([]);
      }




      setLoading(false);
    };

    getData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);




  return (
    <Grid item xs={12}>
       <Card>
        <CardHeader title='Detalle de Conteos Historico' />

        <CardActions>


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
                  rows={listConteo}
                  onRowDoubleClick={(row) => handleDoubleClick(row)}
                  onRowClick={(row) => handleClick(row)}

                  />


                </Box>

              }


        </Card>
        <DialogReportInfo></DialogReportInfo>
        <DatePickerWrapper>
              <DialogBmConteoHistoricoInfo  popperPlacement={popperPlacement} />
        </DatePickerWrapper>
    </Grid>


  )
}

export default ConteoHistoricoList

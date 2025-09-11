import { Box, Card, CardActions, CardHeader, Grid, IconButton, Tooltip, Alert, AlertTitle } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ReactDatePickerProps } from 'react-datepicker'
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
import { getReportUrl } from 'src/utilities/get-report-url';

const ConteoHistoricoList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [viewTable, setViewTable] = useState(false);
  const [listConteo, setListConteo] = useState<IBmConteoHistoricoResponseDto[]>([]);

  const dispatch = useDispatch();

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const columns = [
    { field: 'codigoBmConteo',           headerName: 'Id',          width: 80 },
    { field: 'titulo',                   headerName: 'titulo',      width: 330 },
    { field: 'nombrePersonaResponsable', headerName: 'Responsable', width: 280 },
    { field: 'fechaView',                headerName: 'Fecha',       width: 130 },
    { field: 'totalCantidad',            headerName: 'Cantidad',    width: 100 },
    { field: 'totalCantidadContada',     headerName: 'Contado',     width: 100 },
    { field: 'totalDiferencia',          headerName: 'Diferencia',  width: 100 },
  ]

  const getReport = async (row:IBmConteoHistoricoResponseDto) => {
    const fileName = await createConteoHistoricoReport(row)

    if (!fileName) {
      setError('no se obtuvo un nombre de reporte')

      return
    }

    const reportFullUrl = getReportUrl(`Files/GetPdfFiles/${fileName}`)

    if (!reportFullUrl) {
      setError('no se pudo obtener la url')

      return
    }

    dispatch(setReportName(reportFullUrl))
    dispatch(setVerReportViewActive(true))
  }

  const createConteoHistoricoReport = async (row: IBmConteoHistoricoResponseDto): Promise<string | null> => {
    try {
      const response = await ossmmasofApi.post(
        '/BmConteoHistorico/CreateReportConteoHistorico',
        { CodigoBmConteo: row.codigoBmConteo }
      )

      if (response.data.isValid && response.data.data) {
        return response.data.data
      } else {
        console.error('Error initiating report creation:', response.data.message);

        return null
      }
    } catch (error) {
      console.error('API call failed:', error);

      return null
    }
  }

  const handleSet=  (row : IBmConteoHistoricoResponseDto)=>{
    getReport(row);
  }

  const handleClick= (row: any) => {
    handleSet(row.row)
  }

  const handleViewTree = () =>{
    setViewTable(false);
    refreshData();
  }

  const refreshData = async () => {
    setLoading(true);

    const responseAllConteo = await ossmmasofApi.get<any>('/BmConteoHistorico/GetAll');
    const dataConteo = responseAllConteo.data.data;

    if (responseAllConteo.data.isValid && responseAllConteo.data.data!=null) {
      setListConteo(dataConteo);
    } else {
      setListConteo([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    const getData = async () => {
      const responseAllConteo = await ossmmasofApi.get<any>('/BmConteoHistorico/GetAll');
      responseAllConteo.data.isValid && responseAllConteo.data.data != null ? setListConteo(responseAllConteo.data.data) : setListConteo([]);
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
          {error && (
            <Alert severity='error' sx={{ m: 4 }}>
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}

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

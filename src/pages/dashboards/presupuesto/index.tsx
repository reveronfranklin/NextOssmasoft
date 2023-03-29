'use client'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import EcommerceTable from 'src/views/dashboards/ecommerce/EcommerceTable'
import EcommerceTotalProfit from 'src/views/dashboards/ecommerce/EcommerceTotalProfit'
import EcommerceNewVisitors from 'src/views/dashboards/ecommerce/EcommerceNewVisitors'
import EcommerceTotalRevenue from 'src/views/dashboards/ecommerce/EcommerceTotalRevenue'
import EcommerceTransactions from 'src/views/dashboards/ecommerce/EcommerceTransactions'
import EcommerceTotalSalesDonut from 'src/views/dashboards/ecommerce/EcommerceTotalSalesDonut'
import EcommerceMeetingSchedule from 'src/views/dashboards/ecommerce/EcommerceMeetingSchedule'
import EcommerceTotalSalesRadial from 'src/views/dashboards/ecommerce/EcommerceTotalSalesRadial'
import EcommerceWebsiteStatistics from 'src/views/dashboards/ecommerce/EcommerceWebsiteStatistics'
import PresupuestoCongratulations from 'src/views/dashboards/presupuesto/PresupuestoCongratulations'
import { useEffect, useState } from 'react';

import { fetchData } from '../../../store/apps/presupuesto/thunks';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, CardHeader, InputLabel, MenuItem, Select } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import { SelectChangeEvent } from '@mui/material/Select';
import { RootState } from 'src/store'

import { setPresupuesto, setPreDenominacionPuc, setPreDenominacionPucResumen } from 'src/store/apps/presupuesto';

//import PresupuestoTransactions from 'src/views/dashboards/presupuesto/PresupuestoTransactions'
import { IPresupuesto } from 'src/interfaces/Presupuesto/i-presupuesto'
import { DataGrid } from '@mui/x-data-grid'


const columnsDenominacion = [

  {

    field: 'codigoPUC',
    headerName:'PUC',
    width: 180

  },

  {

    field: 'denominacionPuc',
    headerName:'Denominacion',
    width: 380

  },

  {

    field: 'presupuestadoString',
    headerName:'Presupuestado',

    width: 180

  },
  {

    field: 'disponibilidadString',
    headerName:'Disponibilidad',

    width: 180

  },
  {

    field: 'disponibilidadFinanString',
    headerName:'Disponibilidad Finan',

    width: 180

  },




]

const EcommerceDashboard = () => {


  const dispatch = useDispatch();

  const {presupuestos=[],presupuestoSeleccionado,preDenominacionPucResumen=[]} = useSelector((state: RootState) => state.presupuesto)

  const [status, setStatus] = useState<IPresupuesto>(presupuestos[0]);


//e: SelectChangeEvent

  const handlePresupuestoValue =(e: SelectChangeEvent)=>{

    const seleccionado = presupuestos.filter( pre => pre.codigoPresupuesto==e.target.value);
    setStatus(seleccionado[0]);

    if(seleccionado.length>0){
     dispatch(setPresupuesto(seleccionado[0]));
     if(seleccionado[0].preDenominacionPuc!= null && seleccionado[0].preDenominacionPuc.length>0){
      //setDenominacionPuc(seleccionado[0].preDenominacionPuc);
      dispatch(setPreDenominacionPuc(seleccionado[0].preDenominacionPuc));
      dispatch(setPreDenominacionPucResumen(seleccionado[0].preDenominacionPucResumen));

     }else{
      dispatch(setPreDenominacionPuc([]));
      dispatch(setPreDenominacionPucResumen([]));
     }

    }



  }


useEffect(() => {

  const getPresupuestos = async () => {
    await fetchData(dispatch);
  };
   getPresupuestos();



}, [dispatch]);

  if(presupuestos && presupuestos.length>0 ){
    return (
      <ApexChartWrapper>
        <Grid container spacing={6}>

          <Grid item xs={12}>
            <Card>
              <CardHeader title='Filters' />
              <CardContent>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id='invoice-status-select'>Presupuesto</InputLabel>

                      <Select
                        fullWidth
                        id="status-helper"
                        value={status?.codigoPresupuesto}
                        sx={{ mr: 4, mb: 2 }}
                        label='Invoice Status'
                        onChange={handlePresupuestoValue}
                        labelId='invoice-status-select'
                      >
                        {
                         presupuestos?.map(pre=>(
                            <MenuItem key={pre.codigoPresupuesto} value={pre.codigoPresupuesto ?? 0}>{pre.denominacion}</MenuItem>
                          ))
                        }



                      </Select>
                    </FormControl>
                  </Grid>

                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8} sx={{ order: 0, alignSelf: 'flex-end' }}>
            <PresupuestoCongratulations />
          </Grid>

          <Grid item xs={12} sm={6} md={2} sx={{ order: 0 }}>
            <CardStatisticsVerticalComponent
              stats={presupuestoSeleccionado?.totalPresupuestoString }
              color='info'
              trendNumber='+38%'
              title='Presupuestado'
              subtitle='Presupuestado Periodo'
              icon={<Icon icon='mdi:trending-up' />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2} sx={{ order: 0 }}>
            <CardStatisticsVerticalComponent
              stats={presupuestoSeleccionado?.totalDisponibleString}
              color='success'
              title='Disponible'
              trendNumber='+16%'
              subtitle='Presupuesto  Disponible'
              icon={<Icon icon='mdi:currency-usd' />}
            />
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardHeader title='Resumen Denominacion PUC' />

              {
                preDenominacionPucResumen.length<=0
                ? <h1>No data</h1>
                :
                <Box sx={{ height: 500 }}>
                  <DataGrid
                  getRowId={(row) => row.denominacionPuc}
                  columns={columnsDenominacion}
                  rows={preDenominacionPucResumen} />
                </Box>
              }

            </Card>
        </Grid>

          <Grid item xs={12} md={8} sx={{ order: 0 }}>
            <EcommerceTotalProfit />
          </Grid>
          <Grid item xs={12} md={4} sx={{ order: 0 }}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <EcommerceTotalSalesDonut />
              </Grid>
              <Grid item xs={12} sm={6}>
                <EcommerceTotalRevenue />
              </Grid>
              <Grid item xs={12} sm={6}>
                <EcommerceTotalSalesRadial />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ order: 0 }}>
            <EcommerceTransactions />
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ order: 0 }}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <CardStatisticsVerticalComponent
                  stats='4.1k'
                  color='error'
                  title='Logistics'
                  trendNumber='+25%'
                  subtitle='Regional Logistics'
                  icon={<Icon icon='mdi:truck-outline' />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CardStatisticsVerticalComponent
                  stats='268'
                  color='warning'
                  title='Reports'
                  trend='negative'
                  trendNumber='-8%'
                  subtitle='System Bugs'
                  icon={<Icon icon='mdi:check' />}
                />
              </Grid>
              <Grid item xs={12}>
                <EcommerceNewVisitors />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ order: 0 }}>
            <EcommerceWebsiteStatistics />
          </Grid>
          <Grid item xs={12} lg={8} sx={{ order: [1, 1, 1, 0] }}>
            <EcommerceTable />
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ order: 0 }}>
            <EcommerceMeetingSchedule />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    )
  }else{
    <Grid item xs={12} md={8} sx={{ order: 0, alignSelf: 'flex-end' }}>
    <PresupuestoCongratulations />
  </Grid>
  }

}

export default EcommerceDashboard

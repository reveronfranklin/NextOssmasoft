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


import { useEffect, useState } from 'react';

import { fetchDataPost } from '../../../store/apps/presupuesto/thunks';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, CardHeader} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import { RootState } from 'src/store'

//import PresupuestoTransactions from 'src/views/dashboards/presupuesto/PresupuestoTransactions'

import { DataGrid, GridColumns } from '@mui/x-data-grid'

import { FilterPrePresupuestoDto } from 'src/interfaces/Presupuesto/i-filter-by-presupuesto-dto'
import FilterPresupuestoFinanciado from 'src/views/forms/form-elements/presupuesto/FilterPresupuestoFinanciado'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Spinner from 'src/@core/components/spinner';
import { IPreDenominacionPucResumen } from 'src/interfaces/Presupuesto/i-pre-denominacion-puc'


const columnsDenominacion:GridColumns<IPreDenominacionPucResumen> = [

  {

    field: 'codigoPUC',
    headerName:'PUC',
    width: 180,
    align:'left'

  },

  {

    field: 'denominacionPuc',
    headerName:'Denominacion',
    width: 380,
    align:'left'
  },

  {

    field: 'presupuestadoString',
    headerName:'Presupuestado',
    align:'right',
    width: 180

  },
  {

    field: 'modificadoString',
    headerName:'Modificado',
    align:'right',
    width: 180

  },
  {

    field: 'vigenteString',
    headerName:'Vigente',
    align:'right',
    width: 180

  },
  {

    field: 'disponibilidadString',
    headerName:'Disponibilidad',
    align:'right',
    width: 180

  },





]

const EcommerceDashboard = () => {


  const dispatch = useDispatch();

  const {presupuestoSeleccionado,preDenominacionPucResumen=[],preFinanciadoDtoSeleccionado,listpresupuestoDtoSeleccionado} = useSelector((state: RootState) => state.presupuesto)
  const {fechaDesde,fechaHasta} = useSelector((state: RootState) => state.ossmmasofGlobal)
  const [loading, setLoading] = useState(false)




useEffect(() => {

  const getPresupuestos = async () => {

    const filter: FilterPrePresupuestoDto={
      codigoPresupuesto: 0,
      searchText : '',
      codigoEmpresa: 0,
      financiadoId:0,
      fechaDesde,
      fechaHasta
    }

    if(preFinanciadoDtoSeleccionado.financiadoId){

      filter.financiadoId=preFinanciadoDtoSeleccionado.financiadoId;
    }
    if(listpresupuestoDtoSeleccionado.codigoPresupuesto){

      filter.codigoPresupuesto=listpresupuestoDtoSeleccionado.codigoPresupuesto;
    }


    setLoading(true);
    await fetchDataPost(dispatch,filter);
    setLoading(false);

  };
  getPresupuestos();



// eslint-disable-next-line react-hooks/exhaustive-deps
}, [listpresupuestoDtoSeleccionado,preFinanciadoDtoSeleccionado,fechaDesde,fechaHasta]);


    return (

      <ApexChartWrapper>
        <Grid item xs={12}>

            <CardContent     title='Filter' >
            <DatePickerWrapper>
              <FilterPresupuestoFinanciado />
            </DatePickerWrapper>

            </CardContent>
        </Grid>


        { loading  ? (
       <Spinner sx={{ height: '100%' }} />
      ) : (
        <Grid container spacing={6}>


        {/* <Grid item xs={12} md={8} sx={{ order: 0, alignSelf: 'flex-end' }}>
          <PresupuestoCongratulations />
        </Grid> */}
        <Grid item xs={12} sm={6} md={3} sx={{ order: 0 }}>
          <CardStatisticsVerticalComponent
            stats={presupuestoSeleccionado?.totalPresupuestoString }
            color='info'
            trendNumber=''
            title='Presupuestado'
            subtitle='Presupuestado Anual'
            icon={<Icon icon='mdi:trending-up' />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ order: 0 }}>
          <CardStatisticsVerticalComponent
            stats={presupuestoSeleccionado?.totalModificacionString }
            color='info'

            trendNumber=''
            title='Modificacion'
            subtitle='Modificacion Presupuestaria'
            icon={<Icon icon='mdi:trending-up' />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ order: 0 }}>
          <CardStatisticsVerticalComponent
            stats={presupuestoSeleccionado?.totalVigenteString }
            color='info'
            trendNumber=''
            title='Vigente'
            subtitle='Presupuestado Vigente'
            icon={<Icon icon='mdi:trending-up' />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ order: 0 }}>
          <CardStatisticsVerticalComponent
            stats={presupuestoSeleccionado?.totalDisponibleString}
            color='success'
            title='Disponibilidad'
            trendNumber=''
            subtitle='Presupuesto  Disponible'
            icon={<Icon icon='mdi:currency-usd' />}
          />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title='Resumen Denominacion PUC' />

            {
              !preDenominacionPucResumen
              ? <h1>No data</h1>
              :
              <Box sx={{ height: 500 }}>
                <DataGrid
                rowsPerPageOptions={[10,20,50,100]}
                pageSize={100}

                pagination
                getRowId={(row) => row.denominacionPuc}
                columns={columnsDenominacion}
                rows={preDenominacionPucResumen} />
              </Box>
            }

          </Card>
      </Grid>

      </Grid>
      )}


      </ApexChartWrapper>
    )

}

export default EcommerceDashboard

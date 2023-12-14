import { Box, Card, CardActions, CardHeader, Grid, IconButton, Tooltip, Typography} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ReactDatePickerProps } from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles'

//import { usePresupuesto } from 'src/hooks/usePresupuesto';


import { useDispatch } from 'react-redux';
import { IPresupuesto } from 'src/interfaces/Presupuesto/i-presupuesto';
import { setOperacionCrudPresupuesto, setPresupuesto, setVerPresupuestoActive } from 'src/store/apps/presupuesto';

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import Spinner from 'src/@core/components/spinner';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import dayjs from 'dayjs';
import DialogPrePresupuestoInfo from 'src/presupuesto/maestro/views/DialogPrePresupuestoInfo';
import { IFechaDto } from 'src/interfaces/fecha-dto';
import { monthByIndex } from 'src/utilities/ge-date-by-object';




const PresupuestoList = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const fechaActual = new Date()

  const currentYear  = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const currentMonthString ='00' + monthByIndex(currentMonth).toString();

  const currentDay =new Date().getDate();
  const currentDayString = '00' + currentDay.toString();
  const defaultDate :IFechaDto = {year:currentYear.toString(),month:currentMonthString.slice(-2),day:currentDayString.slice(-2)}
  const defaultDateString = fechaActual.toISOString();

  console.log(monthByIndex(currentMonth))

  const columns = [


    {

      field: 'codigoPresupuesto'
      , headerName: 'Codigo', width: 130

    },
    {

      field: 'denominacion',
      width: 430

    },

    {
      headerName:'',
      field: 'ano',
      width: 100
    },



    {
     with:100,
      headerName: 'Desde',
      field: 'fechaDesde',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.fechaDesde).format('DD/MM/YYYY') }
        </Typography>
      )
    },
    {
      with:100,
      headerName: 'Hasta',
      field: 'fechaHasta',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dayjs(params.row.fechaHasta).format('DD/MM/YYYY') }
        </Typography>
      )
    },



  ]

  const handleView=  (row : IPresupuesto)=>{

    dispatch(setPresupuesto(row))

     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudPresupuesto(2));
    dispatch(setVerPresupuestoActive(true))


  }
  const handleDoubleClick=(row:any)=>{

    handleView(row.row)
}
  const handleAdd=  ()=>{


    const defaultValues = {
      codigoPresupuesto: 0,
      denominacion:'',
      descripcion:'',
      ano:0,
      numeroOrdenanza:'',
      extra1:'',
      extra2:'',
      extra3:'',
      fechaDesde:fechaActual,
      fechaDesdeString:defaultDateString,
      fechaDesdeObj:defaultDate,
      fechaHasta:fechaActual,
      fechaHastaString:defaultDateString,
      fechaHastaObj :defaultDate,
      fechaOrdenanza :fechaActual,
      fechaOrdenanzaString :defaultDateString,
      fechaOrdenanzaObj :defaultDate,
      fechaAprobacion :fechaActual,
      fechaAprobacionString :defaultDateString,
      fechaAprobacionObj :defaultDate

    }


    dispatch(setPresupuesto(defaultValues));

    // Operacion Crud 1 = Crear presupuesto
    dispatch(setOperacionCrudPresupuesto(1));
    dispatch(setVerPresupuestoActive(true))


  }

  const dispatch = useDispatch();

  // {presupuestos,isLoading,isError }= usePresupuesto('/PrePresupuesto/GetAll');
  const {verPresupuestoActive=false} = useSelector((state: RootState) => state.presupuesto)
  const [loading, setLoading] = useState(false);

  const [presupuestos, setPresupuestos] = useState([]);

  useEffect(() => {

    const getPresupuestos = async () => {
      setLoading(true);

      const responseAll= await ossmmasofApi.get<any>('/PrePresupuesto/GetList');
      const data = responseAll.data;

      setPresupuestos(data);

      setLoading(false);
    };
     getPresupuestos();



  }, [verPresupuestoActive]);




  return (
    <Grid item xs={12}>
       <Card>
      <CardHeader title='Maestro de Presupuesto' />

      <CardActions>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Agregar'>
            <IconButton  color='primary' size='small' onClick={() => handleAdd()}>
            <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip>

        </Box>
      </CardActions>


      {
        loading
        ?   <Spinner sx={{ height: '100%' }} />
        :
         <Box sx={{ height: 500 }}>
          <DataGrid
           getRowId={(row) => row.codigoPresupuesto}
           columns={columns}
           rows={presupuestos}
           onRowDoubleClick={(row) => handleDoubleClick(row)}
           />
        </Box>

      }
      <DatePickerWrapper>
        <DialogPrePresupuestoInfo  popperPlacement={popperPlacement} />
      </DatePickerWrapper>

    </Card>
    </Grid>


  )
}

export default PresupuestoList

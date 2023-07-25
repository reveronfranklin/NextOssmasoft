import { Box, Button, Card, CardActions, CardHeader, Grid, IconButton, Tooltip} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ReactDatePickerProps } from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles'

//import { usePresupuesto } from 'src/hooks/usePresupuesto';


import { useDispatch } from 'react-redux';
import { IPresupuesto } from 'src/interfaces/Presupuesto/i-presupuesto';
import { setOperacionCrudPresupuesto, setPresupuesto, setVerPresupuestoActive } from 'src/store/apps/presupuesto';
import DialogPrePresupuestoInfo from 'src/views/pages/presupuesto/Maestro/DialogPrePresupuestoInfo';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import Spinner from 'src/@core/components/spinner';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';


interface CellType {
  row: IPresupuesto
}

const PresupuestoList = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const columns = [
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='View'>
            <IconButton size='small' onClick={() => handleView(row)}>
            <Icon icon='mdi:eye-outline' fontSize={20} />
            </IconButton>
          </Tooltip>

        </Box>
      )
    },

    {

      field: 'codigoPresupuesto'
      , headerName: 'Codigo', width: 130

    },
    {

      field: 'denominacion',
      width: 330

    },
    {

      field: 'descripcion',
      width: 100
    },
    {

      field: 'ano',
      width: 100
    },


    {

      field: 'fechaDesde',
      headerName:'Desde',
      width: 130
    },
    {

      field: 'fechaHasta',
      headerName:'Hasta',
      width: 130
    },
    {

      field: 'montoPresupuesto',
      headerName:'Monto'

    }


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

    //dispatch(setPresupuesto(row))
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
        <Button size="small"  onClick={() => handleAdd()}>Agregar</Button>

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

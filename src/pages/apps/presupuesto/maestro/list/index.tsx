import { Box, Card, CardHeader, Grid} from '@mui/material'
import React, { useEffect } from 'react'



import { DataGrid } from '@mui/x-data-grid';

//import { usePresupuesto } from 'src/hooks/usePresupuesto';

import { useSelector } from 'react-redux';
import { RootState } from 'src/store'
import { useDispatch } from 'react-redux';
import { fetchData } from 'src/store/apps/presupuesto/thunks';

const columns = [
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

  },


]
const PresupuestoList = () => {

  const dispatch = useDispatch();

  // {presupuestos,isLoading,isError }= usePresupuesto('/PrePresupuesto/GetAll');
  const {presupuestos=[]} = useSelector((state: RootState) => state.presupuesto)

  useEffect(() => {

    const getPresupuestos = async () => {
      await fetchData(dispatch);
    };
     getPresupuestos();



  }, [dispatch]);




  return (
    <Grid item xs={12}>
       <Card>
      <CardHeader title='Maestro de Presupuesto' />


      {
        presupuestos.length<=0
        ? <h1>Cargando....</h1>
        :
         <Box sx={{ height: 500 }}>
          <DataGrid
           getRowId={(row) => row.codigoPresupuesto}
           columns={columns}
           rows={presupuestos} />
        </Box>
      }

    </Card>
    </Grid>


  )
}

export default PresupuestoList

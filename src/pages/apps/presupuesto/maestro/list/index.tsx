import { Box, Card, CardHeader} from '@mui/material'
import React from 'react'



import { DataGrid } from '@mui/x-data-grid';
import { usePresupuesto } from 'src/hooks/usePresupuesto';

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

  const {presupuestos,isLoading,isError }= usePresupuesto('/PrePresupuesto/GetAll');



  return (
    <Card>
      <CardHeader title='Maestro de Presupuesto' />
      {
        isError ?
        <h1>Error al cargar</h1>
        : ''
      }
      {
        isLoading && !isError
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
  )
}

export default PresupuestoList

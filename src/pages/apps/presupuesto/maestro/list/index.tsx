import { Box, Card, CardHeader} from '@mui/material'
import React from 'react'


import useSWR from "swr";
import { DataGrid } from '@mui/x-data-grid';

const fetcher = (...args:[key:string] ) => fetch(...args).then(res => res.json());
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

  const { data, error } = useSWR("http://localhost:46196/api/PrePresupuesto/GetAll", fetcher);

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <Card>
      <CardHeader title='Maestro de Presupuesto' />
      <Box sx={{ height: 500 }}>
        <DataGrid
          getRowId={(row) => row.codigoPresupuesto}
          columns={columns}
          rows={data.data} />
      </Box>
    </Card>
  )
}

export default PresupuestoList

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'

// ** Data Import


import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import { Typography } from '@mui/material'

const columns = [
  {
    flex: 0.90,
    field: 'descripcionFinanciado',
    minWidth: 80,
    headerName: 'Financiado',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' ,fontSize: 10}}>
        {params.row.descripcionFinanciado}
      </Typography>
    )
  },
  {
    flex: 0.50,
    minWidth: 120,
    field: 'presupuestadoFormat',
    headerName: 'Presupuestado',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' ,fontSize: 10}}>
        {params.row.presupuestadoFormat}
      </Typography>
    )
  },
  {
    flex: 0.50,
    minWidth: 120,
    field: 'asignacionFormat',
    headerName: 'Asignacion',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' ,fontSize: 10}}>
        {params.row.asignacionFormat}
      </Typography>
    )
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: 'modificadoFormat',
    headerName: 'Modificado',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary',fontSize: 10 }}>
        {params.row.modificadoFormat}
      </Typography>
    )
  }
  ,
  {
    flex: 0.15,
    minWidth: 120,
    field: 'bloqueadoFormat',
    headerName: 'Bloqueado',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' ,fontSize: 10}}>
        {params.row.bloqueadoFormat}
      </Typography>
    )
  }
  ,
  {
    flex: 0.15,
    minWidth: 120,
    field: 'comprometidoFormat',
    headerName: 'Comprometido',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' ,fontSize: 10}}>
        {params.row.comprometidoFormat}
      </Typography>
    )

  }
  ,
  {
    flex: 0.15,
    minWidth: 120,
    field: 'causadoFormat',
    headerName: 'Causado',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' ,fontSize: 10}}>
        {params.row.causadoFormat}
      </Typography>
    )
  }
  ,
  {
    flex: 0.15,
    minWidth: 120,
    field: 'pagadoFormat',
    headerName: 'Pagado',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' ,fontSize: 10}}>
        {params.row.pagadoFormat}
      </Typography>
    )
  }

]

const TableBasicPreVSaldoPorPartida = () => {
  const {preDetalleSaldoPorPartida} = useSelector((state: RootState) => state.presupuesto)


  return (
    <Card>
      <CardHeader title={"Documentos"}/>
      <Box sx={{ height: 500 }}>
        <DataGrid
          columns={columns} rows={preDetalleSaldoPorPartida}
           getRowHeight={() => 'auto'}
           getRowId={(row) => row.id}

           />
      </Box>
    </Card>
  )
}

export default TableBasicPreVSaldoPorPartida

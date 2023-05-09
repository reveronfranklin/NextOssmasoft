// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'

// ** Data Import


import { RootState } from 'src/store'
import { useSelector } from 'react-redux'

const columns = [
  {
    flex: 0.10,
    field: 'fechaFormat',
    minWidth: 80,
    headerName: 'Fecha'
  },
  {
    flex: 0.15,
    minWidth: 20,
    field: 'numero',
    headerName: 'Numero'
  },
  {
    flex: 0.50,
    minWidth: 130,
    field: 'motivo',
    headerName: 'Motivo'
  },
  {
    flex: 0.15,
    minWidth: 120,
    field: 'montoFormat',
    headerName: 'Monto'
  }

]

const TableBasicPagado = () => {
  const {preDetalleDocumentoPagado} = useSelector((state: RootState) => state.presupuesto)


  return (
    <Card>
      <CardHeader title={"Documentos"}/>
      <Box sx={{ height: 500 }}>
        <DataGrid columns={columns} rows={preDetalleDocumentoPagado}  getRowHeight={() => 'auto'}/>
      </Box>
    </Card>
  )
}

export default TableBasicPagado

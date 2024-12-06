import Box from '@mui/material/Box'
import { Typography } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'
import FormatNumber from 'src/utilities/format-numbers'

function ColumnsDataGridBeneficioOp() {
  return [
    {
      flex: 1,
      headerName: 'proveedor',
      field: 'nombreProveedor',
      editable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.nombreProveedor === '' ? 'NO DISPONIBLE' : params.row.nombreProveedor}
        </Typography>
      )
    },
    {
      flex: 1,
      headerName: 'monto',
      field: 'monto',
      editable: true,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'left' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.monto === '' ? 'NO DISPONIBLE' : FormatNumber(params.row.monto)}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 1,
      headerName: 'monto Pagado',
      field: 'montoPagado',
      editable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.montoPagado === 0 ? 0 : FormatNumber(params.row.montoPagado)}
        </Typography>
      )
    }
  ]
}


export default ColumnsDataGridBeneficioOp
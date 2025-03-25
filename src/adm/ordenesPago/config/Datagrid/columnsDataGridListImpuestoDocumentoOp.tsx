import { GridRenderCellParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { Typography } from "@mui/material"

function columnsDataGridListImpuestoDocumentoOp() {
  return [
    {
      flex: 1,
      headerName: 'codigoImpuestoDocumento',
      field: 'codigoImpuestoDocumentoOp',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.codigoImpuestoDocumentoOp === '' ? 'NO DISPONIBLE' : params.row.codigoImpuestoDocumentoOp}
        </Typography>
      )
    },
    {
      flex: 1,
      headerName: 'base Imponible',
      field: 'baseImponible',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'left' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.baseImponible === '' ? 'NO DISPONIBLE' : params.row.baseImponible}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 1,
      headerName: 'monto Impuesto',
      field: 'montoImpuesto',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.montoImpuesto === '' ? 'NO DISPONIBLE' : params.row.montoImpuesto}
        </Typography>
      )
    },
    {
      flex: 1,
      headerName: 'monto Impuesto Exento',
      field: 'montoImpuestoExento',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.montoImpuestoExento === '' ? 'NO DISPONIBLE' : params.row.montoImpuestoExento}
        </Typography>
      )
    },
    {
      flex: 1,
      headerName: 'monto Retenido',
      field: 'montoRetenido',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.montoRetenido === '' ? 'NO DISPONIBLE' : params.row.montoRetenido}
        </Typography>
      )
    }
  ]
}


export default columnsDataGridListImpuestoDocumentoOp
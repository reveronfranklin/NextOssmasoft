import Box from '@mui/material/Box'
import { Typography } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'
import FormatNumber from 'src/utilities/format-numbers'

function ColumnsDataGridRetencionesOp() {
  return [
    {
      flex: 1,
      headerName: 'tipo',
      field: 'descripcionTipoRetencion',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.descripcionTipoRetencion === '' ? 'NO DISPONIBLE' : params.row.descripcionTipoRetencion }
        </Typography>
      )
    },
    {
      flex: 1,
      headerName: 'concepto',
      field: 'conceptoPago',
      editable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'left' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.conceptoPago === '' ? 'NO DISPONIBLE' : params.row.conceptoPago }
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0,
      headerName: 'Base',
      field: 'baseImponible',
      editable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.baseImponible === 0 ? 0 : FormatNumber(params.row.baseImponible)}
        </Typography>
      )
    },
    {
      flex: 0,
      headerName: '%',
      field: 'porRetencion',
      editable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.porRetencion === 0 ? 0 : params.row.porRetencion}
        </Typography>
      )
    },
    {
      flex: 1,
      headerName: 'monto retencion',
      field: 'montoRetencion',
      editable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.montoRetencion === 0 ? 0 : FormatNumber(params.row.montoRetencion) }
        </Typography>
      )
    },
    {
      flex: 1,
      headerName: 'monto Retenido',
      field: 'montoRetenido',
      editable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.montoRetenido === 0 ? 0 : FormatNumber(params.row.montoRetenido) }
        </Typography>
      )
    }
  ]
}


export default ColumnsDataGridRetencionesOp
import { Typography, Tooltip, IconButton } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'
import { setIsOpenDialogListPucOrdenPagoEdit, setPucSeleccionado } from "src/store/apps/ordenPago"
import { useDispatch } from 'react-redux'
import Box from '@mui/material/Box'

function ColumnsDataGridRetenciones() {
  const dispatch = useDispatch()

  const handleEdit = (row: any) => {
    dispatch(setIsOpenDialogListPucOrdenPagoEdit(true))
    dispatch(setPucSeleccionado(row))
  }

  return [
    {
      flex: 1,
      headerName: 'tipoRetencion',
      field: 'tipoRetencion',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          { params.row.tipoRetencion === '' ? 'NO DISPONIBLE' : params.row.tipoRetencion }
        </Typography>
      )
    },
    {
      flex: 1,
      headerName: 'conceptoPago',
      field: 'conceptoPago',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'left' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                { params.row.conceptoPago === '' ? 'NO DISPONIBLE' : params.row.conceptoPago }
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 1,
      headerName: 'montoRetencion',
      field: 'montoRetencion',
      editable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          { params.row.montoRetencion === '' ? 'NO DISPONIBLE' : params.row.montoRetencion }
        </Typography>
      )
    },
    {
      flex: 1,
      headerName: 'montoRetenido',
      field: 'montoRetenido',
      editable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          { params.row.montoRetenido === '' ? 'NO DISPONIBLE' : params.row.montoRetenido }
        </Typography>
      )
    }
  ]
}


export default ColumnsDataGridRetenciones
import { GridRenderCellParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { useDispatch } from 'react-redux'
import { IconButton, Tooltip, Typography } from "@mui/material"
import { styled } from '@mui/material/styles'
import Icon from 'src/@core/components/icon'
import {
  setIsOpenDialogDocumentosEdit,
  setDocumentoOpSeleccionado,
  setTypeOperationDocumento
} from 'src/store/apps/ordenPago'
import FormatNumber from 'src/utilities/format-numbers'

function ColumnsDataGridListDocumentosOp() {
  const dispatch = useDispatch()

  const handleEdit = (row: any) => {
    dispatch(setIsOpenDialogDocumentosEdit(true))
    dispatch(setDocumentoOpSeleccionado(row))
    dispatch(setTypeOperationDocumento('update'))
  }

  const StyledIconButton = styled(IconButton)(({ theme }) => ({
    '&:hover': {
      color: theme.palette.primary.main,
      transform: 'scale(1.5)',
      transition: 'transform 0.2s ease-in-out',
    },
  }))

  return [
    {
      flex: 0,
      minWidth: 40,
      sortable: false,
      headerName: 'Acciones',
      field: 'actions',
      renderCell: ({ row }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Editar'>
            <StyledIconButton size='small' onClick={() => handleEdit(row)}>
              <Icon icon='mdi:file-document-edit-outline' fontSize={20} />
            </StyledIconButton>
          </Tooltip>
        </Box>
      )
    },
    {
      flex: 1,
      headerName: 'TipoDocumento',
      field: 'descripcionTipoDocumento',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.descripcionTipoDocumento === '' ? 'NO DISPONIBLE' : params.row.descripcionTipoDocumento}
        </Typography>
      )
    },
    {
      flex: 1,
      headerName: 'Estatus ante el Fisco',
      field: 'descripcionEstatusFisco',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.descripcionEstatusFisco === '' ? 'NO DISPONIBLE' : params.row.descripcionEstatusFisco}
        </Typography>
      )
    },
    {
      flex: 1,
      headerName: 'Fecha Documento',
      field: 'fechaDocumentoString',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.fechaDocumentoString === '' ? 'NO DISPONIBLE' : params.row.fechaDocumentoString}
        </Typography>
      )
    },
    {
      flex: 1,
      headerName: 'Numero Documento',
      field: 'numeroDocumento',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.numeroDocumento === '' ? 'NO DISPONIBLE' : params.row.numeroDocumento}
        </Typography>
      )
    },
    {
      flex: 1,
      headerName: 'Monto Documento',
      field: 'montoDocumento',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.montoDocumento === '' ? 'NO DISPONIBLE' : FormatNumber(params.row.montoDocumento)}
        </Typography>
      )
    }
  ]
}


export default ColumnsDataGridListDocumentosOp
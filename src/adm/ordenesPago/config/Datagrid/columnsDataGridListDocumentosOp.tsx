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

  // Estilo para celdas con texto largo
  const cellTextSx = {
    color: 'text.primary',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 180, // Puedes ajustar este valor según tu diseño
    display: 'block'
  }

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
      minWidth: 120,
      maxWidth: 220,
      headerName: 'TipoDocumento',
      field: 'descripcionTipoDocumento',
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.row.descripcionTipoDocumento || 'NO DISPONIBLE'}>
          <Typography variant='body2' sx={cellTextSx}>
            {params.row.descripcionTipoDocumento === '' ? 'NO DISPONIBLE' : params.row.descripcionTipoDocumento}
          </Typography>
        </Tooltip>
      )
    },
    {
      flex: 1,
      minWidth: 120,
      maxWidth: 220,
      headerName: 'Estatus ante el Fisco',
      field: 'descripcionEstatusFisco',
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.row.descripcionEstatusFisco || 'NO DISPONIBLE'}>
          <Typography variant='body2' sx={cellTextSx}>
            {params.row.descripcionEstatusFisco === '' ? 'NO DISPONIBLE' : params.row.descripcionEstatusFisco}
          </Typography>
        </Tooltip>
      )
    },
    {
      flex: 1,
      minWidth: 120,
      maxWidth: 180,
      headerName: 'Fecha Documento',
      field: 'fechaDocumentoString',
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.row.fechaDocumentoString || 'NO DISPONIBLE'}>
          <Typography variant='body2' sx={cellTextSx}>
            {params.row.fechaDocumentoString === '' ? 'NO DISPONIBLE' : params.row.fechaDocumentoString}
          </Typography>
        </Tooltip>
      )
    },
    {
      flex: 1,
      minWidth: 120,
      maxWidth: 200,
      headerName: 'Numero Documento',
      field: 'numeroDocumento',
      renderCell: (params: GridRenderCellParams) => (
        <Tooltip title={params.row.numeroDocumento || 'NO DISPONIBLE'}>
          <Typography variant='body2' sx={cellTextSx}>
            {params.row.numeroDocumento === '' ? 'NO DISPONIBLE' : params.row.numeroDocumento}
          </Typography>
        </Tooltip>
      )
    },
    {
      flex: 1,
      minWidth: 120,
      maxWidth: 180,
      headerName: 'Monto Documento',
      field: 'montoDocumento',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={cellTextSx}>
          {params.row.montoDocumento === '' ? 'NO DISPONIBLE' : FormatNumber(params.row.montoDocumento)}
        </Typography>
      )
    }
  ]
}

export default ColumnsDataGridListDocumentosOp
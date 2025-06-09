import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'
import { styled, useTheme } from '@mui/material/styles'
import { useDispatch } from 'react-redux'
import { IconButton, Tooltip, Typography } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'
import {
    setIsOpenDialogOrdenPagoDetalle,
    setIsOpenViewerPdf,
    setTypeOperation,
    setCompromisoSeleccionadoDetalle,
    setCodigoOrdenPago,
    setConFactura
} from 'src/store/apps/ordenPago'
import { ButtonWithConfirm } from "src/views/components/buttons/ButtonsWithConfirm"

function ColumnsDataGrid(props: any) {
    const dispatch = useDispatch()
    const theme = useTheme()

    const handleEdit = (row: any) => {

        dispatch(setCompromisoSeleccionadoDetalle(row))
        dispatch(setCodigoOrdenPago(row.codigoOrdenPago))
        dispatch(setConFactura(row.conFactura))
        dispatch(setIsOpenDialogOrdenPagoDetalle(true))
        dispatch(setTypeOperation('update'))
    }

    const handleDialogViewerPdf = async (row: any) => {
        dispatch(setCodigoOrdenPago(row.codigoOrdenPago))
        dispatch(setCompromisoSeleccionadoDetalle(row))
        dispatch(setIsOpenViewerPdf(true))
    }

    const handleDeleteOrdenPago = async (row : any) => {
        if (!row) return
        await props.deleteOrden({
            codigoOrdenPago: row.codigoOrdenPago,
            codigoPresupuesto: props.presupuestoSeleccionado.codigoPresupuesto
        })
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
                    <Tooltip title="Ver PDF">
                        <StyledIconButton
                            size='small'
                            onClick={() => handleDialogViewerPdf(row)}
                        >
                            <Icon icon='mdi:file-pdf-box' fontSize={20} />
                        </StyledIconButton>
                    </Tooltip>
                    { row && row.status === 'PE' &&
                        <ButtonWithConfirm
                            color="primary"
                            onAction={() => handleDeleteOrdenPago(row)}
                            confirmMessage={`Esta usted seguro de eliminar la orden de pago: # ${row.codigoOrdenPago}`}
                            showLoading={true}
                            disableBackdropClick={true}
                            startIcon={<Icon icon='mdi:delete' fontSize={20} />}
                            sx={{
                                minWidth: '0px',
                                padding: 0,
                                '&:hover': {
                                    color: theme.palette.primary.main,
                                    transform: 'scale(1.5)',
                                    transition: 'transform 0.2s ease-in-out',
                                },
                            }}
                        >
                        </ButtonWithConfirm>
                    }
                </Box>
            )
        },
        {
            flex: 0,
            minWidth: 150,
            headerName: '# OrdenPago',
            field: 'numeroOrdenPago',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary', textAlign: 'center', width: '100%' }}>
                    {params.row?.numeroOrdenPago ?? 'NO DISPONIBLE'}
                </Typography>
            )
        },
        {
            flex: 0,
            with: 40,
            headerName: 'Fecha',
            field: 'fechaOrdenPagoString',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.fechaOrdenPagoString}
                </Typography>
            )
        },
        {
            flex: 0,
            minWidth: 180,
            headerName: 'Tipo Orden',
            field: 'descripcionTipoOrdenPago',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionTipoOrdenPago === '' ? 'NO DISPONIBLE' : params.row.descripcionTipoOrdenPago}
                </Typography>
            )
        },
        {
            flex: 0.25,
            minWidth: 300,
            headerName: 'Proveedor',
            field: 'nombreProveedor',
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'left' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {params.row.nombreProveedor === '' ? 'NO DISPONIBLE' : params.row.nombreProveedor}
                            </Typography>
                        </Box>
                    </Box>
                )
            }
        },
        {
            flex: 1,
            headerName: 'Tipo Pago',
            field: 'descripcionTipoPago',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionTipoPago === '' ? 'NO DISPONIBLE' : params.row.descripcionTipoPago}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Estado',
            field: 'descripcionStatus',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionStatus === '' ? 'NO DISPONIBLE' : params.row.descripcionStatus.toLowerCase()}
                </Typography>
            )
        }
    ]
}


export default ColumnsDataGrid
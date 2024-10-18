import { useDispatch } from 'react-redux'
import { IconButton, Tooltip, Typography } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'
import {
    setVerComrpromisoActive,
    setCompromisoSeleccionado
} from "src/store/apps/presupuesto"

function ColumnsDataGrid() {
    const dispatch = useDispatch()

    const handleEdit = (row: any) => {
        dispatch(setVerComrpromisoActive(true))
        dispatch(setCompromisoSeleccionado(row))
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
                        <IconButton size='small' onClick={() => handleEdit(row)}>
                            <Icon icon='mdi:file-document-edit-outline' fontSize={20} />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        },
        {
            flex: 0,
            headerName: 'Codigo Compromiso',
            field: 'codigoCompromiso',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.codigoCompromiso}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: '# Solicitud',
            field: 'numeroSolicitud',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.numeroSolicitud }
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: '# Compromiso',
            field: 'numeroCompromiso',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.numeroCompromiso }
                </Typography>
            )
        },
        {
            flex: 0,
            with: 40,
            headerName: 'Fecha',
            field: 'fechaSolicitudString',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.fechaCompromisoString}
                </Typography>
            )
        },
        {
            flex: 0.25,
            minWidth: 300,
            headerName: 'Motivo',
            field: 'motivo',
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'left' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {params.row.motivo === '' ? 'NO DISPONIBLE' : params.row.motivo}
                            </Typography>
                        </Box>
                    </Box>
                )
            }
        },
        {
            flex: 0,
            minWidth: 180,
            headerName: 'Nombre Proveedor',
            field: 'nombreProveedor',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.nombreProveedor === '' ? 'NO DISPONIBLE' : params.row.nombreProveedor}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Estado',
            field: 'descripcionStatus',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionStatus === '' ? 'NO DISPONIBLE' : params.row.descripcionStatus}
                </Typography>
            )
        }
    ]
}


export default ColumnsDataGrid
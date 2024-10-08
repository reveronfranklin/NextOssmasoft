import { useDispatch } from 'react-redux'
import { IconButton, Tooltip, Typography } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'
import { CellType } from '../../../interfaces/cellType.interfaces'
import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'
import formatNumber from '../../../helpers/formateadorNumeros'

import {
    setPucSeleccionado,
    setVerSolicitudCompromisoPucActive
} from "src/store/apps/adm"

function ColumnsPucDataGrid() {
    const dispatch = useDispatch()

    const handleEdit = (row: any) => {
        dispatch(setPucSeleccionado(row))
        dispatch(setVerSolicitudCompromisoPucActive(true))
    }

    return [
        {
            flex: 0,
            minWidth: 20,
            sortable: false,
            headerName: 'Acciones',
            field: 'actions',
            renderCell: ({ row }: CellType) => (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}> {/* Center content horizontally */}
                    <Tooltip title='Editar'>
                        <IconButton size='small' onClick={() => handleEdit(row)}>
                            <Icon icon='mdi:file-document-edit-outline' fontSize={20} />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        },
        {
            flex: 1,
            headerName: 'IPC',
            field: 'icpConcat',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.icpConcat}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'PUC',
            field: 'pucConcat',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.pucConcat}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Financiado',
            field: 'descripcionFinanciado',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionFinanciado}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Monto',
            field: 'monto',
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <Typography variant='body2' sx={{ color: 'text.primary' }}>
                        { formatNumber(params.row.monto) }
                    </Typography>
                </div>
            )
        },
        {
            flex: 1,
            headerName: 'Comprometido',
            field: 'montoComprometido',
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <Typography variant='body2' sx={{ color: 'text.primary' }}>
                        { formatNumber(params.row.montoComprometido) }
                    </Typography>
                </div>
            )
        },
        {
            flex: 1,
            headerName: 'Anulado',
            field: 'montoAnulado',
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <Typography variant='body2' sx={{ color: 'text.primary' }}>
                        { formatNumber(params.row.montoAnulado) }
                    </Typography>
                </div>
            )
        },
    ]
}

export default ColumnsPucDataGrid
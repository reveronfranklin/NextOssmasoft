import { useDispatch } from 'react-redux'
import { Typography } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { } from "src/store/apps/adm"

function ColumnsDataGrid() {
    const dispatch = useDispatch()

    // const handleEdit = (row: any) => {
    //     console.log('row', row)
    // }

    return [
        // {
        //     flex: 0,
        //     minWidth: 40,
        //     sortable: false,
        //     headerName: 'Acciones',
        //     field: 'actions',
        //     renderCell: ({ row }: any) => (
        //         <Box sx={{ display: 'flex', alignItems: 'center' }}>
        //             <Tooltip title='Editar'>
        //                 <IconButton size='small' onClick={() => handleEdit(row)}>
        //                     <Icon icon='mdi:file-document-edit-outline' fontSize={20} />
        //                 </IconButton>
        //             </Tooltip>
        //         </Box>
        //     )
        // },
        {
            flex: 0,
            minWidth: 180,
            headerName: 'codigoOrdenPago',
            field: 'codigoOrdenPago',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.codigoOrdenPago}
                </Typography>
            )
        },
        {
            flex: 0,
            minWidth: 180,
            headerName: 'numeroOrdenPago',
            field: 'numeroOrdenPago',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.numeroOrdenPago}
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
            headerName: 'Frecuencia',
            field: 'descripcionFrecuencia',
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'left' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {params.row.descripcionFrecuencia === '' ? 'NO DISPONIBLE' : params.row.descripcionFrecuencia}
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
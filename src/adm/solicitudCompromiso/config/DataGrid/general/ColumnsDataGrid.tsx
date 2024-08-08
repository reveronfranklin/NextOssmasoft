import { useDispatch } from 'react-redux'
import { CrudOperation } from '../../../enums/CrudOperations.enum'
import { IconButton, Tooltip, Typography } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'
import { CellType } from '../../../interfaces/cellType.interfaces'
import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'
import HandleReport from '../../../helpers/generateReport/SolicitudCompromiso'
import {
    setVerSolicitudCompromisosActive,
    setOperacionCrudAdmSolCompromiso,
    setSolicitudCompromisoSeleccionado
} from "src/store/apps/adm"

function ColumnsDataGrid(props: any) {
    const dispatch = useDispatch()

    const handleEdit = (row: any) => {
        dispatch(setVerSolicitudCompromisosActive(true))
        dispatch(setSolicitudCompromisoSeleccionado(row))
        dispatch(setOperacionCrudAdmSolCompromiso(CrudOperation.EDIT))
    }

    const handleReport = async (row: any) => {
        const payload = {
            filter: {
                PageSize: 0,
                PageNumber: 0,
                codigoSolicitud: row.codigoSolicitud,
                codigoPresupuesto: row.codigoPresupuesto,
                SearchText: ''
            },
            fetchSolicitudReportData: props.fetchSolicitudReportData,
            downloadReportByName: props.downloadReportByName
        }

        if (payload) {
            await HandleReport(payload)
        }
    }

    return [
        {
            flex: 0,
            minWidth: 40,
            sortable: false,
            headerName: 'Acciones',
            field: 'actions',
            renderCell: ({ row }: CellType) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title='Editar'>
                        <IconButton size='small' onClick={() => handleEdit(row)}>
                            <Icon icon='mdi:file-document-edit-outline' fontSize={20} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Report">
                        <IconButton size='small' onClick={() => handleReport(row)}>
                            <Icon icon='mdi:download' fontSize={20} />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        },
        {
            flex: 0,
            minWidth: 180,
            headerName: '# Solicitud',
            field: 'numeroSolicitud',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.numeroSolicitud}
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
                    {params.row.fechaSolicitudString}
                </Typography>
            )
        },
        {
            flex: 0,
            minWidth: 180,
            headerName: 'Tipo Solicitud',
            field: 'descripcionTipoSolicitud',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionTipoSolicitud === '' ? 'NO DISPONIBLE' : params.row.descripcionTipoSolicitud}
                </Typography>
            )
        },
        {
            flex: 0.25,
            minWidth: 300,
            headerName: 'Solicitante',
            field: 'denominacionSolicitante',
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'left' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {params.row.denominacionSolicitante === '' ? 'NO DISPONIBLE' : params.row.denominacionSolicitante}
                            </Typography>
                        </Box>
                    </Box>
                )
            }
        },
        {
            flex: 1,
            headerName: 'Proveedor',
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
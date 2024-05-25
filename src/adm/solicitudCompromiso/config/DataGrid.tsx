import { useDispatch } from 'react-redux'

import { CrudOperation } from './../enums/CrudOperations.enum'
import { IconButton, Tooltip, Typography } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'
import { CellType } from './../interfaces/cellType.interfaces'

import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'
import dayjs from 'dayjs'

import {
    setVerSolicitudCompromisosActive,
    setOperacionCrudAdmSolCompromiso,
    setSolicitudCompromisoSeleccionado } from "src/store/apps/adm"

function ColumnsDataGrid() {
    const dispatch = useDispatch()

    const handleEdit = (row: any) => {
        dispatch(setVerSolicitudCompromisosActive(true))
        dispatch(setSolicitudCompromisoSeleccionado(row))
        dispatch(setOperacionCrudAdmSolCompromiso(CrudOperation.EDIT))
    }

    return [
        {
            flex: 0.05,
            minWidth: 80,
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
                </Box>
            )
        },
        {
            Width: 10,
            headerName: 'Id',
            field: 'codigoSolicitud',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.codigoSolicitud}
                </Typography>
            )
        },
        {
            minWidth: 200,
            headerName: '# Solicitud',
            field: 'numeroSolicitud',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.numeroSolicitud}
                </Typography>
            )
        },
        {
            with: 40,
            headerName: 'Fecha',
            field: 'fechaSolicitudString',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {dayjs(params.row.fechaSolicitudString).format('DD/MM/YYYY')}
                </Typography>
            )
        },
        {
            minWidth: 300,
            headerName: 'Tipo Solicitud',
            field: 'descripcionTipoSolicitud',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionTipoSolicitud === '' ? 'NO DISPONIBLE' : params.row.descripcionTipoSolicitud}
                </Typography>
            )
        },
        {
            minWidth: 350,
            headerName: 'Solicitante',
            field: 'denominacionSolicitante',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.denominacionSolicitante === '' ? 'NO DISPONIBLE' : params.row.denominacionSolicitante}
                </Typography>
            )
        },
        {
            minWidth: 150,
            headerName: 'Proveedor',
            field: 'nombreProveedor',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.nombreProveedor === '' ? 'NO DISPONIBLE' : params.row.nombreProveedor}
                </Typography>
            )
        },
        {
            with: 15,
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
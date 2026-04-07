import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import { GridRenderCellParams, GridColDef } from '@mui/x-data-grid';
import validateAmount from 'src/utilities/validateAmount';
import FormatNumber from 'src/utilities/format-numbers';

const useColumnsGridEmployees = (): GridColDef[] => {
    const dispatch = useDispatch()

    const statusOptions: { [key: string]: string } = {
		'A': 'Activo',
		'I': 'Inactivo'
    }

    const columns = useMemo<GridColDef[]>(() => [
        {
            flex: 1,
            headerName: 'Cédula',
            field: 'cedula',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.cedula === '' ? 'NO DISPONIBLE' : params.row.cedula}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Nombre',
            field: 'nombre',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.nombre === '' ? 'NO DISPONIBLE' : params.row.nombre}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Apellido',
            field: 'apellido',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.apellido === '' ? 'NO DISPONIBLE' : params.row.apellido}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Fecha de Ingreso',
            field: 'fechaIngreso',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.fechaIngreso ? new Date(params.row.fechaIngreso).toLocaleDateString() : 'NO DISPONIBLE'}
                </Typography>
            )
        },
        {
            flex: 0.5,
            headerName: 'Sexo',
            field: 'sexo',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.sexo === '' ? 'NO DISPONIBLE' : params.row.sexo}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Sueldo',
            field: 'sueldo',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.sueldo ? `Bs ${FormatNumber(validateAmount(parseFloat(params.row.sueldo)))}` : 'NO DISPONIBLE'}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Estatus',
            field: 'status',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.status === null ? 'NO DISPONIBLE' : statusOptions[params.row.status]}
                </Typography>
            )
        }
    ], [dispatch])

    return columns
}

export default useColumnsGridEmployees
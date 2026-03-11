import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import { GridRenderCellParams, GridColDef } from '@mui/x-data-grid';
import FormatNumber from '../../../../utilities/format-numbers';
import validateAmount from '../../../../utilities/validateAmount';

const useColumnsDataGrid = (): GridColDef[] => {
    const dispatch = useDispatch()

    const moventTypeOptions: { [key: string]: string } = {
		'E': 'Especial',
		'F': 'Fijo',
		'V': 'Variable'
    }

    const columns = useMemo<GridColDef[]>(() => [
        {
            flex: 0.5,
            headerName: 'Código concepto',
            field: 'codigoConcepto',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.codigoConcepto === 0 ? 'NO DISPONIBLE' : params.row.codigoConcepto}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Denominación del concepto',
            field: 'denominacion',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.denominacion === '' ? 'NO DISPONIBLE' : params.row.denominacion}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'complemento del concepto',
            field: 'complementoConcepto',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.complementoConcepto === '' ? 'NO DISPONIBLE' : params.row.complementoConcepto}
                </Typography>
            )
        },
        {
            flex: 0.5,
            headerName: 'Tipo de movimiento',
            field: 'tipo',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row?.tipo === '' ? 'NO DISPONIBLE' : moventTypeOptions[params.row.tipo]}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Frecuencia de pago',
            field: 'descripcionFrecuencia',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionFrecuencia === '' ? 'NO DISPONIBLE' : params.row.descripcionFrecuencia}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Monto',
            field: 'monto',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.monto === null ? 'NO DISPONIBLE' : FormatNumber(validateAmount(parseFloat(params.row.monto)))}
                </Typography>
            )
        }
    ], [dispatch])

    return columns
}


export default useColumnsDataGrid
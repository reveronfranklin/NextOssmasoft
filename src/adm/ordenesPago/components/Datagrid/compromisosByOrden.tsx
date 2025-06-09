import { useState, useEffect } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, styled } from '@mui/material'
import Spinner from 'src/@core/components/spinner'
import useServices from '../../services/useServices'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import ColumnsDataGridListCompromisoByOrden from '../../config/Datagrid/columnsDataGridListCompromisoByOrden'
import { setIsOpenDialogListPucOrdenPago, setCodigoIdentificadorCompromiso, setTotalCompromiso } from "src/store/apps/ordenPago"
import { useDispatch } from 'react-redux'
import { RootState } from "src/store"
import { useSelector } from "react-redux"

const StyledDataGridContainer = styled(Box)(() => ({
    height: 500,
    overflowY: 'auto',
}))

const DataGridComponent = () => {
    const [pageNumber, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(5)
    const [searchText] = useState<string>('')

    const qc: QueryClient = useQueryClient()
    const dispatch = useDispatch()

    const { codigoOrdenPago, compromisoSeleccionadoListaDetalle } = useSelector((state: RootState) => state.admOrdenPago)
    const { getCompromisoByOrden, presupuestoSeleccionado } = useServices()

    const filter: any = {
        codigoOrdenPago: compromisoSeleccionadoListaDetalle.codigoOrdenPago,
        codigoPresupuesto: presupuestoSeleccionado.codigoPresupuesto,
    }

    const query = useQuery({
        queryKey: ['listCompromisoByOrdenPago', pageSize, pageNumber, searchText, filter],
        queryFn: () => getCompromisoByOrden(filter),
        initialData: () => {
            return qc.getQueryData(['listCompromisoByOrdenPago', pageSize, pageNumber, searchText])
        },
        staleTime: 100 * 60,
        retry: 3,
        enabled: !!codigoOrdenPago && !!presupuestoSeleccionado?.codigoPresupuesto,
    }, qc)

    const rows = query?.data?.data || []
    const rowCount = rows.length || 0

    const total1 = query?.data?.total1 || 0

    useEffect(() => {
        if (total1) {
            dispatch(setTotalCompromiso(total1))
        }
    }, [dispatch, total1])

    useEffect(() => {
        qc.prefetchQuery({
            queryKey: ['listCompromisoByOrdenPago', pageSize, pageNumber, searchText, filter],
            queryFn: () => getCompromisoByOrden(filter)
        })
    }, [codigoOrdenPago])

    useEffect(() => {
        if (rows && rows.length > 0 && rows[0]?.codigoIdentificador) {
            dispatch(setCodigoIdentificadorCompromiso(rows[0]?.codigoIdentificador));
        }
    }, [dispatch, rows])

    const handleDoubleClick = (data: any) => {
        console.log(data)
        dispatch(setIsOpenDialogListPucOrdenPago(true))
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const handleSizeChange = (newPageSize: number) => {
        setPage(0)
        setPageSize(newPageSize)
    }

    return (
        <>
            {
                query.isLoading ? (<Spinner sx={{ height: '100%' }} />) : rows && (
                    <StyledDataGridContainer>
                        <DataGrid
                            autoHeight
                            pagination
                            getRowId={(row) => row.codigoCompromisoOp}
                            rows={rows}
                            rowCount={rowCount}
                            columns={ColumnsDataGridListCompromisoByOrden() as any}
                            pageSize={pageSize}
                            page={pageNumber}
                            getRowHeight={() => 'auto'}
                            sortingMode='server'
                            paginationMode='server'
                            rowsPerPageOptions={[5, 10, 50]}
                            onPageSizeChange={handleSizeChange}
                            onPageChange={handlePageChange}
                            onRowDoubleClick={row => handleDoubleClick(row)}
                        />
                    </StyledDataGridContainer>
                )
            }
        </>
    )
}

const CompromisoByOrden = () => {
    return (
        <DataGridComponent />
    )
}

export default CompromisoByOrden
import { useState } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, styled } from '@mui/material'
import Spinner from 'src/@core/components/spinner'
import useServices from '../../services/useServices'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import ColumnsDataGridListCompromisoByOrden from '../../config/Datagrid/columnsDataGridListCompromisoByOrden'
import { setIsOpenDialogListPucOrdenPago } from "src/store/apps/ordenPago"
import { useDispatch } from 'react-redux'
import { RootState } from "src/store"
import { useSelector } from "react-redux"

const StyledDataGridContainer = styled(Box)(() => ({
    height: 500,
    overflowY: 'auto',
}))

interface IfilterByOrdenPago {
    codigoOrdenPago: number
}

const DataGridComponent = () => {
    const [pageNumber, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(5)
    const [searchText] = useState<string>('')

    const qc: QueryClient = useQueryClient()
    const dispatch = useDispatch()

    const { compromisoSeleccionadoListaDetalle } = useSelector((state: RootState) => state.admOrdenPago)
    const { codigoOrdenPago } = compromisoSeleccionadoListaDetalle

    const { getCompromisoByOrden } = useServices()

    const filter: IfilterByOrdenPago = { codigoOrdenPago }

    const query = useQuery({
        queryKey: ['listCompromisoByOrdenPago', pageSize, pageNumber, searchText],
        queryFn: () => getCompromisoByOrden(filter),
        initialData: () => {
            return qc.getQueryData(['listCompromisoByOrdenPago', pageSize, pageNumber, searchText])
        },
        staleTime: 100 * 60,
        retry: 3,
    }, qc)

    const rows = query?.data?.data || []
    const rowCount = rows.length || 0

    const handleDoubleClick = (data: any) => {
        const { row } = data
        dispatch(setIsOpenDialogListPucOrdenPago(true))
        console.log(row)
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
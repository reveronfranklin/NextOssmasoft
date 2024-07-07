import { DataGrid } from "@mui/x-data-grid"
import Spinner from 'src/@core/components/spinner'
import useServices from 'src/adm/solicitudCompromiso/services/useServices'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query';
import ColumnsDetalleDataGrid from 'src/adm/solicitudCompromiso/config/DataGrid/detalle/ColumnsDataGrid'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'
import { useState } from "react"
import { Box, styled } from '@mui/material'

const StyledDataGridContainer = styled(Box)(() => ({
    height: 200,
    overflowY: 'auto',
}))

const DataGridDetalleSolicitudComponent = (props: any) => {
    const [pageNumber, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(5)
    const [searchText, setSearchText] = useState('')
    const [buffer, setBuffer] = useState('')

    const { getDetalleSolicitudFetchTable } = useServices()
    const qc: QueryClient = useQueryClient()

    const query = useQuery({
        queryKey: ['detalleSolicitudCompromiso', props.codigoSolicitud],
        queryFn: () => getDetalleSolicitudFetchTable(props.codigoSolicitud),
        initialData: () => {
            return qc.getQueryData(['detalleSolicitudCompromiso', props.codigoSolicitud])
        },
        staleTime: 1000 * 60,
        retry: 3
    }, qc)

    const rows = query?.data?.data.data || []
    const rowCount = query?.data?.data.cantidadRegistros || 0

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
                    <DataGrid
                        autoHeight
                        pagination
                        getRowId={(row) => row.codigoDetalleSolicitud}
                        rows={rows}
                        rowCount={rowCount}
                        columns={ColumnsDetalleDataGrid() as any}
                        sortingMode='server'
                        paginationMode='server'
                        pageSize={pageSize}
                        page={pageNumber}
                        rowsPerPageOptions={[5, 10, 20]}
                        onPageSizeChange={handleSizeChange}
                        onPageChange={handlePageChange}
                    />
                )
            }
        </>
    )
}

const Component = (props: any) => {
    return (
        <StyledDataGridContainer>
            <DataGridDetalleSolicitudComponent codigoSolicitud={props.codigoSolicitud} />
        </StyledDataGridContainer>
    )
}

export default Component
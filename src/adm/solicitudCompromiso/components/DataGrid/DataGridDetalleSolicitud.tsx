import { DataGrid } from "@mui/x-data-grid"
import Spinner from 'src/@core/components/spinner'
import useServices from 'src/adm/solicitudCompromiso/services/useServices'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query';
import ColumnsDetalleDataGrid from 'src/adm/solicitudCompromiso/config/DataGrid/detalle/ColumnsDataGrid'
import { useState } from "react"
import { Box, styled } from '@mui/material'

const StyledDataGridContainer = styled(Box)(() => ({
    height: 350,
    overflowY: 'auto',
}))

const DataGridDetalleSolicitudComponent = (props: any) => {
    const [pageNumber, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(5)

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
    const rowCount = rows.length || 0

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const handleSizeChange = (newPageSize: number) => {
        setPage(0)
        setPageSize(newPageSize)
    }

    const paginatedRows = rows.slice(pageNumber * pageSize, pageNumber * pageSize + pageSize);

    return (
        <>
            {
                query.isLoading ? (<Spinner sx={{ height: '100%' }} />) : rows && (
                    <DataGrid
                        autoHeight
                        pagination
                        getRowId={(row) => row.codigoDetalleSolicitud}
                        rows={paginatedRows}
                        rowCount={rowCount}
                        columns={ColumnsDetalleDataGrid() as any}
                        getRowHeight={() => 'auto'}
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
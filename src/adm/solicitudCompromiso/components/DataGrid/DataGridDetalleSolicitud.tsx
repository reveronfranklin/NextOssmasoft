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

    console.log(query)
    const rows = query?.data?.data?.result?.data || []
    const rowCount = rows.length || 0
    const total1 = query?.data?.data?.result.total1 || 0

    console.log('rows', rows)
    console.log('total1', total1)

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
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ padding: '10px' }}>
                    <label style={{ marginRight: '5px' }}>Total:</label>
                    {total1}
                </div>
            </div>
            {
                query.isLoading ? (<Spinner sx={{ height: '100%' }} />) : rows && (
                    <StyledDataGridContainer>
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
                    </StyledDataGridContainer>
                )
            }
        </>
    )
}

const Component = (props: any) => {
    return (
        <DataGridDetalleSolicitudComponent codigoSolicitud={props.codigoSolicitud} />
    )
}

export default Component

import { DataGrid } from "@mui/x-data-grid"
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import { Box, styled } from '@mui/material'
import { useState } from "react"
import Spinner from 'src/@core/components/spinner'
import useServices from 'src/adm/solicitudCompromiso/services/useServices'
import ColumnsPucDataGrid from 'src/adm/solicitudCompromiso/config/DataGrid/puc/ColumnsPucDataGrid'

const StyledDataGridContainer = styled(Box)(() => ({
    height: 400,
    overflowY: 'auto',
    marginTop: '1rem',
}))

const DataGridPucDetalleSolicitud = (props: any) => {
    const [pageNumber, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(5)

    const { fetchPucDetalleSolicitud } = useServices()
    const qc: QueryClient = useQueryClient()

    const query = useQuery({
        queryKey: ['pucDetalleSolicitud', props.codigoDetalleSolicitud],
        queryFn: () => fetchPucDetalleSolicitud(props.codigoDetalleSolicitud),
        initialData: () => {
            return qc.getQueryData(['pucDetalleSolicitud', props.codigoDetalleSolicitud])
        },
        staleTime: 1000 * 60 * 60,
        retry: 3
    }, qc)

    const rows = query?.data?.data.data || [];
    const rowCount = rows.length || 0;

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
                    <StyledDataGridContainer>
                        <DataGrid
                            autoHeight
                            pagination
                            getRowId={(row) => row.codigoPucSolicitud}
                            rows={paginatedRows}
                            rowCount={rowCount}
                            columns={ColumnsPucDataGrid() as any}
                            pageSize={pageSize}
                            page={pageNumber}
                            getRowHeight={() => 'auto'}
                            sortingMode='server'
                            paginationMode='server'
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
        <DataGridPucDetalleSolicitud codigoDetalleSolicitud={props.codigoDetalleSolicitud} />
    )
}

export default Component
import { DataGrid } from "@mui/x-data-grid"
import Spinner from 'src/@core/components/spinner'
import useServices from 'src/adm/solicitudCompromiso/services/useServices'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query';
import ColumnsDetalleDataGrid from 'src/adm/solicitudCompromiso/config/DataGrid/detalle/ColumnsDataGrid'
import { useState } from "react"
import { Box, Grid, styled } from '@mui/material'
import formatNumber from '../../helpers/formateadorNumeros'

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

    const rows = query?.data?.data || []
    const rowCount = rows.length || 0
    const total1 = query?.data?.total1 || 0
    const total2 = query?.data?.total2 || 0

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
            <Grid container spacing={0} paddingTop={0} justifyContent="flex-end">
                <Grid item xs={2} sm={6}>
                    <small style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ padding: '10px' }}>
                            <label style={{ marginRight: '5px' }}>Por imputar:</label>
                            {formatNumber(total1 - total2)}
                        </div>
                    </small>
                    <small style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div style={{ padding: '10px' }}>
                            <label style={{ marginRight: '5px' }}>Total:</label>
                            { formatNumber(total1) }
                        </div>
                    </small>
                </Grid>
            </Grid>
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
                            rowsPerPageOptions={[5, 10, 50]}
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
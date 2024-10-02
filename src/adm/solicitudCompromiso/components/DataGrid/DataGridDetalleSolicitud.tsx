import { useState, ChangeEvent, useRef } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import Spinner from 'src/@core/components/spinner'
import useServices from 'src/adm/solicitudCompromiso/services/useServices'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query';
import ColumnsDetalleDataGrid from 'src/adm/solicitudCompromiso/config/DataGrid/detalle/ColumnsDataGrid'
import { Box, Grid, styled } from '@mui/material'
import formatNumber from '../../helpers/formateadorNumeros'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'

const StyledDataGridContainer = styled(Box)(() => ({
    height: 350,
    overflowY: 'auto',
}))

const DataGridDetalleSolicitudComponent = (props: any) => {
    const [pageNumber, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(5)
    const [searchText, setSearchText] = useState<string>('')
    const [buffer, setBuffer] = useState<string>('')

    const { getDetalleSolicitudFetchTable, presupuestoSeleccionado } = useServices()
    const qc: QueryClient = useQueryClient()
    const debounceTimeoutRef = useRef<any>(null)

    const filter: any = {
        codigoSolicitud: props.codigoSolicitud,
        codigoPresupuesto: presupuestoSeleccionado.codigoPresupuesto,
        pageSize,
        pageNumber,
        searchText,
        status: ''
    }

    const query = useQuery({
        // queryKey: ['detalleSolicitudCompromiso', pageSize, pageNumber, searchText],
        queryKey: ['detalleSolicitudCompromiso', props.codigoSolicitud],
        queryFn: () => getDetalleSolicitudFetchTable({ ...filter, pageSize, pageNumber, searchText }),
        initialData: () => {
            return qc.getQueryData(['detalleSolicitudCompromiso', pageSize, pageNumber, searchText])
        },
        refetchOnWindowFocus: true,
        refetchInterval: 1000 * 5,
        staleTime: 1000 * 5,
        retry: 3,
    }, qc)

    const rows = query?.data?.data || []
    const rowCount = rows.length || 0

    const total1 = query?.data?.total1 || 0 //total mas impuesto
    const total2 = query?.data?.total2 || 0 //total puc
    const total3 = query?.data?.total3 || 0 //base o total
    const total4 = query?.data?.total4 || 0 //total impuesto

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const handleSizeChange = (newPageSize: number) => {
        setPage(0)
        setPageSize(newPageSize)
    }

    const handleSearch = (value: string) => {
        if (value === '') {
            setSearchText('')
            setBuffer('')

            return
        }

        const newBuffer = value
        setBuffer(newBuffer)
        debouncedSearch()
    }

    const debouncedSearch = () => {
        clearTimeout(debounceTimeoutRef.current)

        debounceTimeoutRef.current = setTimeout(() => {
            setSearchText(buffer)
        }, 2500)
    }

    const paginatedRows = rows.slice(pageNumber * pageSize, pageNumber * pageSize + pageSize);

    return (
        <>
            <Grid container spacing={0} paddingTop={0} justifyContent="flex-end">
                <Grid item xs={2} sm={6}>
                    <small style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <div style={{ padding: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                            <label style={{ marginRight: '5px' }}><b>Por imputar:</b></label>
                            {formatNumber(total1 - total2)}
                        </div>
                    </small>
                    <small style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <div style={{ padding: '10px', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
                            <label style={{ marginRight: '5px' }}><b>Total:</b></label>
                            <label>{formatNumber(total3)}</label>
                        </div>
                        <div style={{ padding: '10px', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
                            <label style={{ marginRight: '5px' }}><b>Impuesto:</b></label>
                            {formatNumber(total4)}
                        </div>
                        <div style={{ padding: '10px', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
                            <label style={{ marginRight: '5px' }}><b>Total más Impuesto:</b></label>
                            {formatNumber(total1)}
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
                            components={{ Toolbar: ServerSideToolbar }}
                            componentsProps={{
                                baseButton: {
                                    variant: 'outlined'
                                },
                                toolbar: {
                                    printOptions: { disableToolbarButton: true },
                                    value: buffer,
                                    clearSearch: () => handleSearch(''),
                                    onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value),
                                    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault()
                                        }
                                    }
                                }
                            }}
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
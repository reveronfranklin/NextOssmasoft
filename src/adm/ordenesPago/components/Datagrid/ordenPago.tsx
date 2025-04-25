import { useState, ChangeEvent, useEffect, useRef } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, styled } from '@mui/material'
import Spinner from 'src/@core/components/spinner'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'
import ColumnsDataGrid from '../../config/Datagrid/columnsDataGrid'
import useServices from '../../services/useServices'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

const StyledDataGridContainer = styled(Box)(() => ({
    height: 650,
    overflowY: 'auto',
}))

const DataGridComponent = () => {
    const [pageNumber, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(5)
    const [searchText, setSearchText] = useState<string>('')
    const [buffer, setBuffer] = useState<string>('')
    const [isPresupuestoSeleccionado, setIsPresupuestoSeleccionado] = useState<boolean>(false)

    const qc: QueryClient = useQueryClient()
    const debounceTimeoutRef = useRef<any>(null)

    const {
        filtroEstatus
    } = useSelector((state: RootState) => state.admSolicitudCompromiso)

    const {
        getOrdenesPagoByPresupuesto,
        presupuestoSeleccionado,
        deleteOrden
    } = useServices()

    const actions = {
        deleteOrden,
        presupuestoSeleccionado
    }

    const filter: any = {
        pageSize,
        pageNumber,
        searchText,
        CodigoSolicitud: 0,
        CodigoPresupuesto: presupuestoSeleccionado.codigoPresupuesto,
        status: filtroEstatus ?? ''
    }

    const query = useQuery({
        queryKey: ['ordenesPagoTable', pageSize, pageNumber, searchText, presupuestoSeleccionado.codigoPresupuesto, filtroEstatus],
        queryFn: () => getOrdenesPagoByPresupuesto({ ...filter, pageSize, pageNumber, searchText, status: filtroEstatus }),
        initialData: () => {
            return qc.getQueryData(['ordenesPagoTable', pageSize, pageNumber, searchText, presupuestoSeleccionado.codigoPresupuesto, filtroEstatus])
        },
        staleTime: 1000 * 60,
        retry: 3,
        enabled: isPresupuestoSeleccionado
    }, qc)

    const rows = query?.data?.data || []
    const rowCount = query?.data?.cantidadRegistros || 0

    useEffect(() => {
        if (presupuestoSeleccionado.codigoPresupuesto > 0) {
            setIsPresupuestoSeleccionado(true)
        } else if (presupuestoSeleccionado.codigoPresupuesto === 0) {
            setIsPresupuestoSeleccionado(false)
        }
    }, [presupuestoSeleccionado, filtroEstatus]);

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

    return (
        <>
            {
                query.isLoading ? (<Spinner sx={{ height: '100%' }} />) : rows && (
                    <StyledDataGridContainer>
                        <DataGrid
                            autoHeight
                            pagination
                            getRowId={(row) => row.codigoOrdenPago}
                            rows={rows}
                            rowCount={rowCount}
                            columns={ColumnsDataGrid(actions) as any}
                            pageSize={pageSize}
                            page={pageNumber}
                            getRowHeight={() => 'auto'}
                            sortingMode='server'
                            paginationMode='server'
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
                                    sx: { paddingLeft: 0, paddingRight: 0 }
                                }
                            }}
                        />
                    </StyledDataGridContainer>
                )
            }
        </>
    )
}

const Component = () => {
    return (
        <DataGridComponent />
    )
}

export default Component
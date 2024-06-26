import { useState, ChangeEvent, useEffect, useRef } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Filters } from '../interfaces/filters.interfaces'
import ColumnsDataGrid from './../config/DataGrid'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'
import { Box, styled } from '@mui/material'
import Spinner from 'src/@core/components/spinner'

import useServices from '../services/useServices'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query';

const StyledDataGridContainer = styled(Box)(() => ({
    height: 450,
    overflowY: 'auto',
}))

const DataGridComponent = () => {
    const [pageNumber, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(5)
    const [isPresupuestoSeleccionado, setIsPresupuestoSeleccionado] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [buffer, setBuffer] = useState('')

    const debounceTimeoutRef = useRef<any>(null)

    const { fetchTableData, presupuestoSeleccionado } = useServices()
    const qc: QueryClient = useQueryClient()

    const filter: Filters = {
        pageSize,
        pageNumber,
        searchText,
        CodigoSolicitud: 0,
        CodigoPresupuesto: 0,
    }

    const query = useQuery({
        queryKey: ['solicitudCompromiso', pageSize, pageNumber, searchText],
        queryFn: () => fetchTableData({ ...filter, pageSize, pageNumber, searchText }),
        initialData: () => {
            return qc.getQueryData(['solicitudCompromiso', pageSize, pageNumber, searchText])
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
    }, [presupuestoSeleccionado]);

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

        const newBuffer = buffer + value
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
                    <DataGrid
                        autoHeight
                        pagination
                        getRowId={(row) => row.codigoSolicitud}
                        rows={rows}
                        rowCount={rowCount}
                        columns={ColumnsDataGrid() as any}
                        pageSize={pageSize}
                        page={pageNumber}
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
                                onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value)
                            }
                        }}
                    />
                )
            }
        </>
    )
}

const Component = () => {
    return (
        <StyledDataGridContainer>
            <DataGridComponent />
        </StyledDataGridContainer>
    )
}

export default Component
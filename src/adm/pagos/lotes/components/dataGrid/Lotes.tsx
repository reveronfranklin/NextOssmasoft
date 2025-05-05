import { ChangeEvent, useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Box, styled } from '@mui/material';
import dayjs from 'dayjs';
import Spinner from 'src/@core/components/spinner';
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar';
import { RootState } from 'src/store';
import AlertMessage from 'src/views/components/alerts/AlertMessage';
import useColumnsDataGrid from './headers/ColumnsDataGrid';
import { useServices } from '../../services';
import { LoteFilterDto } from '../../interfaces'

const StyledDataGridContainer = styled(Box)(() => ({
    height: 650,
    overflowY: 'auto'
}))

const DataGridComponent = () => {
    const [pageNumber, setPage]                                     = useState<number>(0)
    const [pageSize, setPageSize]                                   = useState<number>(5)
    const [searchText, setSearchText]                               = useState<string>('')
    const [buffer, setBuffer]                                       = useState<string>('')
    const [isPresupuestoSeleccionado, setIsPresupuestoSeleccionado] = useState<boolean>(false)

    const debounceTimeoutRef    = useRef<any>(null)
    const qc: QueryClient       = useQueryClient()
    const { batchPaymentDate }  = useSelector((state: RootState) => state.admLote )
    const {
        presupuestoSeleccionado,
        getList,
        message
    }  = useServices()
    const columns               = useColumnsDataGrid()

    const currentDate = dayjs(Date()).format('YYYY-MM-DD')

    const filter: LoteFilterDto = {
        pageSize,
        pageNumber,
        searchText,
        codigoPresupuesto: presupuestoSeleccionado.codigoPresupuesto,
        fechaInicio: `${batchPaymentDate.start ?? currentDate}`,
        fechaFin: `${batchPaymentDate.end ?? currentDate}`
    }

    const query = useQuery({
        queryKey: ['lotesTable', pageSize, pageNumber, searchText, presupuestoSeleccionado.codigoPresupuesto],
        queryFn: () => getList(filter),
        initialData: () => {
            return qc.getQueryData(['lotesTable', pageSize, pageNumber, searchText, presupuestoSeleccionado.codigoPresupuesto])
        },
        staleTime: 1000 * 60,
        retry: 3,
        enabled: isPresupuestoSeleccionado
    }, qc)

    useEffect(() => {
        if (presupuestoSeleccionado.codigoPresupuesto > 0) {
            setIsPresupuestoSeleccionado(true)
        } else if (presupuestoSeleccionado.codigoPresupuesto === 0) {
            setIsPresupuestoSeleccionado(false)
        }

        qc.prefetchQuery({
            queryKey: ['lotesTable', pageSize, pageNumber, searchText, presupuestoSeleccionado.codigoPresupuesto],
            queryFn: () => getList(filter)
        })
    }, [ batchPaymentDate, presupuestoSeleccionado.codigoPresupuesto ])

    const rows      = query?.data?.data || []
    const rowCount  = query?.data?.cantidadRegistros || 0

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
                            getRowId={(row) => row.codigoLotePago}
                            rows={rows}
                            rowCount={rowCount}
                            columns={columns}
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
                        <AlertMessage
                            message={message?.text ?? ''}
                            severity={message?.isValid ? 'success' : 'error'}
                            duration={10000}
                            show={message?.text ? true : false}
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
import { useState, ChangeEvent, useRef, useCallback } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, styled } from '@mui/material'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import { RootState } from "src/store"
import { useSelector } from "react-redux"
import { IUpdateFieldDto } from 'src/interfaces/rh/i-update-field-dto'
import ColumnsDataGridListPucByOrden from '../../config/Datagrid/columnsDataGridListPucByOrden'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'
import Spinner from 'src/@core/components/spinner'
import useServices from '../../services/useServices'
import toast from 'react-hot-toast'

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
    const [searchText, setSearchText] = useState<string>('')
    const [buffer, setBuffer] = useState<string>('')
    const debounceTimeoutRef = useRef<any>(null)

    const columnsDataGridListPucByOrden = ColumnsDataGridListPucByOrden()
    const qc: QueryClient = useQueryClient()

    const { codigoOrdenPago} = useSelector((state: RootState) => state.admOrdenPago)
    const filter: IfilterByOrdenPago = { codigoOrdenPago }

    const { getListPucByOrdenPago, fetchUpdatePucByOrdenPago } = useServices()

    const query = useQuery({
        queryKey: ['listPucByOrdenPago', pageSize, pageNumber, searchText],
        queryFn: () => getListPucByOrdenPago(filter),
        initialData: () => {
            return qc.getQueryData(['listPucByOrdenPago', pageSize, pageNumber, searchText])
        },
        staleTime: 1000 * 60,
        retry: 3,
    }, qc)

    const rows = query?.data?.data || []
    const rowCount = query?.data?.data.length
    const paginatedRows = rows.slice(pageNumber * pageSize, pageNumber * pageSize + pageSize)

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage)
    }, [])

    const handleSizeChange = useCallback((newPageSize: number) => {
        setPage(0)
        setPageSize(newPageSize)
    }, [])

    const handleOnCellEditCommit = useCallback(async (row: any) => {
        const updateDto: IUpdateFieldDto = {
            id: row.id,
            field: row.field,
            value: row.value
        }

        try {
            const response = await fetchUpdatePucByOrdenPago(updateDto)
            if (response?.data?.isValid) {
                toast.success('Registro actualizado')
            }
        } catch (error) {
            console.error(error)
        } finally {
            qc.invalidateQueries({ queryKey: ['listPucByOrdenPago'] })
        }
    }, [fetchUpdatePucByOrdenPago, qc])

    const debouncedSearch = useCallback(() => {
        clearTimeout(debounceTimeoutRef.current)
        debounceTimeoutRef.current = setTimeout(() => {
            setSearchText(buffer)
        }, 2500)
    }, [buffer])

    const handleSearch = useCallback((value: string) => {
        if (value === '') {
            setSearchText('')
            setBuffer('')

            return
        }
        setBuffer(value)
        debouncedSearch()
    }, [debouncedSearch])

    return (
        <>
            {
                query.isLoading ? (<Spinner sx={{ height: '100%' }} />) : rows && (
                    <StyledDataGridContainer>
                        <DataGrid
                            autoHeight
                            pagination
                            getRowId={(row) => row.codigoPucOrdenPago}
                            rows={paginatedRows}
                            rowCount={rowCount}
                            columns={columnsDataGridListPucByOrden}
                            pageSize={pageSize}
                            page={pageNumber}
                            getRowHeight={() => 'auto'}
                            sortingMode='server'
                            paginationMode='server'
                            rowsPerPageOptions={[5, 10, 50]}
                            onPageSizeChange={handleSizeChange}
                            onPageChange={handlePageChange}
                            onCellEditCommit={row => handleOnCellEditCommit(row)}
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

const ListPucByOrden = () => {
    return (
        <DataGridComponent />
    )
}

export default ListPucByOrden
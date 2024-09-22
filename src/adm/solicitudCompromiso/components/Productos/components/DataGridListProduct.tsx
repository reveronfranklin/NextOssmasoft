import { useState, ChangeEvent, useRef } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, styled } from '@mui/material'
import Spinner from 'src/@core/components/spinner'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'
import ColumnsListProductsDataGrid from '../config/ColumnsListProductsDataGrid'
import useServices from '../../../services/useServices'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux'
import { setProductSeleccionado, setVerDialogListProductsInfoActive } from 'src/store/apps/adm'

const StyledDataGridContainer = styled(Box)(() => ({
    height: 500,
    overflowY: 'auto',
}))

const DataGridListProduct = () => {
    const [pageNumber, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(5)
    const [searchText, setSearchText] = useState<string>('')
    const [buffer, setBuffer] = useState<string>('')

    const debounceTimeoutRef = useRef<any>(null)

    const dispatch = useDispatch()
    const { getListProducts } = useServices()
    const qc: QueryClient = useQueryClient()

    const filter = {
        "PageSize": 10,
        "PageNumber": 0,
        "SearchText": ""
    }

    const query = useQuery({
        queryKey: ['listProducts', pageSize, pageNumber, searchText],
        queryFn: () => getListProducts({ ...filter, pageSize, pageNumber, searchText }),
        initialData: () => {
            return qc.getQueryData(['solicitudCompromiso', pageSize, pageNumber, searchText])
        },
        staleTime: 1000 * 60,
        retry: 3
    }, qc)

    const rows = query?.data?.data || []
    const rowCount = query?.data?.cantidadRegistros || 0

    const handleDoubleClick = (row: any) => {
        dispatch(setProductSeleccionado(row.row))
        dispatch(setVerDialogListProductsInfoActive(false))
    }

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
                    <DataGrid
                        autoHeight
                        pagination
                        getRowId={(row) => row.codigo}
                        rows={rows}
                        rowCount={rowCount}
                        columns={ColumnsListProductsDataGrid() as any}
                        pageSize={pageSize}
                        page={pageNumber}
                        getRowHeight={() => 'auto'}
                        sortingMode='server'
                        paginationMode='server'
                        rowsPerPageOptions={[5, 10, 50]}
                        onPageSizeChange={handleSizeChange}
                        onPageChange={handlePageChange}
                        onRowDoubleClick={row => handleDoubleClick(row)}
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
            <DataGridListProduct />
        </StyledDataGridContainer>
    )
}

export default Component
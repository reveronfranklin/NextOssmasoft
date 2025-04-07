import { ChangeEvent, useState, useRef } from 'react';
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Box, styled } from '@mui/material';
import Spinner from 'src/@core/components/spinner';
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar';
import ColumnsDataGrid from './headers/ColumnsDataGrid';
import { useServices } from '../../services';

const StyledDataGridContainer = styled(Box)(() => ({
    height: 650,
    overflowY: 'auto'
}))

const DataGridComponent = () => {
    const [pageNumber, setPage]         = useState<number>(0)
    const [pageSize, setPageSize]       = useState<number>(5)
    const [searchText, setSearchText]   = useState<string>('')
    const [buffer, setBuffer]           = useState<string>('')

    const qc: QueryClient       = useQueryClient()
    const debounceTimeoutRef    = useRef<any>(null)

    const filter: any = {
        pageSize,
        pageNumber,
        searchText
    }

    const { getList } = useServices()

    const query = useQuery({
        queryKey: ['maestroCuentaTable', pageSize, pageNumber, searchText],
        queryFn: () => getList({ ...filter, pageSize, pageNumber, searchText }),
        initialData: () => {
            return qc.getQueryData(['maestroCuentaTable', pageSize, pageNumber, searchText])
        },
        staleTime: 1000 * 60,
        retry: 3
    }, qc)

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
                            getRowId={(row) => row.codigoBanco}
                            rows={rows}
                            rowCount={rowCount}
                            columns={ColumnsDataGrid() as any}
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
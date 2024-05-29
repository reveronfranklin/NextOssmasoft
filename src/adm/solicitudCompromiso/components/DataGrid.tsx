import { useState, ChangeEvent, useEffect } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Filters } from '../interfaces/filters.interfaces'
import ColumnsDataGrid from './../config/DataGrid'
import useServices from '../services/useServices'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'
import { Box, styled } from '@mui/material'

const StyledDataGridContainer = styled(Box)(({ theme }) => ({
    height: 450,
    overflowY: 'auto',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
}));

const DataGridComponent = () => {
    const [pageNumber, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({ CodigoPresupuesto: 17, pageSize, pageNumber, searchText } as Filters)
    const [route] = useState('/AdmSolicitudes/GetByPresupuesto')

    const { rows, loading, total, fetchTableData } = useServices()

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        setFilters({ ...filters, pageNumber: newPage })
    }

    const handleSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize)
        setFilters({ ...filters, pageSize: newPageSize })
    }

    const handleSearch = (value: string) => {
        setSearchText(value)
        setFilters({ ...filters, searchText: value })
    }

    useEffect(() => {
        fetchTableData(route, filters)
    }, [pageNumber, pageSize, searchText, route, filters, fetchTableData])

    return (
        <DataGrid
            rows={rows}
            columns={ColumnsDataGrid()}
            rowCount={total}
            loading={loading}
            paginationMode='server'
            pageSize={pageSize}
            rowsPerPageOptions={[5, 10, 50]}
            onPageSizeChange={handleSizeChange}
            onPageChange={handlePageChange}
            getRowId={row => row.codigoSolicitud}
            sortingMode='server'
            autoHeight
            pagination
            components={{ Toolbar: ServerSideToolbar }}
            componentsProps={{
                baseButton: {
                    variant: 'outlined'
                },
                toolbar: {
                    printOptions: { disableToolbarButton: true },
                    value: searchText,
                    clearSearch: () => handleSearch(''),
                    onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value)
                }
            }}
        />
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
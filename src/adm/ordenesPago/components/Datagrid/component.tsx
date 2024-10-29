// import { useEffect, useRef } from 'react'
import { useState } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, styled } from '@mui/material'
import Spinner from 'src/@core/components/spinner'

const StyledDataGridContainer = styled(Box)(() => ({
    height: 650,
    overflowY: 'auto',
}))

const DataGridComponent = (props: any) => {
    const [pageNumber, setPage] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(5)

    // const [searchText, setSearchText] = useState<string>('')
    // const [buffer, setBuffer] = useState<string>('')
    // const [isPresupuestoSeleccionado, setIsPresupuestoSeleccionado] = useState<boolean>(false)
    // const debounceTimeoutRef = useRef<any>(null)

    const query = props?.query || {}

    const rows = props?.data?.data || []
    const rowCount = props?.data?.cantidadRegistros || 0
    const columnsDataGrid = props?.columnsDataGrid || []

    // useEffect(() => {
    //     if (props?.data?.codigoPresupuesto > 0) {
    //         setIsPresupuestoSeleccionado(true)
    //     }
    // }, [props?.data?.codigoPresupuesto])

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const handleSizeChange = (newPageSize: number) => {
        setPage(0)
        setPageSize(newPageSize)
    }

    // const handleSearch = (value: string) => {
    //     if (value === '') {
    //         setSearchText('')
    //         setBuffer('')

    //         return
    //     }

    //     const newBuffer = value
    //     setBuffer(newBuffer)
    //     debouncedSearch()
    // }

    // const debouncedSearch = () => {
    //     clearTimeout(debounceTimeoutRef.current)

    //     debounceTimeoutRef.current = setTimeout(() => {
    //         setSearchText(buffer)
    //     }, 2500)
    // }

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
                            columns={columnsDataGrid}
                            pageSize={pageSize}
                            page={pageNumber}
                            getRowHeight={() => 'auto'}
                            sortingMode='server'
                            paginationMode='server'
                            rowsPerPageOptions={[5, 10, 50]}
                            onPageSizeChange={handleSizeChange}
                            onPageChange={handlePageChange}

                            // components={{ Toolbar: ServerSideToolbar }}
                            // componentsProps={{
                            //     baseButton: {
                            //         variant: 'outlined'
                            //     },
                            //     toolbar: {
                            //         printOptions: { disableToolbarButton: true },
                            //         value: buffer,
                            //         clearSearch: () => handleSearch(''),
                            //         onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value)
                            //     }
                            // }}
                        />
                    </StyledDataGridContainer>
                )
            }
        </>
    )
}

export default DataGridComponent
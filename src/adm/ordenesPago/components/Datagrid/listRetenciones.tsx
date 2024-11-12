import { useState, ChangeEvent, useRef } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, styled } from '@mui/material'
import Spinner from 'src/@core/components/spinner'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'
import ColumnsDataGrid from '../../config/Datagrid/columnsDataGridRetenciones'

import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { setCompromisoSeleccionadoDetalle, setIsOpenDialogListCompromiso } from "src/store/apps/ordenPago"
import useServices from '../../services/useServices'

const StyledDataGridContainer = styled(Box)(() => ({
  height: 600,
}))

const DataGridComponent = () => {
  const [pageNumber, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(5)
  const [searchText, setSearchText] = useState<string>('')
  const [buffer, setBuffer] = useState<string>('')

  const qc: QueryClient = useQueryClient()
  const debounceTimeoutRef = useRef<any>(null)
  const dispatch = useDispatch()

  const query = useQuery({
    queryKey: ['compromisosTable', pageSize, pageNumber, searchText],
    // queryFn: () => getCompromisoByPresupuesto({ ...filter, pageSize, pageNumber, searchText }),
    initialData: () => {
      return qc.getQueryData(['compromisosTable', pageSize, pageNumber, searchText])
    },
    staleTime: 1000 * 60,
    retry: 3,
  }, qc)

  // const rows = query?.data?.data || []
  // const rowCount = query?.data?.cantidadRegistros || 0

  const rows: any = []
  const rowCount: number = 0

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleSizeChange = (newPageSize: number) => {
    setPage(0)
    setPageSize(newPageSize)
  }

  return (
    <>
      {
        query.isLoading ? (<Spinner sx={{ height: '100%' }} />) : rows && (
          <StyledDataGridContainer>
            <DataGrid
              autoHeight
              pagination
              getRowId={(row) => row.codigoCompromiso}
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
              // onRowDoubleClick={row => handleDoubleClick(row)}
              // components={{ Toolbar: ServerSideToolbar }}
              // componentsProps={{
              //   baseButton: {
              //     variant: 'outlined'
              //   },
              //   toolbar: {
              //     printOptions: { disableToolbarButton: true },
              //     value: buffer,
              //     clearSearch: () => handleSearch(''),
              //     onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value),
              //     sx: { paddingLeft: 0, paddingRight: 0 }
              //   }
              // }}
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
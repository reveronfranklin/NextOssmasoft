import { useState } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, styled } from '@mui/material'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import { useServicesRetenciones } from '../../services/index'
import { setRetencionSeleccionado } from 'src/store/apps/ordenPago'
import { useDispatch } from 'react-redux'
import { Retencion } from '../../interfaces/responseRetenciones.interfaces'
import ColumnsDataGrid from '../../config/Datagrid/columnsDataGridRetenciones'
import Spinner from 'src/@core/components/spinner'

const StyledDataGridContainer = styled(Box)(() => ({
  height: 'auto',
}))

const DataGridComponent = () => {
  const [pageNumber, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(5)
  const [searchText] = useState<string>('')

  const qc: QueryClient = useQueryClient()
  const dispatch = useDispatch()
  const { getRetenciones } = useServicesRetenciones()

  const query = useQuery({
    queryKey: ['retencionesTable', pageSize, pageNumber, searchText],
    queryFn: () => getRetenciones(),
    initialData: () => {
      return qc.getQueryData(['retencionesTable', pageSize, pageNumber, searchText])
    },
    staleTime: 1000 * 60,
    retry: 3,
  }, qc)

  const rows = query?.data?.data || []
  const rowCount = query?.data?.data?.length || 0

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleSizeChange = (newPageSize: number) => {
    setPage(0)
    setPageSize(newPageSize)
  }

  const handleDoubleClick = (data: { row: Retencion }) => {
    const { row } = data
    dispatch(setRetencionSeleccionado(row))
  }

  const paginatedRows = rows.slice(pageNumber * pageSize, pageNumber * pageSize + pageSize)

  return (
    <>
      {
        query.isLoading ? (<Spinner sx={{ height: '100%' }} />) : rows && (
          <StyledDataGridContainer>
            <DataGrid
              autoHeight
              pagination
              getRowId={(row) => row.codigoRetencion}
              rows={paginatedRows}
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
              onRowDoubleClick={row => handleDoubleClick(row)}
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
import { useState } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, styled, Typography } from '@mui/material'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import { useServicesRetenciones } from '../../services/index'
import { setRetencionSeleccionado, setIsOpenDialogListRetenciones } from 'src/store/apps/ordenPago'
import { useDispatch } from 'react-redux'
import { Retencion } from '../../interfaces/responseRetenciones.interfaces'
import ColumnsDataGrid from '../../config/Datagrid/columnsDataGridRetenciones'
import Spinner from 'src/@core/components/spinner'

const StyledDataGridContainer = styled(Box)(() => ({
  height: 'auto',
}))

const LegendContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`
}))

const DataGridComponent = ({ onRowDoubleClick }: { onRowDoubleClick?: () => void }) => {
  const [pageNumber, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(5)
  const [searchText] = useState<string>('')

  const [selectedRow, setSelectedRow] = useState<Retencion | null>(null)

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

  const handleRowClick = (params: { row: Retencion }) => {
    dispatch(setRetencionSeleccionado(params.row))
    setSelectedRow(params.row)
  }

  const handleRowDoubleClick = (params: { row: Retencion }) => {
    dispatch(setRetencionSeleccionado(params.row))
    dispatch(setIsOpenDialogListRetenciones(false))

    if (onRowDoubleClick) {
      onRowDoubleClick()
    }
  }

  const paginatedRows = rows.slice(pageNumber * pageSize, pageNumber * pageSize + pageSize)

  return (
    <>
      {
        query.isLoading ? (<Spinner sx={{ height: '100%' }} />) : rows && (
          <StyledDataGridContainer>
            <LegendContainer>
              <Typography variant="caption" color="text.secondary">
                Haz clic para seleccionar - Doble clic para seleccionar y salir
              </Typography>
            </LegendContainer>
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
              onRowClick={handleRowClick}
              onRowDoubleClick={handleRowDoubleClick}
              selectionModel={selectedRow ? [selectedRow.codigoRetencion] : []}
              sx={{
                '& .MuiDataGrid-row': {
                  cursor: 'pointer'
                }
              }}
            />
          </StyledDataGridContainer>
        )
      }
    </>
  )
}

const Component = ({ onRowDoubleClick }: { onRowDoubleClick?: () => void }) => {
  return (
    <DataGridComponent onRowDoubleClick={onRowDoubleClick} />
  )
}

export default Component
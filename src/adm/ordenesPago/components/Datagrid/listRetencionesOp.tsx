import { useState } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, styled } from '@mui/material'
import Spinner from 'src/@core/components/spinner'
import ColumnsDataGrid from '../../config/Datagrid/columnsDataGridRetencionesOp'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import { useServicesRetencionesOp } from '../../services/index'
import { setIsCollapseRetenciones, setRetencionOpSeleccionado } from 'src/store/apps/ordenPago'
import { useDispatch } from 'react-redux'
import { Retencion } from '../../interfaces/responseRetenciones.interfaces'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

const StyledDataGridContainer = styled(Box)(() => ({
  height: 400,
}))

interface IfilterByOrdenPago {
  codigoOrdenPago: number
}

const DataGridComponent = () => {
  const [pageNumber, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(5)
  const [searchText] = useState<string>('')

  const qc: QueryClient = useQueryClient()
  const dispatch = useDispatch()
  const { getRetencionesOpByOrdenPago } = useServicesRetencionesOp()

  const { codigoOrdenPago } = useSelector((state: RootState) => state.admOrdenPago)

  const filter: IfilterByOrdenPago = { codigoOrdenPago }

  const query = useQuery({
    queryKey: ['retencionesOpTable', pageSize, pageNumber, searchText, filter],
    queryFn: () => getRetencionesOpByOrdenPago(filter),
    initialData: () => {
      return qc.getQueryData(['retencionesOpTable', pageSize, pageNumber, searchText, filter])
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

    dispatch(setRetencionOpSeleccionado(row))
    dispatch(setIsCollapseRetenciones(true))
  }

  return (
    <>
      {
        query.isLoading ? (<Spinner sx={{ height: '100%' }} />) : rows && (
          <StyledDataGridContainer>
            <DataGrid
              autoHeight
              pagination
              getRowId={(row) => row.codigoRetencionOp}
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
import { useState, useCallback } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, styled } from '@mui/material'
import Spinner from 'src/@core/components/spinner'
import useServicesDocumentosOp from '../../services/useServicesDocumentosOp'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import ColumnsDataGridListCompromiso from '../../config/Datagrid/columnsDataGridListDocumentosOp'
import { RootState } from "src/store"
import { useSelector } from "react-redux"
import { Documentos, IGetListByOrdenPago } from './../../interfaces/documentosOp/listDocumentoByOrdenPago'
import { setDocumentCount } from "src/store/apps/ordenPago"

const StyledDataGridContainer = styled(Box)(() => ({
  height: 600,
  overflowY: 'auto',
}))

const DataGridComponent = () => {
  const [pageNumber, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(5)

  const qc: QueryClient = useQueryClient()
  const { codigoOrdenPago } = useSelector((state: RootState) => state.admOrdenPago)

  const { getListDocumentos } = useServicesDocumentosOp()

  const columnsDataGridListCompromiso = ColumnsDataGridListCompromiso()

  const filter: IGetListByOrdenPago = { codigoOrdenPago }

  const query = useQuery({
    queryKey: ['documentosTable', pageSize, pageNumber, codigoOrdenPago],
    queryFn: () => getListDocumentos(filter),
    initialData: () => {
      return qc.getQueryData(['documentosTable', pageSize, pageNumber, codigoOrdenPago])
    },
    staleTime: 1000 * 60,
    retry: 3,
  }, qc)

  const rows: Documentos[] = query?.data?.data || []
  const rowCount = query?.data?.cantidadRegistros

  setDocumentCount(rowCount)

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const handleSizeChange = useCallback((newPageSize: number) => {
    setPage(0)
    setPageSize(newPageSize)
  }, [])

  return (
    <>
      {
        query.isLoading ? (<Spinner sx={{ height: '100%' }} />) : rows && (
          <StyledDataGridContainer>
            <DataGrid
              autoHeight
              pagination
              getRowId={(row) => row.codigoDocumentoOp}
              rows={rows}
              rowCount={rowCount}
              columns={columnsDataGridListCompromiso}
              pageSize={pageSize}
              page={pageNumber}
              getRowHeight={() => 'auto'}
              sortingMode='server'
              paginationMode='server'
              rowsPerPageOptions={[5, 10, 50]}
              onPageSizeChange={handleSizeChange}
              onPageChange={handlePageChange}
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

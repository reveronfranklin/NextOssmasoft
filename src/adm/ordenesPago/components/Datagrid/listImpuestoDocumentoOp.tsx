import { useState } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, Grid, styled } from '@mui/material'
import Spinner from 'src/@core/components/spinner'
import { useServicesImpuestosDocumentosOp } from '../../services/index'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import columnsDataGridListImpuestoDocumentoOp from '../../config/Datagrid/columnsDataGridListImpuestoDocumentoOp'

// import { RootState } from "src/store"
// import { useSelector } from "react-redux"
// import { Documentos, IGetListByOrdenPago } from './../../interfaces/documentosOp/listDocumentoByOrdenPago'
// import {
//   setDocumentCount
// } from "src/store/apps/ordenPago"

const StyledDataGridContainer = styled(Box)(() => ({
  height: 600,
  overflowY: 'auto',
}))

const DataGridComponent = () => {
  const [pageNumber, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(5)

  const qc: QueryClient = useQueryClient()
  const {
    message, loading,
    getListImpuestoDocumentosOp
  } = useServicesImpuestosDocumentosOp()

  const filter: any = { codigoDocumentoOp: 23275 }

  const query = useQuery({
    queryKey: ['impuestoDocumentosTable', pageSize, pageNumber],
    queryFn: () => getListImpuestoDocumentosOp(filter),
    initialData: () => {
      return qc.getQueryData(['impuestoDocumentosTable', pageSize, pageNumber])
    },
    staleTime: 1000 * 60,
    retry: 3,
  }, qc)

  const rows: any[] = query.data?.data || []
  const rowCount = query.data?.cantidadRegistros ?? 0

  const total1 = query.data?.total1 ?? 0
  const total2 = query.data?.total2 ?? 0
  const total3 = query.data?.total3 ?? 0
  const total4 = query.data?.total4 ?? 0

  const handleDoubleClick = (data: any) => {
    const { row } = data
    console.log(row)

  //   dispatch(setDocumentoOpSeleccionado(row))
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleSizeChange = (newPageSize: number) => {
    setPage(0)
    setPageSize(newPageSize)
  }

  return (
    <>
      <Grid container spacing={0} paddingTop={0} justifyContent="flex-end">
        <Grid item xs={2} sm={6}>
          <small style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'flex-end' }}>
              <label style={{ marginRight: '5px' }}><b>Por imputar:</b></label>
              { total1 }
            </div>
          </small>
          <small style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
              <label style={{ marginRight: '5px' }}><b>Total:</b></label>
              <label>{ total2 } </label>
            </div>
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
              <label style={{ marginRight: '5px' }}><b>Impuesto:</b></label>
              { total3 }
            </div>
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
              <label style={{ marginRight: '5px' }}><b>Total más Impuesto:</b></label>
              { total4 }
            </div>
          </small>
        </Grid>
      </Grid>
      {
        query.isLoading ? (<Spinner sx={{ height: '100%' }} />) : rows && (
          <StyledDataGridContainer>
            <DataGrid
              autoHeight
              pagination
              getRowId={(row) => row.codigoImpuestoDocumentoOp}
              rows={rows}
              rowCount={rowCount}
              columns={columnsDataGridListImpuestoDocumentoOp() as any}
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

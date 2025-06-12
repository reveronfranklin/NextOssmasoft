import { useState, useMemo } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, Grid, styled } from '@mui/material'
import Spinner from 'src/@core/components/spinner'
import { useServicesImpuestosDocumentosOp } from '../../services/index'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import columnsDataGridListImpuestoDocumentoOp from '../../config/Datagrid/columnsDataGridListImpuestoDocumentoOp'
import { setImpuestoDocumentoOpSeleccionado, setBaseImponibleDocumentosOp } from "src/store/apps/ordenPago"
import FormatNumber from 'src/utilities/format-numbers'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'src/store'

const StyledDataGridContainer = styled(Box)(() => ({
  height: '100%',
  maxHeight: 600,
  overflowY: 'auto',
  width: '100%',
}))

const DataGridComponent = () => {
  const [pageNumber, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(5)

  const qc: QueryClient = useQueryClient()
  const dispatch = useDispatch()
  const { getListImpuestoDocumentosOp } = useServicesImpuestosDocumentosOp()

  const { documentoOpSeleccionado } = useSelector((state: RootState) => state.admOrdenPago)

  const filter = useMemo(() => ({
    codigoDocumentoOp: documentoOpSeleccionado.codigoDocumentoOp
  }), [documentoOpSeleccionado.codigoDocumentoOp])

  const query = useQuery({
    queryKey: ['impuestoDocumentosTable', pageSize, pageNumber, filter],
    queryFn: () => getListImpuestoDocumentosOp(filter),
    initialData: () => {
      return qc.getQueryData(['impuestoDocumentosTable', pageSize, pageNumber])
    },
    staleTime: 1000 * 60,
    retry: 3,
  }, qc)

  const rows: any[] = query.data?.data || []
  const rowCount = query.data?.cantidadRegistros ?? 0

  const total1 = query.data?.total1 ?? 0 //base Imponible
  const total2 = query.data?.total2 ?? 0 //total MontoImpuesto
  const total3 = query.data?.total3 ?? 0 //impuesto exento
  const total4 = query.data?.total4 ?? 0 //monto retenido

  dispatch(setBaseImponibleDocumentosOp(total1))

  const handleDoubleClick = (data: any) => {
    const { row } = data
    dispatch(setImpuestoDocumentoOpSeleccionado(row))
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
              <label style={{ marginRight: '5px' }}><b>Base Imponible:</b></label>
              { FormatNumber(total1) }
            </div>
          </small>
          <small style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
              <label style={{ marginRight: '5px' }}><b>Monto Impuesto:</b></label>
              <label>{ FormatNumber(total2) } </label>
            </div>
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
              <label style={{ marginRight: '5px' }}><b>Impuesto Exento:</b></label>
              { FormatNumber(total3) }
            </div>
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
              <label style={{ marginRight: '5px' }}><b>Monto Retenido:</b></label>
              { FormatNumber(total4) }
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

const Component = () => {
  return (
    <DataGridComponent />
  )
}

export default Component

"use client"

import { useState, useCallback } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, Grid, styled } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { RootState } from "src/store"
import { useSelector } from "react-redux"
import { IGetListByOrdenPago } from './../../interfaces/documentosOp/listDocumentoByOrdenPago'
import { setDocumentCount, setBaseTotalDocumentos } from "src/store/apps/ordenPago"
import { useDispatch } from 'react-redux'
import { useDocumentosOpData } from '../../hooks/useDocumentosOpData'

import ColumnsDataGridListCompromiso from '../../config/Datagrid/columnsDataGridListDocumentosOp'
import FormatNumber from 'src/utilities/format-numbers'
import Spinner from 'src/@core/components/spinner'

const StyledDataGridContainer = styled(Box)(() => ({
  height: 600,
  overflowY: 'auto',
}))

const DataGridComponent = () => {
  const [pageNumber, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(5)

  const { codigoOrdenPago } = useSelector((state: RootState) => state.admOrdenPago)
  const { fetchDocumentos } = useDocumentosOpData();

  const columnsDataGridListCompromiso = ColumnsDataGridListCompromiso()
  const dispatch = useDispatch()

  const filter: IGetListByOrdenPago = { codigoOrdenPago }

  const query = useQuery({
    queryKey: ['documentosTable', pageSize, pageNumber, codigoOrdenPago],
    queryFn: () => fetchDocumentos(filter),
  })

  const rows = query.isSuccess ? query.data.data : []

  const rowCount = query.isSuccess ? query.data.cantidadRegistros : 0;
  const total1 = query.data?.total1 ?? 0
  const total2 = query.data?.total2 ?? 0

  dispatch(setDocumentCount(rowCount))
  dispatch(setBaseTotalDocumentos(total1))

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const handleSizeChange = useCallback((newPageSize: number) => {
    setPage(0)
    setPageSize(newPageSize)
  }, [])

  return (
    <>
      <Grid container spacing={0} paddingTop={0} justifyContent="flex-end">
        <Grid item xs={2} sm={6}>
          <small style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ padding: '10px', display: 'flex', justifyContent: 'flex-end' }}>
              <label style={{ marginRight: '5px' }}><b>Monto total documento:</b></label>
              {FormatNumber(total1 + total2)}
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
              getRowId={(row) => row.codigoDocumentoOp }
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

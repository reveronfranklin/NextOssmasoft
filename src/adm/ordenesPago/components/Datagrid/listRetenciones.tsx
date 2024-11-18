import { useState } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, styled } from '@mui/material'
import Spinner from 'src/@core/components/spinner'
import ColumnsDataGrid from '../../config/Datagrid/columnsDataGridRetenciones'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import { useServicesRetenciones } from '../../services/index'
import { setIsCollapseRetenciones, setRetencionSeleccionado } from 'src/store/apps/ordenPago'
import { useDispatch } from 'react-redux'
import { Retencion } from '../../interfaces/responseRetenciones.interfaces'

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
  const { getRetencionesByOrdenPago } = useServicesRetenciones()

  // const { compromisoSeleccionadoListaDetalle } = useSelector((state: RootState) => state.admOrdenPago)

  // const { codigoOrdenPago } = compromisoSeleccionadoListaDetalle
  const filter: IfilterByOrdenPago = { codigoOrdenPago: 17270 } //todo quitar esto al subir a producción

  const query = useQuery({
    queryKey: ['retencionesTable', pageSize, pageNumber, searchText],
    queryFn: () => getRetencionesByOrdenPago(filter),
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
    dispatch(setIsCollapseRetenciones(true))
    dispatch(setRetencionSeleccionado(row))
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
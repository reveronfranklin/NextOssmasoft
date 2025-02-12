import { useState } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, styled } from '@mui/material'
import Spinner from 'src/@core/components/spinner'
import useServicesDocumentosOp from '../../services/useServicesDocumentosOp'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import ColumnsDataGridListCompromiso from '../../config/Datagrid/columnsDataGridListDocumentosOp'
import { setDocumentoOpSeleccionado, setIsOpenDialogDocumentosEdit } from "src/store/apps/ordenPago"
import { useDispatch } from 'react-redux'
import { RootState } from "src/store"
import { useSelector } from "react-redux"
import { Documentos, IGetListByOrdenPago } from './../../interfaces/documentosOp/listDocumentoByOrdenPago'

const StyledDataGridContainer = styled(Box)(() => ({
  height: 600,
  overflowY: 'auto',
}))

const DataGridComponent = () => {
  const [pageNumber, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(5)

  // const [searchText, setSearchText] = useState<string>('')
  // const [buffer, setBuffer] = useState<string>('')
  // const debounceTimeoutRef = useRef<any>(null)

  const qc: QueryClient = useQueryClient()
  const dispatch = useDispatch()

  const { getListDocumentos } = useServicesDocumentosOp()

  const { codigoOrdenPago } = useSelector((state: RootState) => state.admOrdenPago)
  const filter: IGetListByOrdenPago = { codigoOrdenPago }

  const query = useQuery({
    queryKey: ['documentosTable', pageSize, pageNumber],
    queryFn: () => getListDocumentos(filter),
    initialData: () => {
      return qc.getQueryData(['documentosTable', pageSize, pageNumber])
    },
    staleTime: 1000 * 60,
    retry: 3,
  }, qc)

  const rows: Documentos[] = query?.data?.data || []
  const rowCount = rows && Array.isArray(rows) ? rows.length : 0

  const handleDoubleClick = (data: any) => {
    const { row } = data
    dispatch(setDocumentoOpSeleccionado(row))
    setTimeout(() => {
      dispatch(setIsOpenDialogDocumentosEdit(true))
    }, 1500)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleSizeChange = (newPageSize: number) => {
    setPage(0)
    setPageSize(newPageSize)
  }

  // const handleSearch = (value: string) => {
  //   if (value === '') {
  //     setSearchText('')
  //     setBuffer('')

  //     return
  //   }

  //   const newBuffer = value
  //   setBuffer(newBuffer)
  //   debouncedSearch()
  // }

  // const debouncedSearch = () => {
  //   clearTimeout(debounceTimeoutRef.current)

  //   debounceTimeoutRef.current = setTimeout(() => {
  //     setSearchText(buffer)
  //   }, 2500)
  // }

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
              columns={ColumnsDataGridListCompromiso() as any}
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
                // toolbar: {
                //   printOptions: { disableToolbarButton: true },
                //   value: buffer,
                //   clearSearch: () => handleSearch(''),
                //   onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value),
                //   sx: { paddingLeft: 0, paddingRight: 0 }
                // }
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

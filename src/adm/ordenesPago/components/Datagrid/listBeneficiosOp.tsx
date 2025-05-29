import { useState } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, styled } from '@mui/material'
import Spinner from 'src/@core/components/spinner'
import ColumnsDataGridBeneficioOp from '../../config/Datagrid/columnsDataGridBeneficioOp'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import { useServicesBeneficiarioOp } from '../../services/index'
import { setIsCollapseRetenciones, setBeneficioOpSeleccionado } from 'src/store/apps/ordenPago'
import { useDispatch } from 'react-redux'

import { IUpdateMontoBeneficiarioOp } from '../../interfaces/admBeneficiarioOp/updateMontoBeneficiarioOp.interfaces'
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
  const { getBeneficiarioOpByOrdenPago, updateBeneficiarioOpMonto } = useServicesBeneficiarioOp()

  const { compromisoSeleccionadoListaDetalle } = useSelector((state: RootState) => state.admOrdenPago)
  const { codigoOrdenPago } = compromisoSeleccionadoListaDetalle

  const filter: IfilterByOrdenPago = { codigoOrdenPago }

  const query = useQuery({
    queryKey: ['beneficioOpTable', pageSize, pageNumber, searchText, filter],
    queryFn: () => getBeneficiarioOpByOrdenPago(filter),
    initialData: () => {
      return qc.getQueryData(['beneficioOpTable', pageSize, pageNumber, searchText])
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

  const handleDoubleClick = (data: { row: any }) => {
    const { row } = data
    dispatch(setIsCollapseRetenciones(true))
    dispatch(setBeneficioOpSeleccionado(row))
  }

  const handleOnCellEditCommit = async (row: any) => {
    const updateDto: IUpdateMontoBeneficiarioOp = {
      codigoBeneficiarioOp: row.id,
      monto: row.value
    }

    try {
      await updateBeneficiarioOpMonto(updateDto)

    } catch (error) {
      console.error(error)
    } finally {
      qc.invalidateQueries({ queryKey: ['beneficioOpTable'] })
    }
  }

  return (
    <>
      {
        query.isLoading ? (<Spinner sx={{ height: '100%' }} />) : rows && (
          <StyledDataGridContainer>
            <DataGrid
              autoHeight
              pagination
              getRowId={(row) => row?.codigoBeneficiarioOp}
              rows={rows}
              rowCount={rowCount}
              columns={ColumnsDataGridBeneficioOp() as any}
              pageSize={pageSize}
              page={pageNumber}
              getRowHeight={() => 'auto'}
              sortingMode='server'
              paginationMode='server'
              rowsPerPageOptions={[5, 10, 50]}
              onPageSizeChange={handleSizeChange}
              onPageChange={handlePageChange}
              onRowDoubleClick={row => handleDoubleClick(row)}
              onCellEditCommit={row => handleOnCellEditCommit(row)}
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
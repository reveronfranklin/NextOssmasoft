import { useState, ChangeEvent, useMemo, useEffect } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, styled, Typography } from '@mui/material'
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import { useServicesRetenciones } from '../../services/index'
import { setRetencionSeleccionado, setIsOpenDialogListRetenciones } from 'src/store/apps/ordenPago'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from "src/store"
import { Retencion } from '../../interfaces/responseRetenciones.interfaces'
import ColumnsDataGrid from '../../config/Datagrid/columnsDataGridRetenciones'
import Spinner from 'src/@core/components/spinner'

import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'
import { IRetencionData } from '../../interfaces/retencionesOp/createRetencionOp'

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
  const [selectedRow, setSelectedRow] = useState<Retencion | null>(null)

  const [searchText, setSearchText] = useState<string>('')
  const [buffer, setBuffer] = useState<string>('')

  const qc: QueryClient = useQueryClient()
  const dispatch = useDispatch()
  const { getRetenciones } = useServicesRetenciones()

  const { tipoRetencion } = useSelector((state: RootState) => state.admOrdenPago)

  const query = useQuery({
    queryKey: ['retencionesTable', tipoRetencion],
    queryFn: () => getRetenciones(),
    initialData: () => qc.getQueryData(['retencionesTable', tipoRetencion]),
    staleTime: 1000 * 60,
  })

  const allRows = query?.data?.data || []

  const handleSearch = (value: string) => {
    setSearchText(value);
    setBuffer(value);
  };

  // Cambia el filteredRows para que también filtre por concepto:
  const filteredRows = useMemo(() => {
    let rows = allRows;
    if (tipoRetencion !== 0) {
      rows = rows.filter((row: IRetencionData) => row.tipoRetencionId === tipoRetencion);
    }

    if (searchText.trim() !== '') {
      rows = rows.filter((row: IRetencionData) =>
        row.conceptoPago?.toLowerCase().includes(searchText.trim().toLowerCase())
      );
    }

    return rows;
  }, [allRows, tipoRetencion, searchText])

  const rowCount = filteredRows.length

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

  const paginatedRows = filteredRows.slice(pageNumber * pageSize, pageNumber * pageSize + pageSize)

  useEffect(() => {
    if (tipoRetencion !== undefined) {
      query.refetch()
    }
  }, [tipoRetencion])

  return (
    <>
      {
        query.isLoading ? (<Spinner sx={{ height: '100%' }} />) : filteredRows && (
          <StyledDataGridContainer>
            <LegendContainer>
              <Typography variant="caption" color="text.secondary">
                Haz clic para seleccionar - Doble clic para seleccionar y salir
              </Typography>
            </LegendContainer>
            <DataGrid
              autoHeight
              pagination
              getRowId={(filteredRows) => filteredRows.codigoRetencion}
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
              components={{ Toolbar: ServerSideToolbar }}
              componentsProps={{
                baseButton: {
                  variant: 'outlined'
                },
                toolbar: {
                  printOptions: { disableToolbarButton: true },
                  value: buffer,
                  clearSearch: () => handleSearch(''),
                  onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value),
                  sx: { paddingLeft: 0, paddingRight: 0 }
                }
              }}
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
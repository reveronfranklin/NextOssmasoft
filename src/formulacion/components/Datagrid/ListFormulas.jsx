import { useState, useCallback, useRef, useEffect } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, styled } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import Spinner from 'src/@core/components/spinner'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'
import { useFormulaContext } from 'src/formulacion/context/FormulaContext';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

const StyledDataGridContainer = styled(Box)(() => ({
  height: 400,
  overflowY: 'auto',
}))

const ListFormulas = ({
    formulas,
    onFunctionSelect,
    onDeleteFormula,
    setSelectedFormula
  }) => {
  const [pageNumber, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [searchText, setSearchText] = useState('')
  const [buffer, setBuffer] = useState('')
  const debounceTimeoutRef = useRef(null)

  const [isQueryEnabled, setIsQueryEnabled] = useState(false);
  const [rows, setRows] = useState(formulas || []);
  const [rowCount, setRowCount] = useState(formulas ? formulas.length : 0);

  const { formulaService } = useFormulaContext();
  const { getListFormulas } = formulaService;

  const columnsDataGridListCompromiso = [{
      flex: 0,
      field: 'id',
      headerName: 'ID',
      width: 90
    },
    {
      flex: 0,
      field: 'descripcion',
      headerName: 'Descripcion',
      width: 200
    },
    {
      flex: 0,
      field: 'formula',
      headerName: 'Formula',
      width: 750
    },
    {
      flex: 1,
      field: 'acciones',
      headerName: 'Acciones',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          color="error"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteFormula(params.row.id);
          }}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ]

  const query = useQuery({
    queryKey: ['formulasTable', pageSize, pageNumber, searchText],
    queryFn: () => getListFormulas({
      page: 1,
      limit: 10,
      searchText
    }),
    enabled: isQueryEnabled
  })

  useEffect(() => {
    if (!isQueryEnabled && formulas) {
      setRows(formulas);
      setRowCount(formulas.length);
    }
  }, [formulas, isQueryEnabled]);

  useEffect(() => {
    if (query.isSuccess && isQueryEnabled) {
      setRows(query.data.data);
      setRowCount(query.data.cantidadRegistros);
    }
  }, [query.isSuccess, query.data, isQueryEnabled]);

  useEffect(() => {
    if (pageNumber !== 1 || pageSize !== 5 || searchText !== '') {
      setIsQueryEnabled(true);
    }
  }, [pageNumber, pageSize, searchText]);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage)
  }, [])

  const handleSizeChange = useCallback((newPageSize) => {
    setPage(0)
    setPageSize(newPageSize)
  }, [])

  const handleRowClick = (params) => {
    const formula = `[${params.row.formula}]`
    const description = params.row.descripcion || ''

    setSelectedFormula(params.row);
    onFunctionSelect(formula, description);
  }

  const handleSearch = (value) => {
    if (value === '') {
      setSearchText('')
      setBuffer('')

      return
    }

    const newBuffer = value
    setBuffer(newBuffer)
    debouncedSearch()
  }

  const debouncedSearch = () => {
    clearTimeout(debounceTimeoutRef.current)

    debounceTimeoutRef.current = setTimeout(() => {
      setSearchText(buffer)
    }, 2500)
  }

  return (
    <>
      { query.isLoading ? (
          <Spinner sx={{ height: '100%' }} />
        ) : rows && (
          <StyledDataGridContainer>
            <DataGrid
              autoHeight
              pagination
              getRowId={(row) => row.id}
              rows={rows}
              rowCount={rowCount}
              columns={columnsDataGridListCompromiso}
              pageSize={pageSize}
              page={pageNumber}
              getRowHeight={() => 'auto'}
              sortingMode='server'
              paginationMode='server'
              rowsPerPageOptions={[5, 10, 20]}
              onPageSizeChange={handleSizeChange}
              onPageChange={handlePageChange}
              onRowClick={handleRowClick}
              components={{ Toolbar: ServerSideToolbar }}
              componentsProps={{
                baseButton: {
                    variant: 'outlined'
                },
                toolbar: {
                    printOptions: { disableToolbarButton: true },
                    value: buffer,
                    clearSearch: () => handleSearch(''),
                    onChange: (event) => handleSearch(event.target.value),
                    sx: { paddingLeft: 0, paddingRight: 0 }
                }
              }}
            />
          </StyledDataGridContainer>
        )
      }
    </>
  )
}

export default ListFormulas
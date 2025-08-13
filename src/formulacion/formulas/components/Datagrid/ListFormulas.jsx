import { useState, useRef, useEffect } from 'react'
import { DataGrid } from "@mui/x-data-grid"
import { Box, styled } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import Spinner from 'src/@core/components/spinner'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'
import { useFormulaContext } from 'src/formulacion/context/FormulaContext';

const StyledDataGridContainer = styled(Box)(() => ({
  height: 500,
  overflowY: 'auto',
}))

const ListFormulas = ({
    formulas,
    onFunctionSelect,
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

  const columnsDataGridListCompromiso = [
    {
      flex: 0,
      field: 'id',
      headerName: 'ID',
      width: 90
    },
    {
      flex: 0,
      field: 'descripcion',
      headerName: 'Descripcion',
      width: 350
    },
    {
      flex: 1,
      field: 'formula',
      headerName: 'Formula',
    }
  ]

  const query = useQuery({
    queryKey: ['formulasTable', pageSize, pageNumber, searchText],
    queryFn: () => getListFormulas({
      page: pageNumber,
      limit: pageSize,
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

  const handlePageChange = (newPage) => {
    setPage(newPage + 1);
  }

  const handleSizeChange = (newPageSize) => {
    setPage(1);
    setPageSize(newPageSize);
  }

  const handleRowClick = (params) => {
    const formula = `[${params.row.formula}]`
    const description = params.row.descripcion || ''

    setSelectedFormula(params.row);
    onFunctionSelect(formula, description, 'formula');
  }

  const handleSearch = (value) => {
    setBuffer(value);
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      setSearchText(value);
    }, 500);
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
              page={pageNumber - 1} // DataGrid espera base 0
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
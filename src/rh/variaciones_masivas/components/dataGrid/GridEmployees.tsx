import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query';
import { DataGrid, GridSelectionModel } from '@mui/x-data-grid';
import { Box, styled } from '@mui/material';
import Spinner from 'src/@core/components/spinner';
import ServerSideToolbarWithAddButton from 'src/views/table/data-grid/ServerSideToolbarWithAddButton';
import useColumnsGridEmployees from './headers/ColumnsGridEmployees';
import AlertMessage from 'src/views/components/alerts/AlertMessage';
import { useServices } from '../../services';
import { FilterEmployee } from '../../interfaces';
import { setIsExpandedAccordion, setListEmployeeCodes, setIsOpenSearchCriteriaDialog } from 'src/store/apps/rh-variaciones_masivas';
import { RootState } from 'src/store';

const StyledDataGridContainer = styled(Box)(() => ({
    height: 650,
    overflowY: 'auto'
}))

const DataGridComponent = () => {
    const dispatch = useDispatch()

    const { customQuery } = useSelector((state: RootState) => state.rhVariacionesMasivas )

    const [selectionModel, setSelectionModel]       = useState<GridSelectionModel>([]);
    const [pageNumber, setPage]                     = useState<number>(0)
    const [pageSize, setPageSize]                   = useState<number>(5)

    const queryClient: QueryClient  = useQueryClient()
    const { getList, message }      = useServices()
    const columns                   = useColumnsGridEmployees()

    const timeInMemory = 1000 * 60 * 30

    const filters: FilterEmployee = {
        p_where: customQuery
    }

    const { data, refetch, isLoading } = useQuery({
        queryKey: ['employeesTable'],
        queryFn: () => getList(filters),
        enabled: false,
        staleTime: timeInMemory,
        gcTime: timeInMemory,
        retry: 3
    }, queryClient)

    const rows      = data?.data || []
    const rowCount  = data?.cantidadRegistros || 0

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const handleSizeChange = (newPageSize: number) => {
        setPage(0)
        setPageSize(newPageSize)
    }

    const handleAdd = () => {
        dispatch(setIsExpandedAccordion(true))
    }

    const handleButtonRight = () => {
        dispatch(setIsOpenSearchCriteriaDialog(true))
    }

    const handleButtonRightTwo = () => {
        if (!filters.p_where || filters.p_where === '' || filters.p_where === '1=1') {
            console.log('Filtros vacíos: Limpiando tabla...')
            queryClient.removeQueries({ queryKey: ['employeesTable'] });

            return;
        }

        console.log('Ejecutando búsqueda con:', filters.p_where)
        refetch()
    }

    useEffect(() => {
        dispatch(setListEmployeeCodes(selectionModel as number[]))
    }, [selectionModel])

    return (
        <>
            {
                isLoading ? (<Spinner sx={{ height: '100%' }} />) : rows && (
                    <StyledDataGridContainer>
                        <DataGrid
                            autoHeight
                            pagination
                            getRowId={(row) => row.codigoPersona}
                            checkboxSelection
                            onSelectionModelChange={(newSelectionModel) => {
                                setSelectionModel(newSelectionModel);
                            }}
                            rows={rows}
                            rowCount={rowCount}
                            columns={columns}
                            pageSize={pageSize}
                            page={pageNumber}
                            getRowHeight={() => 'auto'}
                            sortingMode='server'
                            paginationMode='server'
                            rowsPerPageOptions={[5, 10, 50]}
                            onPageSizeChange={handleSizeChange}
                            onPageChange={handlePageChange}
                            components={{ Toolbar: ServerSideToolbarWithAddButton }}
                            componentsProps={{
                                baseButton: {
                                    variant: 'outlined'
                                },
                                toolbar: {
                                    printOptions: { disableToolbarButton: true },
                                    serverSideToolbarActive: false,
                                    addButton: true,
                                    titleButton: 'Agregar variación por lote',
                                    sx: {
                                        px: 3,
                                        mb: 3
                                    },
                                    onAdd: handleAdd,
                                    buttonRight: true,
                                    titleButtonRight: 'Agregar filtros',
                                    sxRight: {
                                        px: 3,
                                        mb: 3
                                    },
                                    disabledButtonRight: false,
                                    onButtonRight: handleButtonRight,
                                    buttonRightTwo: true,
                                    titleButtonRightTwo: 'Buscar',
                                    sxRightTwo: {
                                        px: 3,
                                        mb: 3
                                    },
                                    disabledButtonRightTwo: Boolean(!customQuery || customQuery.length === 0),
                                    onButtonRightTwo: handleButtonRightTwo,
                                    searchCustom: true,
                                    searchCustomText: customQuery
                                }
                            }}
                        />
                        <AlertMessage
                            message={message?.text ?? ''}
                            severity={message?.isValid ? 'success' : 'error'}
                            duration={10000}
                            show={message?.text ? true : false}
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
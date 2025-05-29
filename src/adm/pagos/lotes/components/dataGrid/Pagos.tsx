import { ChangeEvent, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Box, styled } from '@mui/material';
import Spinner from 'src/@core/components/spinner';
import ServerSideToolbarWithAddButton from 'src/views/table/data-grid/ServerSideToolbarWithAddButton';
import { RootState } from 'src/store';
import { setIsOpenDialogPago, setTypeOperation, setCodigoLote } from 'src/store/apps/pagos/lote-pagos';
import { selectLoteStatus } from 'src/store/apps/pagos/lotes';
import AlertMessage from 'src/views/components/alerts/AlertMessage';
import useColumnsDataGrid from './headers/ColumnsDataGridPagos';
import { useServicesPagos } from '../../services';
import { PagoFilterDto, PagoAmountDto } from '../../interfaces';

const StyledDataGridContainer = styled(Box)(() => ({
    height: 'auto',
    overflowY: 'auto'
}))

const DataGridComponent = () => {
    const [pageNumber, setPage]                                     = useState<number>(0)
    const [pageSize, setPageSize]                                   = useState<number>(5)
    const [searchText, setSearchText]                               = useState<string>('')
    const [buffer, setBuffer]                                       = useState<string>('')

    const debounceTimeoutRef    = useRef<any>(null)
    const qc: QueryClient       = useQueryClient()
    const dispatch              = useDispatch()

    const { codigoLote }    = useSelector((state: RootState) => state.admLote )
    const loteStatus        = useSelector(selectLoteStatus)

    const {
        getList,
        updateAmount,
        message
    }  = useServicesPagos()

    const columns   = useColumnsDataGrid()
    const staleTime = 1000 * 60 * 60

    const filter = {
        pageSize,
        pageNumber,
        searchText,
        codigoLote: codigoLote
    } as PagoFilterDto

    const query = useQuery({
        queryKey: ['lotePagosTable', codigoLote, pageSize, pageNumber, searchText],
        queryFn: () => getList(filter),
        initialData: () => {
            return qc.getQueryData(['lotePagosTable', codigoLote, pageSize, pageNumber, searchText])
        },
        staleTime: staleTime,
        retry: 3,
        enabled: (codigoLote !== null)
    }, qc)

    const rows      = query?.data?.data || []
    const rowCount  = query?.data?.cantidadRegistros || 0

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const handleSizeChange = (newPageSize: number) => {
        setPage(0)
        setPageSize(newPageSize)
    }

    const handleSearch = (value: string) => {
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

    const handleOnCellEditCommit = async (cell: any) => {
        const updateAmountData: PagoAmountDto = {
            codigoBeneficiarioPago: cell.row?.codigoBeneficiarioPago,
            monto: Number(cell.value)
        }

        try {
          await updateAmount(updateAmountData)
        } catch (error) {
          console.error('handleOnCellEditCommit', error)
        }
    }

    const handleCreate = async () => {
        dispatch(setTypeOperation('create'))
        setTimeout(() => {
            dispatch(setIsOpenDialogPago(true))
            dispatch(setCodigoLote(codigoLote))
        }, 1500)
    }

    const handleDownloadFile = async () => {
        console.log('handleDownloadFile')

        /* const element = document.createElement('a')
        const file = new Blob([textToDownload], { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = nameFile
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element) */
    }

    return (
        <>
            {
                query.isLoading ? (<Spinner sx={{ height: '100%' }} />) : rows && (
                    <StyledDataGridContainer>
                        <DataGrid
                            autoHeight
                            pagination
                            getRowId={(row) => row.codigoPago}
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
                            onCellEditCommit={ cell => handleOnCellEditCommit(cell) }
                            components={{ Toolbar: ServerSideToolbarWithAddButton }}
                            componentsProps={{
                                baseButton: {
                                    variant: 'outlined'
                                },
                                toolbar: {
                                    printOptions: { disableToolbarButton: true },
                                    value: buffer,
                                    clearSearch: () => handleSearch(''),
                                    onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value),
                                    onAdd: handleCreate,
                                    onDownloadFile: handleDownloadFile,
                                    downloadFile: (loteStatus === 'AP'),
                                    sx: {
                                        marginTop: 6,
                                        marginRight: 0,
                                        marginBottom: 8,
                                        marginLeft: 4
                                    }
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
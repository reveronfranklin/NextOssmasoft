import { ChangeEvent, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Box, styled } from '@mui/material';
import Spinner from 'src/@core/components/spinner';
import ServerSideToolbarWithAddButton from 'src/views/table/data-grid/ServerSideToolbarWithAddButton';
import { RootState } from 'src/store';
import { setIsOpenDialogPago, setTypeOperation, setCodigoLote } from 'src/store/apps/pagos/lote-pagos';
import { selectLoteStatus, selectLoteFileName } from 'src/store/apps/pagos/lotes';
import AlertMessage from 'src/views/components/alerts/AlertMessage';
import useColumnsDataGrid from './headers/ColumnsDataGridPagos';
import { useServices, useServicesPagos } from '../../services';
import { PagoFilterDto, PagoAmountDto } from '../../interfaces';

const StyledDataGridContainer = styled(Box)(() => ({
    height: 'auto',
    overflowY: 'auto'
}))

const DataGridComponent = () => {
    const [pageNumber, setPage]         = useState<number>(0)
    const [pageSize, setPageSize]       = useState<number>(5)
    const [searchText, setSearchText]   = useState<string>('')
    const [buffer, setBuffer]           = useState<string>('')

    const debounceTimeoutRef    = useRef<any>(null)
    const qc: QueryClient       = useQueryClient()
    const dispatch              = useDispatch()

    const { codigoLote }    = useSelector((state: RootState) => state.admLote )
    const loteStatus        = useSelector(selectLoteStatus)
    const loteFileName      = useSelector(selectLoteFileName)

    const {
        getList,
        updateAmount,
        message
    } = useServicesPagos()

    const {
        downloadFile,
        message: messageDownloadFile
    }  = useServices()

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

    const handleDownloadFile = async (fileName: string) => {
        if (!fileName) {
            console.error('File name is required for downloading.')

            return
        }

        const downloadedFile = await downloadFile(fileName)

        if (!downloadedFile || messageDownloadFile?.text) {
            console.error('Error downloading file:', messageDownloadFile?.text || downloadedFile?.message)

            return
        }

        const element       = document.createElement('a')
        const file          = new Blob([downloadedFile], { type: 'text/plain' })
        element.href        = URL.createObjectURL(file)
        element.download    = fileName

        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    const getSeverity = (): any => {
        let severity = 'success'

        if (message?.text) {
            severity = message?.isValid ? 'success' : 'error'
        }

        if (messageDownloadFile?.text) {
            severity = messageDownloadFile?.isValid ? 'success' : 'error'
        }

        return severity
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
                                    onDownloadFile: () => handleDownloadFile(loteFileName),
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
                            message={(message?.text || messageDownloadFile?.text) ?? ''}
                            severity={getSeverity()}
                            duration={10000}
                            show={(message?.text || messageDownloadFile?.text) ? true : false}
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
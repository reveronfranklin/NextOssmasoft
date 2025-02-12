import { createSlice } from "@reduxjs/toolkit";
import { Orden } from 'src/adm/ordenesPago/interfaces/responseGetOrdenes.interfaces'
import { Retencion } from 'src/adm/ordenesPago/interfaces/responseRetenciones.interfaces'
import { IRetencionData } from 'src/adm/ordenesPago/interfaces/retenciones/createRetencion'
import { BeneficiarioOp } from 'src/adm/ordenesPago/interfaces/admBeneficiarioOp/getListByOrdenPago.interfaces'
import { Documentos } from 'src/adm/ordenesPago/interfaces/documentosOp/listDocumentoByOrdenPago'

export const admOrdenPagoSlice = createSlice({
    name: 'admOrdenPago',
    initialState: {
        typeOperation: null,
        typeOperationDocumento: null,
        isCollapseRetenciones: false,
        isOpenDialogListCompromiso: false,
        isOpenDialogOrdenPagoDetalle: false,
        isOpenDialogListPucOrdenPago: false,
        isOpenDialogConfirmButtons: false,
        isOpenDialogListRetenciones: false,
        isOpenDialogListPucOrdenPagoEdit: false,
        isOpenDialogDocumentosEdit: false,
        isOpenViewerPdf: false,
        compromisoSeleccionadoListaDetalle: {} as Orden,
        retencionOpSeleccionado: {} as Retencion,
        retencionSeleccionado: {} as IRetencionData,
        beneficioOpSeleccionado: {} as BeneficiarioOp,
        documentoOpSeleccionado: {} as Documentos,
        pucSeleccionado: {} as any,
        codigoOrdenPago: 0,
    },
    reducers: {
        setIsOpenDialogListCompromiso: (state, action) => {
            state.isOpenDialogListCompromiso = action.payload
        },
        setIsOpenDialogOrdenPagoDetalle: (state, action) => {
            state.isOpenDialogOrdenPagoDetalle = action.payload
        },
        setIsOpenDialogListPucOrdenPago: (state, action) => {
            state.isOpenDialogListPucOrdenPago = action.payload
        },
        setIsOpenDialogListPucOrdenPagoEdit: (state, action) => {
            state.isOpenDialogListPucOrdenPagoEdit = action.payload
        },
        setIsOpenViewerPdf: (state, action) => {
            state.isOpenViewerPdf = action.payload
        },
        setIsOpenDialogConfirmButtons: (state, action) => {
            state.isOpenDialogConfirmButtons = action.payload
        },
        setIsOpenDialogListRetenciones: (state, action) => {
            state.isOpenDialogListRetenciones = action.payload
        },
        setIsOpenDialogDocumentosEdit: (state, action) => {
            state.isOpenDialogDocumentosEdit = action.payload
        },
        setCompromisoSeleccionadoDetalle: (state, action) => {
            state.compromisoSeleccionadoListaDetalle = action.payload
        },
        setPucSeleccionado: (state, action) => {
            state.pucSeleccionado = action.payload
        },
        setTypeOperation: (state, action) => {
            state.typeOperation = action.payload
        },
        setTypeOperationDocumento: (state, action) => {
            state.typeOperationDocumento = action.payload
        },
        resetCompromisoSeleccionadoDetalle: (state): void => {
            state.compromisoSeleccionadoListaDetalle = {} as Orden
        },
        setIsCollapseRetenciones: (state, action) => {
            state.isCollapseRetenciones = action.payload
        },
        setRetencionOpSeleccionado: (state, action) => {
            state.retencionOpSeleccionado = action.payload
        },
        setRetencionSeleccionado: (state, action) => {
            state.retencionSeleccionado = action.payload
        },
        setBeneficioOpSeleccionado: (state, action) => {
            state.beneficioOpSeleccionado = action.payload
        },
        setDocumentoOpSeleccionado: (state, action) => {
            state.documentoOpSeleccionado = action.payload
        },
        resetDocumentoOpSeleccionado: (state, action): void => {
            state.documentoOpSeleccionado = action.payload
        },
        setCodigoOrdenPago: (state, action) => {
            state.codigoOrdenPago = action.payload
        }
    }
})
export const {
    setIsOpenDialogOrdenPagoDetalle,
    setIsOpenDialogListCompromiso,
    setCompromisoSeleccionadoDetalle,
    setIsOpenDialogListPucOrdenPago,
    setIsOpenDialogListPucOrdenPagoEdit,
    setIsOpenDialogConfirmButtons,
    setIsOpenDialogListRetenciones,
    setIsOpenDialogDocumentosEdit,
    setIsOpenViewerPdf,
    setTypeOperation,
    setTypeOperationDocumento,
    resetCompromisoSeleccionadoDetalle,
    resetDocumentoOpSeleccionado,
    setPucSeleccionado,
    setIsCollapseRetenciones,
    setRetencionSeleccionado,
    setRetencionOpSeleccionado,
    setBeneficioOpSeleccionado,
    setDocumentoOpSeleccionado,
    setCodigoOrdenPago
} = admOrdenPagoSlice.actions
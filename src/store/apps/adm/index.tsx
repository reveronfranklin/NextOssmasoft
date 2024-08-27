import { createSlice } from "@reduxjs/toolkit";
import { CrudOperation } from 'src/adm/solicitudCompromiso/enums/CrudOperations.enum'
import { Estatus } from 'src/adm/solicitudCompromiso/enums/Estatus.enum'
import { ITipoSolicitud } from 'src/adm/solicitudCompromiso/interfaces/tipoSolicitud.interfaces'
import { Product } from 'src/adm/solicitudCompromiso/components/Productos/interfaces/product.interfaces'

export const admSolicitudCompromisoSlice = createSlice({
    name: 'admSolicitudCompromiso',
    initialState: {
        isLoadingTableSolicitudGeneral: false,
        verSolicitudCompromisosActive: false,
        verSolicitudCompromisoDetalleActive: false,
        verSolicitudCompromisoPucActive: false,
        verDialogListProductsInfoActive: false,
        verDialogUpdateProductsInfoActive: false,
        operacionCrudAdmSolCompromiso: CrudOperation.DEFAULT,
        filtroEstatus: Estatus.DEFAULT,
        solicitudCompromisoSeleccionado: {} as any,
        solicitudCompromisoSeleccionadoDetalle: {} as any,
        pucSeleccionado: {} as any,
        listTipoDeSolicitud: {} as ITipoSolicitud[],
        listProveedores: {} as any[],
        listTipoImpuesto: {} as any[],
        listTipoUnidades: {} as any[],
        productSeleccionado: {} as Product[],
        total1ListPuc: 0,
    },
    reducers: {
        setTotalListPuc: (state, action) => {
            state.total1ListPuc = action.payload
        },
        setIsLoadingTableSolicitudGeneral: (state, action) => {
            state.isLoadingTableSolicitudGeneral = action.payload
        },
        setVerSolicitudCompromisosActive: (state, action) => {
            state.verSolicitudCompromisosActive = action.payload
        },
        setVerSolicitudCompromisoDetalleActive: (state, action) => {
            state.verSolicitudCompromisoDetalleActive = action.payload
        },
        setVerSolicitudCompromisoPucActive: (state, action) => {
            state.verSolicitudCompromisoPucActive = action.payload
        },
        setVerDialogListProductsInfoActive: (state, action) => {
            state.verDialogListProductsInfoActive = action.payload
        },
        setVerDialogUpdateProductsInfoActive: (state, action) => {
            state.verDialogUpdateProductsInfoActive = action.payload
        },
        setOperacionCrudAdmSolCompromiso: (state, action) => {
            state.operacionCrudAdmSolCompromiso = action.payload
        },
        setFiltroEstatus: (state, action) => {
            state.filtroEstatus = action.payload
        },
        setSolicitudCompromisoSeleccionado: (state, action) => {
            state.solicitudCompromisoSeleccionado = action.payload
        },
        setSolicitudCompromisoSeleccionadoDetalle: (state, action) => {
            state.solicitudCompromisoSeleccionadoDetalle = action.payload
        },
        setPucSeleccionado: (state, action) => {
            state.pucSeleccionado = action.payload
        },
        setListTipoDeSolicitud: (state, action) => {
            state.listTipoDeSolicitud = action.payload
        },
        setListProveedores: (state, action) => {
            state.listProveedores = action.payload
        },
        setListTipoImpuesto: (state, action) => {
            state.listTipoImpuesto = action.payload
        },
        setListTipoUnidades: (state, action) => {
            state.listTipoUnidades = action.payload
        },
        setProductSeleccionado: (state, action) => {
            state.productSeleccionado = action.payload
        }
    }
})
export const {
        setTotalListPuc,
        setIsLoadingTableSolicitudGeneral,
        setVerSolicitudCompromisosActive,
        setOperacionCrudAdmSolCompromiso,
        setSolicitudCompromisoSeleccionado,
        setListTipoDeSolicitud,
        setSolicitudCompromisoSeleccionadoDetalle,
        setVerSolicitudCompromisoDetalleActive,
        setVerSolicitudCompromisoPucActive,
        setVerDialogListProductsInfoActive,
        setVerDialogUpdateProductsInfoActive,
        setPucSeleccionado,
        setListTipoImpuesto,
        setListTipoUnidades,
        setListProveedores,
        setProductSeleccionado,
        setFiltroEstatus,
    } = admSolicitudCompromisoSlice.actions
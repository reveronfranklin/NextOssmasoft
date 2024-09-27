// import { Grid, Button, Box } from "@mui/material"
// import TabsComponent from '../components/Tabs'
// import FormOrdenPago from '../forms/FormOrdenPago'
// import ListaCompromiso from '../components/ListCompromiso/listaCompromisos'
// import { useDispatch } from "react-redux"
// import { RootState } from "src/store"
// import { useSelector } from "react-redux"
// import { useState } from "react"

// import { setCompromisoSeleccionadoDetalle, setIsOpenDialogListCompromiso } from "src/store/apps/ordenPago"
// import useServices from 'src/adm/ordenesPago/services/useServices'
// import { CreateOrdenPago } from "../interfaces/createOrdenPago.interfaces"

// const OrdenPagoComponent = () => {
//     const [formData, setFormData] = useState({});

//     const dispatch = useDispatch()
//     const { compromisoSeleccionadoListaDetalle } = useSelector((state: RootState) => state.admOrdenPago)
//     const { createOrden, updateOrden } = useServices()

//     const handleListCompromiso = () => {
//         dispatch(setIsOpenDialogListCompromiso(true))
//     }

//     const handleClearCompromiso = () => {
//         dispatch(setCompromisoSeleccionadoDetalle({}))
//     }

//     const handleFormData = (data: any) => {
//         setFormData(data)
//     }

//     const handleUpdateOrden = async () => {
//         try {
//             //const filters: CreateOrdenPago = {}
//             const response = await updateOrden({})
//         } catch (e: any) {
//             console.error(e)
//         }
//     }

    // return (<></>
        // <>
        //     <Grid container spacing={5} paddingTop={1}>
        //         <Grid sm={12} xs={12}>
        //             <Box display="flex" gap={2} ml="1.5rem">
        //                 <Button variant='contained' color='primary' size='small' onClick={handleUpdateOrden}>
        //                     Actualizar
        //                 </Button>
        //                 <Button variant='contained' color='primary' size='small' onClick={handleClearCompromiso}>
        //                     limpiar
        //                 </Button>
        //                 <Button variant='contained' color='success' size='small' onClick={handleListCompromiso}>
        //                     VER COMPROMISOS
        //                 </Button>
        //             </Box>
        //         </Grid>
        //         <Grid sm={6} xs={12} sx={{
        //             overflow: 'auto',
        //             padding: '0 1rem',
        //             borderRight: '1px solid #e0e0e0',
        //         }}>
        //             <FormOrdenPago
        //                 orden={compromisoSeleccionadoListaDetalle}
        //                 onFormData={handleFormData}
        //             />
        //         </Grid>
        //         <Grid sm={6} xs={12}>
        //             <TabsComponent />
        //         </Grid>
        //     </Grid>
        //     <ListaCompromiso />
        // </>
//     )
// }

// export default OrdenPagoComponent
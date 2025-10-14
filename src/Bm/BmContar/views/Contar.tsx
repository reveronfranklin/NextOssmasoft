import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Autocomplete, // Importar Autocomplete
  InputAdornment,
  Grid,
  Divider
} from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle' // Icono para sincronizado
import ErrorIcon from '@mui/icons-material/Error' // Icono para pendiente/error

import { useDispatch } from 'react-redux'
import { setBmConteoSeleccionado, setListBmConteoResponseDto, setListIcpSeleccionado } from 'src/store/apps/bmConteo'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { GridSearchIcon } from '@mui/x-data-grid'
import { ICPGetDto } from 'src/interfaces/Bm/BmConteo/ICPGetDto'
import { setListIcp } from 'src/store/apps/ICP'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

// URL base de la API (simulada)
// En un entorno real, esta sería la URL de tu backend
const LOCAL_STORAGE_KEY: string = 'crudItems'

// Tipos de estado para los elementos
const STATUS_SYNCED = 'synced'
const STATUS_PENDING_ADD = 'pending_add'
const STATUS_PENDING_UPDATE = 'pending_update'
const STATUS_PENDING_DELETE = 'pending_delete'

// Definición de la interfaz para las opciones de ubicación
interface UbicacionOption {
  codigoBmConteo: number
  conteo: number
  titulo: string
  codigoDirBien: number
  codigoIcp: number
  unidadEjecutora: string
  codigoUsuario: number
  codigoPersona: number
  login: string
  cedula: number
  descripcion: string
  keyUbicacionResponsable: string
}
interface UserData {
  id: number
  email: string
  fullName: string
  role: string
  roles: { role: string }[]
  username: string
  tituloMenu: string
}

export type ProductDatabase = {
  id: number
  key: string
  articulo: string
  descripcion: string
  responsable: string
  nroPlaca: string
  codigoDepartamentoResponsable: number
  descripcionDepartamentoResponsable: string
  codigoDirBien: number
  images: string[]
}

export type ConteoCreateDto = {
  articulo: string
  codigoDirBien: number
  id: number
  keyUbicacionResponsable: string
  nroPlaca: string
  unidadEjecutora: string
  ubicacionFisica: number
}

// Definición de la interfaz para un elemento de tu CRUD
interface CrudItem {
  id: string
  codigoBmConteo: number // Este campo ahora viene de la descripción de la UbicacionOption
  numeroDePlaca: string
  status: 'synced' | 'pending_add' | 'pending_update' | 'pending_delete' | null
  ubicacionFisica: number
}

function Contar() {
  const dispatch = useDispatch()

  // Estado para la lista de elementos
  const [items, setItems] = useState<CrudItem[]>([])
  const [ubicacionesOptions, setUbicacionesOptions] = useState<UbicacionOption[]>([])
  const [dataArticulos, setDataArticulos] = useState<ProductDatabase[]>([])

  // Estado para el nuevo elemento a añadir, ahora solo con nombre y numeroDePlaca
  const [newItem, setNewItem] = useState<{ codigoBmConteo: number; numeroDePlaca: string; ubicacionFisica: number }>({
    codigoBmConteo: 0,
    numeroDePlaca: '',
    ubicacionFisica: 0
  })

  // Estado para controlar el diálogo de edición
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false)

  // Estado para el elemento que se está editando
  const [editingItem, setEditingItem] = useState<CrudItem | null>(null)

  // Estado para el Snackbar (notificaciones)
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [snackbarMessage, setSnackbarMessage] = useState<string>('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success')
  const [isPlacaValid, setIsPlacaValid] = useState(false)
  const [validPlaca, setValidPlaca] = useState('')
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

  // Estado para el indicador de carga
  const [loading, setLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [listUnidadTrabajo, setListUnidadTrabajo] = useState<ICPGetDto[]>([])

  const { listIcp, listIcpSeleccionado } = useSelector((state: RootState) => state.bmConteo)

  // Filtrar items basado en `numeroDePlaca`
  const filteredItems = items
    .filter(item => item.numeroDePlaca.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => Number(b.id) - Number(a.id))
  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      const userStorageKey = 'userData'
      const userDataString = localStorage.getItem(userStorageKey)
      if (userDataString) {
        const userData: UserData = JSON.parse(userDataString)
        const responseAllConteo = await ossmmasofApi.post<any>('/BmUbicacionesResponsable/GetByUsuarioResponsable', {
          UsuarioResponsable: userData.username
        })
        const dataConteo = responseAllConteo.data.data
        console.log('ubicaciones', dataConteo)

        if (responseAllConteo.data.isValid && responseAllConteo.data.data != null) {
          console.log('data conteo', dataConteo)
          setUbicacionesOptions(responseAllConteo.data.data)
          dispatch(setListBmConteoResponseDto(dataConteo))

          dispatch(setBmConteoSeleccionado(dataConteo[0]))
        } else {
          dispatch(setListBmConteoResponseDto(dataConteo))
        }
      }

      const { data } = await ossmmasofApi.post<ProductDatabase[]>('/Bm1/GetProductMobil', {
        pageNumber: 1,
        pageSize: 10000,
        codigoDepartamentoResponsable: 0,
        searhText: ''
      })
      setDataArticulos(data)

      const responseIcps = await ossmmasofApi.get<any>('/Bm1/GetListICP')
      dispatch(setListIcp(responseIcps.data.data))
      setListUnidadTrabajo(responseIcps.data.data)
      setLoading(false)
    }

    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cargar datos de localStorage al iniciar la aplicación
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (storedItems) {
        setItems(JSON.parse(storedItems) as CrudItem[])
      }
    } catch (error) {
      console.error('Error al cargar datos de localStorage:', error)
      showSnackbar('Error al cargar datos locales.', 'error')
    }
  }, [])

  // Guardar datos en localStorage cada vez que 'items' cambie
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Error al guardar datos en localStorage:', error)
      showSnackbar('Error al guardar datos locales.', 'error')
    }
  }, [items])

  // Función para mostrar el Snackbar
  const showSnackbar = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  // Manejar el cambio en los campos del nuevo elemento
  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewItem({ ...newItem, [name]: value })
    const isValid = /^\d-\d{2}-\d{2}-\d{5}$/.test(value)
    setIsPlacaValid(isValid) // Guarda  si la placa es valida
    if (name === 'numeroDePlaca' && isValid) {
      setValidPlaca(value) // Guarda la placa válida
      setOpenConfirmDialog(true) // Abre el diálogo de confirmación
    }

    //setNewItem({ ...newItem, [e.target.name]: e.target.value })
    console.log(newItem)
  }
  const handleIcp = (e: any, value: any) => {
    console.log('handler Icp>>>>', value)
    if (value != null) {
      dispatch(setListIcpSeleccionado(value))
      setNewItem({ ...newItem, ubicacionFisica: value.codigoIcp ? value.codigoIcp : 0 })
      console.log('newItem en handleIcp', newItem)
    } else {
      const icp: ICPGetDto[] = [
        {
          codigoIcp: 0,
          unidadTrabajo: ''
        }
      ]
      dispatch(setListIcpSeleccionado(icp))
    }
  }

  const validatePlaca = (nroPlaca: string) => {
    const producto = dataArticulos.filter(x => x.nroPlaca == nroPlaca)

    if (!producto || producto.length === 0) {
      showSnackbar(`La placa ${nroPlaca} no se encuentra registrada`, 'warning')

      return `La placa ${nroPlaca} no se encuentra registrada`
    }

    console.log('items en validate', items)
    const placa = items.filter(x => x.numeroDePlaca == nroPlaca)

    console.log('placa en validate', placa)
    if (placa && placa.length > 0) {
      return `Placa ${nroPlaca} ya esta registrada`
    }

    return ''
  }

  /*const markItemsAsSynced = () => {
    setItems(prevItems =>
      prevItems.map(item => ({
        ...item,
        status: STATUS_SYNCED // Usamos 'as const' para asegurar el tipo literal
      }))
    )
  }*/

  // Añadir un nuevo elemento
  const handleAddItem = () => {
    if (!newItem.codigoBmConteo || !newItem.numeroDePlaca || !newItem.ubicacionFisica) {
      showSnackbar('Conteo,Ubicacion y número de placa son requeridos.', 'warning')

      return
    }

    const matchingUbicacion = listUnidadTrabajo.find(ubi => ubi.codigoIcp === newItem.ubicacionFisica)
    if (!matchingUbicacion) {
      showSnackbar(
        `Advertencia: No se encontró Ubicacion en la base de datos para el número de placa: '${newItem.numeroDePlaca}'. Este CrudItem será omitido.`,
        'warning'
      )

      return // Saltar este CrudItem si no hay un producto que coincida
    }
    const placaValida = validatePlaca(newItem?.numeroDePlaca)
    if (placaValida.length > 0) {
      showSnackbar(placaValida, 'warning')

      return
    }
    const id = Date.now().toString() // Generar un ID único
    const itemToAdd: CrudItem = { ...newItem, id, status: STATUS_PENDING_ADD }
    setItems(prevItems => [...prevItems, itemToAdd])

    setNewItem({ codigoBmConteo: newItem.codigoBmConteo, numeroDePlaca: '', ubicacionFisica: newItem.ubicacionFisica }) // Limpiar el formulario
    showSnackbar('Elemento añadido (pendiente de sincronizar).', 'info')
  }

  /*   // Abrir el diálogo de edición
  const handleOpenEditDialog = (item: CrudItem) => {
    setEditingItem({ ...item }) // Copiar el elemento para no modificar el original directamente
    setOpenEditDialog(true)
  }
 */

  // Cerrar el diálogo de edición
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
    setEditingItem(null)
  }

  // Manejar el cambio en los campos del elemento en edición
  const handleEditingItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditingItem(prevEditingItem =>
      prevEditingItem ? { ...prevEditingItem, [e.target.name]: e.target.value } : null
    )
  }

  // Guardar los cambios de un elemento editado
  const handleSaveEdit = () => {
    if (!editingItem?.codigoBmConteo || !editingItem?.numeroDePlaca) {
      showSnackbar('Conteo y número de placa son requeridos.', 'warning')

      return
    }
    const placaValida = validatePlaca(editingItem?.numeroDePlaca)
    if (placaValida.length > 0) {
      showSnackbar(placaValida, 'warning')

      return
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === editingItem.id
          ? {
              ...editingItem,

              // Si ya está pendiente de añadir, sigue siendo "pending_add"
              // Si no, y ha sido modificado, pasa a "pending_update"
              status: item.status === STATUS_PENDING_ADD ? STATUS_PENDING_ADD : STATUS_PENDING_UPDATE
            }
          : item
      )
    )
    handleCloseEditDialog()
    showSnackbar('Elemento actualizado (pendiente de sincronizar).', 'info')
  }

  // Marcar un elemento para eliminación
  const handleDeleteItem = (id: string) => {
    const updatedItems: CrudItem[] = items.filter(item => item.id !== id)

    setItems(updatedItems)
    showSnackbar('Elemento eliminado.', 'info')
  }

  function mapToConteoCreateDto(crudItems: CrudItem[], productDatabase: ProductDatabase[]): ConteoCreateDto[] {
    const conteoDtos: ConteoCreateDto[] = []

    for (const crudItem of crudItems) {
      const matchingProduct = productDatabase.find(product => product.nroPlaca === crudItem.numeroDePlaca)

      if (!matchingProduct) {
        console.warn(
          `Advertencia: No se encontró un producto en la base de datos para el número de placa: '${crudItem.numeroDePlaca}'. Este CrudItem será omitido.`
        )
        continue // Saltar este CrudItem si no hay un producto que coincida
      }
      const matchingConteo = ubicacionesOptions.find(ubi => ubi.codigoBmConteo === crudItem.codigoBmConteo)
      if (!matchingConteo) {
        console.warn(
          `Advertencia: No se encontró conteo en la base de datos para el número de placa: '${crudItem.numeroDePlaca}'. Este CrudItem será omitido.`
        )
        continue // Saltar este CrudItem si no hay un producto que coincida
      }
      console.log('listUnidadTrabajo', listUnidadTrabajo)
      const matchingUbicacion = listUnidadTrabajo.find(ubi => ubi.codigoIcp === crudItem.ubicacionFisica)
      if (!matchingUbicacion) {
        console.warn(
          `Advertencia: No se encontró Ubicacion en la base de datos para el número de placa: '${crudItem.numeroDePlaca}'. Este CrudItem será omitido.`
        )
        continue // Saltar este CrudItem si no hay un producto que coincida
      }

      // Construir el objeto ConteoCreateDto
      conteoDtos.push({
        articulo: matchingProduct.articulo,
        codigoDirBien: matchingProduct.codigoDirBien,
        id: matchingProduct.id,
        keyUbicacionResponsable:
          crudItem.codigoBmConteo +
          '-' +
          matchingConteo.conteo +
          '-' +
          matchingProduct.descripcionDepartamentoResponsable,
        nroPlaca: matchingProduct.nroPlaca, // nroPlaca del producto
        unidadEjecutora: matchingProduct.descripcionDepartamentoResponsable,
        ubicacionFisica: crudItem.ubicacionFisica
      })
    }

    return conteoDtos
  }

  async function uploadProducts() {
    try {
      const changesToSync = items.filter(item => item.status === STATUS_PENDING_ADD)
      console.log(changesToSync)
      const payload = mapToConteoCreateDto(changesToSync, dataArticulos)
      console.log('payload a sincronizar>>>>>>', payload)

      const { data } = await ossmmasofApi.post<any>('/BmConteoDetalle/RecibeConteo', payload)

      if (data.isValid === true) {
        if (localStorage.getItem('crudItems') !== null) {
          localStorage.removeItem('crudItems')
          setItems([])
          console.log('El ítem crudItems ha sido eliminado del localStorage')
        }

        //markItemsAsSynced()

        return ''
      } else {
        return data.Message
      }
    } catch (error) {
      return error
    }
  }

  // Sincronizar cambios por lotes con la API
  const handleSyncChanges = async () => {
    setLoading(true)
    const changesToSync = items.filter(
      item =>
        item.status === STATUS_PENDING_ADD ||
        item.status === STATUS_PENDING_UPDATE ||
        item.status === STATUS_PENDING_DELETE
    )

    if (changesToSync.length === 0) {
      showSnackbar('No hay cambios pendientes para sincronizar.', 'info')
      setLoading(false)

      return
    }

    try {
      console.log('objeto a enviar: ', items)
      await uploadProducts()

      // Procesar la respuesta (simulada)
      // En un entorno real, la API respondería con los estados actualizados
      // o con errores para operaciones específicas.

      showSnackbar('Cambios sincronizados exitosamente.', 'success')
    } catch (error) {
      console.error('Error al sincronizar cambios:', error)
      showSnackbar('Error al sincronizar cambios. Por favor, reintenta.', 'error')

      // Opcional: Podrías marcar los elementos que fallaron con un nuevo estado 'sync_failed'
      // para reintentos específicos o para mostrar un error visual al usuario.
    } finally {
      setLoading(false)
    }
  }

  const handleConteo = (e: any, value: any) => {
    console.log('handler tipo nomina', value)
    if (value != null) {
      setNewItem({ ...newItem, codigoBmConteo: value ? value.codigoBmConteo : '' })
      dispatch(setBmConteoSeleccionado(value))
    } else {
      dispatch(setBmConteoSeleccionado({}))
    }
  }

  return (
    <Container maxWidth='md' sx={{ mt: 4 }}>
      <Typography variant='h4' component='h1' gutterBottom align='center'>
        Gestión de Conteo
      </Typography>

      {/* Sección de Añadir Elemento */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant='h6' gutterBottom>
          Añadir Nuevo Articulo
        </Typography>

        <Grid item sm={12} xs={12}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {listUnidadTrabajo && listUnidadTrabajo.length > 0 ? (
              <Autocomplete
                multiple={false}
                options={listUnidadTrabajo}
                id='autocomplete-list-icp'
                isOptionEqualToValue={(option, value) => option.codigoIcp === value.codigoIcp}
                getOptionLabel={option => option.codigoIcp + '-' + option.unidadTrabajo}
                onChange={handleIcp}
                renderInput={params => <TextField {...params} label='ICP' />}
              />
            ) : (
              <div></div>
            )}
          </Box>
        </Grid>

        <Divider variant='middle' sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Autocomplete
            options={ubicacionesOptions}
            getOptionLabel={(option: UbicacionOption) =>
              option.codigoBmConteo + '-' + option.titulo + '-' + option.unidadEjecutora || ''
            } // Mostrar 'descripcion'
            isOptionEqualToValue={(option: UbicacionOption, value: UbicacionOption) =>
              option.codigoBmConteo === value.codigoBmConteo
            } // Comparar por un identificador único
            value={ubicacionesOptions.find(option => option.codigoBmConteo === newItem.codigoBmConteo) || null} // Enlazar al valor actual de newItem.nombre
            onChange={handleConteo}
            renderInput={params => (
              <TextField
                {...params}
                label='Nombre (Conteo)' // Etiqueta para el Autocomplete
                name='nombre'
                fullWidth
                error={!newItem.codigoBmConteo && snackbarOpen && snackbarSeverity === 'warning'} // Muestra error si está vacío y hay warning
                helperText={
                  !newItem.codigoBmConteo && snackbarOpen && snackbarSeverity === 'warning'
                    ? 'Este campo es requerido.'
                    : ''
                }
              />
            )}
            renderOption={(props, option: UbicacionOption) => (
              <li {...props} key={option.codigoBmConteo}>
                {option.codigoBmConteo + '-' + option.titulo + '-' + option.unidadEjecutora}
              </li>
            )}
            noOptionsText='No hay opciones disponibles'
          />
          <TextField
            label='Número de Placa'
            name='numeroDePlaca'
            value={newItem.numeroDePlaca}
            onChange={handleNewItemChange}
            fullWidth
            error={!newItem.numeroDePlaca && snackbarOpen && snackbarSeverity === 'warning'}
            helperText={
              !newItem.numeroDePlaca && snackbarOpen && snackbarSeverity === 'warning' ? 'Este campo es requerido.' : ''
            }
            InputProps={{
              endAdornment: isPlacaValid && (
                <InputAdornment position='end'>
                  <CheckCircleIcon color='success' />
                </InputAdornment>
              )
            }}
          />
          <Button variant='contained' onClick={handleAddItem} disabled={loading}>
            Añadir Elemento
          </Button>
        </Box>
      </Paper>

      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirmar número de placa</DialogTitle>
        <DialogContent>
          ¿El número de placa <strong>{validPlaca}</strong> es correcto? ¿Deseas agregarlo?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancelar</Button>
          <Button
            onClick={() => {
              handleAddItem() // Ejecuta la acción
              setOpenConfirmDialog(false) // Cierra el diálogo
            }}
            color='primary'
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sección de Lista de Elementos */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant='h6' gutterBottom>
          Lista de Bienes
        </Typography>
        {/* Campo de búsqueda */}
        <TextField
          label='Buscar por número de placa'
          variant='outlined'
          fullWidth
          sx={{ mb: 3 }}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <GridSearchIcon />
              </InputAdornment>
            )
          }}
        />
        {filteredItems.length === 0 ? (
          <Typography variant='body1' color='text.secondary'>
            No hay elementos. Añade uno para empezar.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Número de Placa</TableCell>
                  <TableCell align='center'>Estado</TableCell>
                  <TableCell align='center'>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item: CrudItem) => (
                  <TableRow key={item.id}>
                    {/*  <TableCell>{item.codigoBmConteo}</TableCell> */}
                    <TableCell>{item.numeroDePlaca}</TableCell>
                    <TableCell align='center'>
                      {item.status === STATUS_SYNCED ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <CheckCircleIcon color='success' fontSize='small' />
                          <Typography variant='body2'>Sincronizado</Typography>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                          <ErrorIcon color='warning' fontSize='small' />
                          <Typography variant='body2'>Pendiente</Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align='center'>
                      {/*  <IconButton onClick={() => handleOpenEditDialog(item)} disabled={loading}>
                        <EditIcon />
                      </IconButton> */}
                      <IconButton onClick={() => handleDeleteItem(item.id)} disabled={loading}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Botón de Sincronizar Cambios */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSyncChanges}
          disabled={loading || items.filter(i => i.status !== STATUS_SYNCED).length === 0}
          startIcon={loading ? <CircularProgress size={20} color='inherit' /> : null}
        >
          {loading ? 'Sincronizando...' : 'Sincronizar Cambios'}
        </Button>
      </Box>

      {/* Diálogo de Edición */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Editar Elemento</DialogTitle>
        <DialogContent>
          {editingItem && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Autocomplete
                options={ubicacionesOptions}
                getOptionLabel={(option: UbicacionOption) => option.descripcion || ''}
                isOptionEqualToValue={(option: UbicacionOption, value: UbicacionOption) =>
                  option.keyUbicacionResponsable === value.keyUbicacionResponsable
                }
                value={ubicacionesOptions.find(option => option.descripcion === editingItem.nombre) || null}
                onChange={(event: React.SyntheticEvent, newValue: UbicacionOption | null) => {
                  setEditingItem(prevEditingItem =>
                    prevEditingItem ? { ...prevEditingItem, nombre: newValue ? newValue.descripcion : '' } : null
                  )
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Nombre (Ubicación)'
                    name='nombre'
                    fullWidth
                    error={!editingItem?.codigoBmConteo && openEditDialog} // Muestra error solo si el diálogo está abierto
                    helperText={!editingItem?.codigoBmConteo && openEditDialog ? 'Este campo es requerido.' : ''}
                  />
                )}
                renderOption={(props, option: UbicacionOption) => (
                  <li {...props} key={option.keyUbicacionResponsable}>
                    {option.descripcion}
                  </li>
                )}
                noOptionsText='No hay opciones disponibles'
              />
              <TextField
                label='Número de Placa'
                name='numeroDePlaca'
                value={editingItem.numeroDePlaca}
                onChange={handleEditingItemChange}
                fullWidth
                error={!editingItem.numeroDePlaca && openEditDialog}
                helperText={!editingItem.numeroDePlaca && openEditDialog ? 'Este campo es requerido.' : ''}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSaveEdit} variant='contained' disabled={loading}>
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para Notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Contar

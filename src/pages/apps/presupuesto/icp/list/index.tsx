import { Box, Card, CardActions, CardHeader, Grid, IconButton, Tooltip } from '@mui/material'
import React, { useEffect, useState } from 'react'

//import { ReactDatePickerProps } from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { DataGrid } from '@mui/x-data-grid'

//import { useTheme } from '@mui/material/styles'

//import { usePresupuesto } from 'src/hooks/usePresupuesto';

import { useDispatch } from 'react-redux'

import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Spinner from 'src/@core/components/spinner'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

import { FilterByPresupuestoDto } from 'src/interfaces/Presupuesto/i-filter-by-presupuesto-dto'
import { IPreIndiceCategoriaProgramaticaGetDto } from '../../../../../interfaces/Presupuesto/i-pre-indice-categoria-programatica-get-dto'

import {
  setIcpSeleccionado,
  setListActividades,
  setListCodigosIcpHistorico,
  setListIcp,
  setListOficinas,
  setListProgramas,
  setListProyectos,
  setListSectores,
  setListSubProgramas,
  setOperacionCrudIcp,
  setVerIcpActive
} from 'src/store/apps/ICP'
import FilterOnlyPresupuesto from 'src/views/forms/form-elements/presupuesto/FilterOnlyPresupuesto'

import { IFilterClave } from 'src/interfaces/SIS/i-filter-clave'
import { fetchDataPersonas } from 'src/store/apps/rh/thunks'
import TreeViewIcp from 'src/presupuesto/Icp/components/TreViewIcp'
import DialogPreIcpInfo from 'src/presupuesto/Icp/views/DialogPreIcpInfo'


interface CellType {
  row: IPreIndiceCategoriaProgramaticaGetDto
}

const PresupuestoList = () => {
  //const theme = useTheme()
  //const { direction } = theme
  //const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const columns = [
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Add hijo'>
            <IconButton size='small' onClick={() => handleAddChild(row)}>
              <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
    {
      field: 'ano',
      headerName: 'Año',
      width: 80
    },

    {
      field: 'codigoIcpConcat',
      headerName: 'icp',
      width: 300
    },

    {
      field: 'denominacion',
      headerName: 'Denominacion',
      width: 400
    },

    {
      field: 'unidadEjecutora',
      headerName: 'Unidad Ejecutora',
      width: 400
    },
    {
      field: 'descripcion',
      headerName: 'Descripcion',
      width: 400
    }
  ]

  //IPreIndiceCategoriaProgramaticaGetDto
  const handleView = (row: IPreIndiceCategoriaProgramaticaGetDto) => {
    dispatch(setIcpSeleccionado(row))

    // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudIcp(2))
    dispatch(setVerIcpActive(true))
  }

  const handleAddChild = (row: IPreIndiceCategoriaProgramaticaGetDto) => {
    const newRow = { ...row }
    newRow.codigoIcp = 0
    dispatch(setIcpSeleccionado(newRow))

    // Operacion Crud 1 = Crear presupuesto
    dispatch(setOperacionCrudIcp(1))
    dispatch(setVerIcpActive(true))
  }

  const handleDoubleClick = (row: any) => {
    handleView(row.row)
  }
  const handleAdd = () => {
    //dispatch(setPresupuesto(row))
    // Operacion Crud 1 = Crear presupuesto

    const defaultValues: IPreIndiceCategoriaProgramaticaGetDto = {
      codigoIcp: 0,
      ano: listpresupuestoDtoSeleccionado.ano,
      codigoSector: '00',
      codigoPrograma: '00',
      codigoSubPrograma: '00',
      codigoProyecto: '00',
      codigoActividad: '00',
      codigoOficina: '00',
      unidadEjecutora: '',
      denominacion: '',
      descripcion: '',
      codigoFuncionario: 0,
      codigoIcpPadre: 0,
      codigoIcpConcat: '',
      searchText: '',
      codigoPresupuesto: listpresupuestoDtoSeleccionado.codigoPresupuesto
    }

    dispatch(setIcpSeleccionado(defaultValues))

    dispatch(setOperacionCrudIcp(1))
    dispatch(setVerIcpActive(true))
  }

  const dispatch = useDispatch()

  const { verIcpActive = false } = useSelector((state: RootState) => state.icp)
  const { listpresupuestoDtoSeleccionado } = useSelector((state: RootState) => state.presupuesto)

  const [loading, setLoading] = useState(false)
  const [viewTable, setViewTable] = useState(false)

  const [icp, setIcp] = useState([])
  const handleViewTree = () => {
    setViewTable(false)
  }
  const handleViewTable = () => {
    setViewTable(true)
  }
  useEffect(() => {
    const getIcp = async (filter: FilterByPresupuestoDto) => {
      setLoading(true)

      //await fetchData(dispatch)
      //console.log(listpresupuestoDtoSeleccionado)

      const responseAll = await ossmmasofApi.post<any>('/PreIndiceCategoriaProgramatica/GetAllFilter', filter)
      const data = responseAll.data.data
      if (responseAll.data.data == null) {
        setIcp([])
        setLoading(false)

        return
      }
      await dispatch(setListIcp(data))

      setIcp(data)
      console.log('Lista de Icp', icp)
      const filterSectores: IFilterClave = {
        clave: 'CODIGO_SECTOR'
      }
      const responseSectores = await ossmmasofApi.post<any>('/OssConfig/GetListByClave', filterSectores)
      dispatch(setListSectores(responseSectores.data.data))

      const filterProgramas: IFilterClave = {
        clave: 'CODIGO_PROGRAMA'
      }
      const responseProgramas = await ossmmasofApi.post<any>('/OssConfig/GetListByClave', filterProgramas)
      dispatch(setListProgramas(responseProgramas.data.data))

      const filterSubProgramas: IFilterClave = {
        clave: 'CODIGO_SUBPROGRAMA'
      }
      const responseSubProgramas = await ossmmasofApi.post<any>('/OssConfig/GetListByClave', filterSubProgramas)
      dispatch(setListSubProgramas(responseSubProgramas.data.data))

      const filterProyectos: IFilterClave = {
        clave: 'CODIGO_PROYECTO'
      }
      const responseProyectos = await ossmmasofApi.post<any>('/OssConfig/GetListByClave', filterProyectos)
      dispatch(setListProyectos(responseProyectos.data.data))

      const filterActividades: IFilterClave = {
        clave: 'CODIGO_ACTIVIDAD'
      }
      const responseActividades = await ossmmasofApi.post<any>('/OssConfig/GetListByClave', filterActividades)
      dispatch(setListActividades(responseActividades.data.data))

      const filterOfcinas: IFilterClave = {
        clave: 'CODIGO_OFICINA'
      }
      const responseOficinas = await ossmmasofApi.post<any>('/OssConfig/GetListByClave', filterOfcinas)
      dispatch(setListOficinas(responseOficinas.data.data))

      const responseCodigosIcpHistorico = await ossmmasofApi.get<any>(
        '/PreIndiceCategoriaProgramatica/ListCodigosHistoricoIcp'
      )

      dispatch(setListCodigosIcpHistorico(responseCodigosIcpHistorico.data.data))

      await fetchDataPersonas(dispatch)
      setLoading(false)
    }

    const filter: FilterByPresupuestoDto = {
      codigoPresupuesto: 0
    }
    if (listpresupuestoDtoSeleccionado && listpresupuestoDtoSeleccionado.codigoPresupuesto != null) {
      filter.codigoPresupuesto = listpresupuestoDtoSeleccionado.codigoPresupuesto
    }
    if (filter.codigoPresupuesto == 0) {
      return
    }
    getIcp(filter)
  }, [verIcpActive, listpresupuestoDtoSeleccionado])

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader title='Maestro de Indice Categoria Programatica' />
        <FilterOnlyPresupuesto />
        <CardActions>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Agregar'>
              <IconButton color='primary' size='small' onClick={() => handleAdd()}>
                <Icon icon='ci:add-row' fontSize={20} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Arbol'>
              <IconButton size='small' color='primary' onClick={() => handleViewTable()}>
                <Icon icon='grommet-icons:tree' fontSize={20} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Tabla'>
              <IconButton size='small' color='primary' onClick={() => handleViewTree()}>
                <Icon icon='fluent:table-24-regular' fontSize={20} />
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>

        {/*  {
                loading
                ?   <Spinner sx={{ height: '100%' }} />
                :
                <Box sx={{ height: 500 }}>
                  <DataGrid

                  getRowId={(row) => row.codigoIcp}
                  columns={columns}
                  rows={icp} />


                </Box>
 s

              } */}
        {viewTable ? (
          <TreeViewIcp></TreeViewIcp>
        ) : loading ? (
          <Spinner sx={{ height: '100%' }} />
        ) : (
          <Box sx={{ height: 500 }}>
            <DataGrid
              getRowId={row => row.codigoIcp}
              columns={columns}
              rows={icp}
              onRowDoubleClick={row => handleDoubleClick(row)}
            />
          </Box>
        )}
      </Card>

      <DatePickerWrapper>
        <DialogPreIcpInfo />
      </DatePickerWrapper>
    </Grid>
  )
}

export default PresupuestoList

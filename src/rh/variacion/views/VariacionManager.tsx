import { Box, Card, CardActions, Grid, Avatar, Typography } from '@mui/material'
import React, { useEffect, useState, ChangeEvent, useRef } from 'react'
import { DataGrid  } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import Spinner from 'src/@core/components/spinner';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import DialogRhVariacionInfo from './DialogRhVariacionInfo';
import { ResponseRhMovNominaCommand } from '../interfaces';
import { setOperacionCrudRhPersonaMovCtr, setRhPersonaMovCtrSeleccionado, setIsExpandedAccordion, setListRhPersonaMovCtr } from 'src/store/apps/rh-persona-mov-ctrl';
import { setListRhTipoNomina } from 'src/store/apps/rh-tipoNomina';
import { setConceptos, setFrecuencias } from 'src/store/apps/rh';
import useColumnsDataGrid from '../components/headers/ColumnsDataGrid';
import validateAmount from 'src/utilities/validateAmount';
import FormatNumber from 'src/utilities/format-numbers';
import ServerSideToolbarWithAddButton from 'src/views/table/data-grid/ServerSideToolbarWithAddButton';

import MoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface TotalesState {
  montoTotal: string | number;
  asignacionesTotales: string | number;
  deduccionesTotales: string | number;
}

const VariacionList = () => {
  const dispatch            = useDispatch();
  const columnsDataGrid     = useColumnsDataGrid()
  const debounceTimeoutRef  = useRef<any>(null)

  const handleView = (row : ResponseRhMovNominaCommand) => {
   if (personaSeleccionado && personaSeleccionado.codigoPersona > 0) {
      dispatch(setIsExpandedAccordion(true))
      dispatch(setRhPersonaMovCtrSeleccionado(row))
      dispatch(setOperacionCrudRhPersonaMovCtr(2));
   }
  }

  const handleDoubleClick = (row: any) => {
    handleView(row.row)
  }

  const handleAdd = () => {
    if (personaSeleccionado && personaSeleccionado.codigoPersona <= 0) {

      return;
    }

    dispatch(setIsExpandedAccordion(true))
    dispatch(setOperacionCrudRhPersonaMovCtr(1));
  }

  const { verRhPersonaMovCtrActive = false } = useSelector((state: RootState) => state.rhPersonaMovCtrl)

  const [loading, setLoading]           = useState(false);
  const [data, setData]                 = useState<ResponseRhMovNominaCommand[]>([])
  const [filteredData, setFilteredData] = useState<ResponseRhMovNominaCommand[]>([])
  const [buffer, setBuffer]             = useState<string>('')
  const [searchText, setSearchText]     = useState<string>('')

  const { personaSeleccionado, tipoNominaSeleccionado } = useSelector((state: RootState) => state.nomina)

  const [totales, setTotales] = useState<TotalesState>({
    montoTotal: 0,
    asignacionesTotales: 0,
    deduccionesTotales: 0
  })

  const getTotal = (total1: any, total2: any, total3: any) => {
    const montoTotal          = validateAmount(parseFloat(total1))
    const asignacionesTotales = validateAmount(parseFloat(total2))
    const deduccionesTotales  = validateAmount(parseFloat(total3))

    return {
      montoTotal: FormatNumber(montoTotal) ?? 0,
      asignacionesTotales: FormatNumber(asignacionesTotales) ?? 0,
      deduccionesTotales: FormatNumber(deduccionesTotales) ?? 0
    }
  }

  const formatBs = (value: any) => {
    if (!value) return "0,00 Bs."

    const n = typeof value === 'string'
      ? parseFloat(value.replace(',', '.'))
      : value

    if (isNaN(n)) return "0,00 Bs."

    return new Intl.NumberFormat('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(n) + " Bs."
  }

  const getConceptos = async () => {
    const responseAllConceptos = await ossmmasofApi.get<any>('/RhConceptos/GetAll')
    const { data } = responseAllConceptos

    return data
  }

  const getFrecuencias = async () => {
    const responseAllFrecuencias = await ossmmasofApi.post<any>('/RhDescriptivas/GetByTitulo', { tituloId: 49})
    const { data } = responseAllFrecuencias

    return data
  }

  const getTipoNomina = async () => {
    const responseAllTipoNomina = await ossmmasofApi.get<any>('/RhTipoNomina/GetAll')
    const { data } = responseAllTipoNomina

    return data
  }

  useEffect(() => {
    const getData = async () => {

      console.log('tipoNominaSeleccionado vacio', tipoNominaSeleccionado)

      setLoading(true)

      if (personaSeleccionado.codigoPersona > 0) {
        const filter = {
          CodigoTipoNomina: tipoNominaSeleccionado.codigoTipoNomina ?? 12,
          CodigoPersona: personaSeleccionado.codigoPersona,
          CodigoUsuario: 530,
          CodigoEmpresa: 13,
          PageSize: 1000,
          PageNumber: 1,
          SearchText: searchText
        }

        const responseAll   = await ossmmasofApiVertical.post<any>('/RhCalculoNomina/CalculoPorPersona', filter)
        const responseData  = responseAll.data
        setData(responseData.data)
        dispatch(setListRhPersonaMovCtr(responseData.data))

        const totales = getTotal(responseData.total1, responseData.total2, responseData.total3)
        setTotales(totales)

        const frecuenciasList = await getFrecuencias()

        if (frecuenciasList) {
          dispatch(setFrecuencias(frecuenciasList))
        }

        const conceptosList = await getConceptos()

        if (conceptosList) {
          dispatch(setConceptos(conceptosList))
        }

        const tipoNominaList = await getTipoNomina()

        if (tipoNominaList) {
          dispatch(setListRhTipoNomina(tipoNominaList))
        }
      }

      setLoading(false);
    }

    getData();
  }, [verRhPersonaMovCtrActive, personaSeleccionado])

  const debouncedSearch = (value: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setSearchText(value)
    }, 1500)
  }

  const handleSearch = (value: string) => {
    setBuffer(value);

    if (value === '') {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current)
      setSearchText('')

      return
    }

    debouncedSearch(value)
  }

  useEffect(() => {
    const searchLower = searchText.toLowerCase()

    if (searchLower === '') {
      setFilteredData(data)
    } else {
      const filterResults = data.filter(item =>
        item.searchText?.toLowerCase().includes(searchLower)
      )
      setFilteredData(filterResults)
    }
  }, [searchText, data])

  return (
    <Grid item xs={12}>
      <Card sx={{ my: 2 }}>
        <DialogRhVariacionInfo />
      </Card>
      <Card>
        <CardActions>
          <Grid container spacing={3} justifyContent="space-around" sx={{ py: 2 }}>
            {[
              {
                label: 'Monto Total',
                value: formatBs(totales.montoTotal),
                icon:
                  <MoneyIcon
                    sx={{
                      fontSize: 20,
                      stroke: "currentColor",
                      strokeWidth: 1,
                      filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.2))"
                    }}
                  />,
                color: 'primary.main'
              },
              {
                label: 'Asignaciones',
                value: formatBs(totales.asignacionesTotales),
                icon:
                  <TrendingUpIcon
                    sx={{
                      fontSize: 20,
                      stroke: "currentColor",
                      strokeWidth: 1,
                      filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.2))"
                    }}
                  />,
                color: 'success.main'
              },
              {
                label: 'Deducciones',
                value: formatBs(totales.deduccionesTotales),
                icon:
                  <TrendingDownIcon
                    sx={{
                      fontSize: 20,
                      stroke: "currentColor",
                      strokeWidth: 1,
                      filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.2))"
                    }}
                  />,
                color: 'error.main'
              },
            ].map((item, index) => (
              <Grid item key={index} sx={{ textAlign: 'center' }}>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  display="block"
                  sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}
                >
                  {item.label}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5 }}>
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: item.color,
                      mr: 1,
                      boxShadow: 1
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Typography
                    variant="subtitle1"
                    color="textPrimary"
                    sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardActions>

        { loading
          ?
            <Spinner sx={{ height: '100%' }} />
          :
            <Box sx={{ height: 500 }}>
              <DataGrid
                getRowId={(row) => row.codigoMovNomina }
                columns={columnsDataGrid}
                rows={filteredData || []}
                onRowDoubleClick={(row) => handleDoubleClick(row)}
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
                    onAdd: handleAdd,
                    sx: {
                      marginTop: 6,
                      marginRight: 0,
                      marginBottom: 8,
                      marginLeft: 4
                    }
                  }
                }}
              />
            </Box>
        }

      </Card>
    </Grid>
  )
}

export default VariacionList

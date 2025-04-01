
import { useEffect, useState } from "react";
import { Box, Skeleton } from "@mui/material";
import { Autocomplete, TextField } from "@mui/material"
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import useServices from '../../services/useServices'

interface ITipoOrden {
  id: number
  descripcion: string,
  value: number
}

const TipoOrden = (props: any) => {
  const { fetchDescriptivaById } = useServices()
  const qc: QueryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['TipoOrden'],
    queryFn: () => fetchDescriptivaById({ tituloId: 14 }),
    retry: 3,
    staleTime: 5000 * 60 * 60,
  }, qc)

  const ListTipoOrden: ITipoOrden[] = query.data?.data ?? [];
  const [selectedValue, setSelectedValue] = useState<ITipoOrden | null>(null)

  useEffect(() => {
    if (props.id === 0) {
      setSelectedValue(null)

      return
    }

    const value = ListTipoOrden.filter((item: { id: number }) => item?.id == props?.id)[0]

    if (value) {
      handleChange(null, value)
    }

  }, [props.id, ListTipoOrden])

  const handleChange = (e: any, newValue: any) => {
    if (newValue) {
      props.onSelectionChange(newValue)
      setSelectedValue(newValue)
    } else {
      props.onSelectionChange({
        id: 0,
        value: 0
      })
      setSelectedValue(null)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      {
        query.isLoading ? (
          <Skeleton
            width="100%"
            height={30}
            style={{
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 0,
            }}
          />
        ) : (
          <Autocomplete
            ref={props.autocompleteRef}
            options={ListTipoOrden}
            value={selectedValue}
            id='autocomplete-TipoOrden'
            getOptionLabel={(option) => option.id + '-' + option.descripcion}
            onChange={handleChange}
            renderInput={(params) => (
              <TextField {...params} label="Tipo Orden" sx={{ width: '100%' }} />
            )}
          />
        )
      }
    </Box>
  )
}

export default TipoOrden
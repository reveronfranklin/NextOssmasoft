import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import { Autocomplete, TextField } from "@mui/material"
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import useServices from '../../../services/useServices'

interface ITipoOperacion {
  id: number
  descripcion: string,
  value: number
}

const TipoOperacion = (props: any) => {
  const { fetchDescriptivaById } = useServices()
  const qc: QueryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['TipoOperacion'],
    queryFn: () => fetchDescriptivaById({ tituloId: 31 }),
    retry: 3,
    staleTime: 5000 * 60 * 60,
  }, qc)

  const TipoOperacion: ITipoOperacion[] = query.data?.data ?? [];
  const [selectedValue, setSelectedValue] = useState<ITipoOperacion | null>(null)

  useEffect(() => {
    if (props.id === 0) {
      setSelectedValue(null)

      return
    }

    const value = TipoOperacion.filter((item: { id: number }) => item?.id == props?.id)[0]

    if (value) {
      handleChange(null, value)
    }

  }, [props.id, TipoOperacion])

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
    <>
      {
        query.isLoading ? (
          <Skeleton
            width={300}
            height={70}
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
            options={TipoOperacion}
            value={selectedValue}
            id='autocomplete-TipoOperacion'
            getOptionLabel={(option) => option.id + '-' + option.descripcion}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} label="TipoOperacion" />}
          />
        )
      }
    </>
  )
}

export default TipoOperacion
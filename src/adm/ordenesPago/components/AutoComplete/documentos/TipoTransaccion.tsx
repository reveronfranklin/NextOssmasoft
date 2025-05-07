import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import { Autocomplete, TextField } from "@mui/material"
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import useServices from '../../../services/useServices'

interface ITipoTransaction {
  id: number
  descripcion: string,
  value: number
}

const TipoTransaction = (props: any) => {
  const { fetchDescriptivaById } = useServices()
  const qc: QueryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['TipoTransaction'],
    queryFn: () => fetchDescriptivaById({ tituloId: 34 }),
    retry: 3,
    staleTime: 5000 * 60 * 60,
  }, qc)

  const TipoTransaction: ITipoTransaction[] = query.data?.data ?? [];
  const [selectedValue, setSelectedValue] = useState<ITipoTransaction | null>(null)

  useEffect(() => {
    if (props.id === 0) {
      setSelectedValue(null)

      return
    }

    const value = TipoTransaction.filter((item: { id: number }) => item?.id == props?.id)[0]

    if (value) {
      handleChange(null, value)
    }

  }, [props.id, TipoTransaction])

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
            options={TipoTransaction}
            value={selectedValue}
            id='autocomplete-TipoTransaction'
            getOptionLabel={(option) => option.id + '-' + option.descripcion}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} label="TipoTransaction" />}
            disabled={props.disabled}
          />
        )
      }
    </>
  )
}

export default TipoTransaction
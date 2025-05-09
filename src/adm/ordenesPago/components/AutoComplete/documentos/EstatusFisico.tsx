import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import { Autocomplete, TextField } from "@mui/material"
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query'
import useServices from '../../../services/useServices'

interface IEstatusFisico {
  id: number
  descripcion: string,
  value: number
}

const EstatusFisico = (props: any) => {
  const { fetchDescriptivaById } = useServices()
  const qc: QueryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['TipoTransaccion'],
    queryFn: () => fetchDescriptivaById({ tituloId: 33 }),
    retry: 3,
    staleTime: 5000 * 60 * 60,
  }, qc)

  const EstatusFisico: IEstatusFisico[] = query.data?.data ?? [];
  const [selectedValue, setSelectedValue] = useState<IEstatusFisico | null>(null)

    useEffect(() => {
      if (props.id === 0) {
        setSelectedValue(null)

        return
      }

      const value = EstatusFisico.filter((item: { id: number }) => item?.id == props?.id)[0]

      if (value) {
        handleChange(null, value)
      }

    }, [props.id, EstatusFisico])

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
              options={EstatusFisico}
              value={selectedValue}
              id='autocomplete-EstatusFisico'
              getOptionLabel={(option) => option.id + '-' + option.descripcion}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} label="EstatusFisco" />}
            />
          )
        }
      </>
    )
}

export default EstatusFisico
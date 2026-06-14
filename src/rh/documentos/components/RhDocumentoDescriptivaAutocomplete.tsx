import { useEffect, useMemo, useState } from 'react'
import { Autocomplete, Box, Skeleton, TextField } from '@mui/material'
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva'
import { fetchRhDescriptivasByTitulo } from '../services/rhDocumentosService'

interface Props {
  id: number | null | undefined
  tituloId: number
  label: string
  required?: boolean
  onSelectionChange: (value: ISelectListDescriptiva | null) => void
}

const RhDocumentoDescriptivaAutocomplete = ({ id, tituloId, label, required = false, onSelectionChange }: Props) => {
  const qc: QueryClient = useQueryClient()
  const [selectedValue, setSelectedValue] = useState<ISelectListDescriptiva | null>(null)

  const query = useQuery({
    queryKey: ['rhDocumentosDescriptiva', tituloId],
    queryFn: () => fetchRhDescriptivasByTitulo(tituloId),
    retry: 3,
    staleTime: 5000 * 60 * 60
  }, qc)

  const options = useMemo(() => query.data ?? [], [query.data])

  useEffect(() => {
    if (!id || id === 0) {
      setSelectedValue(null)

      return
    }

    const value = options.find(item => item.id === id)

    if (value) {
      setSelectedValue(value)
    }
  }, [id, options])

  const handleChange = (e: any, newValue: ISelectListDescriptiva | null) => {
    setSelectedValue(newValue)
    onSelectionChange(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      {query.isLoading ? (
        <Skeleton width='100%' height={56} sx={{ borderRadius: 1 }} />
      ) : (
        <Autocomplete
          options={options}
          value={selectedValue}
          id={`autocomplete-${label.replaceAll(' ', '-')}`}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={option => `${option.id}-${option.descripcion}`}
          onChange={handleChange}
          renderInput={params => <TextField {...params} label={label} required={required} />}
        />
      )}
    </Box>
  )
}

export default RhDocumentoDescriptivaAutocomplete

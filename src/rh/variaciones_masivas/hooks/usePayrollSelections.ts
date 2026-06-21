import { useQuery } from '@tanstack/react-query';
import { AutocompleteOption, ConceptFilters } from '../interfaces';
import useServiceAutoSelects from '../services/useServiceAutoSelects';

const TIME_IN_MEMORY = 1000 * 60 * 60; // 1 Hora

export const usePayrollMetadata = (filters?: ConceptFilters) => {
  const {
    getListTipoNomina,
    getListConceptos,
    getListFrecuencias
  } = useServiceAutoSelects()

  const tipoNominaQuery = useQuery({
    queryKey: ['list-type-payroll-autoselect'],
    queryFn: getListTipoNomina,
    staleTime: TIME_IN_MEMORY,
    gcTime: TIME_IN_MEMORY,
    select: ({ data }: any): AutocompleteOption[] => {
      return data.map((item: any) => ({
        label: `${item.siglasTipoNomina} - ${item.descripcion} - ${item.frecuenciaPago}`,
        value: item,
        id: item.codigoTipoNomina
      })) || []
    }
  })

  const conceptosQuery = useQuery({
    queryKey: ['list-concepts-autoselect'],
    queryFn: getListConceptos,
    staleTime: TIME_IN_MEMORY,
    gcTime: TIME_IN_MEMORY,
    select: ({ data }: any): AutocompleteOption[] => {
      if (!data) return []

      return data
        .filter((item: any) => {
          const coincideNomina = filters?.codigoTipoNomina
            ? String(item.codigoTipoNomina) === String(filters.codigoTipoNomina)
            : true

          const itemEsAutomatico = Boolean(item.automatico)

          const coincideAutomatico = filters?.automatico !== undefined
            ? itemEsAutomatico === filters.automatico
            : true

          return coincideNomina && coincideAutomatico
        })
        .map((item: any) => ({
          label: `${item.codigo}-${item.codigoTipoNomina}-${item.denominacion}`,
          value: item,
          id: `${item.codigo}${item.codigoTipoNomina}`
        }))
    }
  })

  const frecuenciasQuery = useQuery({
    queryKey: ['list-frequency-autoselect'],
    queryFn: getListFrecuencias,
    staleTime: TIME_IN_MEMORY,
    gcTime: TIME_IN_MEMORY,
    select: ({ data }: any): AutocompleteOption[] => {
      return data?.map((item: any) => ({
        label: `${item.id}-${item.descripcion}`,
        value: item,
        id: item.id
      })) || []
    }
  })

  return {
    tiposNomina: tipoNominaQuery.data ?? [],
    conceptos: conceptosQuery.data ?? [],
    frecuencias: frecuenciasQuery.data ?? [],
    isLoading: conceptosQuery.isLoading || frecuenciasQuery.isLoading || tipoNominaQuery.isLoading,
    isError: conceptosQuery.isError || frecuenciasQuery.isError || tipoNominaQuery.isError,
    refetchAll: () => {
      tipoNominaQuery.refetch();
      conceptosQuery.refetch();
      frecuenciasQuery.refetch();
    }
  }
}
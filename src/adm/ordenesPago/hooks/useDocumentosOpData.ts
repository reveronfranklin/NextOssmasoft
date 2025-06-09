// hooks/useDocumentosOpData.ts
"use client";

import { useQueryClient } from '@tanstack/react-query';
import useServicesDocumentosOp from '../services/useServicesDocumentosOp';
import { IGetListByOrdenPago } from '../interfaces/documentosOp/listDocumentoByOrdenPago';
import { useDispatch } from 'react-redux'
import { setDocumentCount, setBaseTotalDocumentos } from 'src/store/apps/ordenPago'

export const useDocumentosOpData = () => {
  const { getListDocumentos } = useServicesDocumentosOp()
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  const fetchDocumentos = async (filter: IGetListByOrdenPago) => {
    return await queryClient.fetchQuery({
      queryKey: ['documentosTable', filter.codigoOrdenPago],
      queryFn: () => getListDocumentos(filter),
      staleTime: 1000 * 60 * 5,
    });
  };

  const prefetchDocumentos = async (filter: IGetListByOrdenPago) => {
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ['documentosTable', filter.codigoOrdenPago],
        queryFn: () => getListDocumentos(filter),
        staleTime: 1000 * 60 * 5,
      });

      dispatch(setDocumentCount(data.cantidadRegistros))
      dispatch(setBaseTotalDocumentos(data.total1))

      return data;
    } catch (error) {
      console.error('Error prefetching documentos:', error);
      throw error;
    }
  }

  return {
    fetchDocumentos,
    prefetchDocumentos,
  }
}
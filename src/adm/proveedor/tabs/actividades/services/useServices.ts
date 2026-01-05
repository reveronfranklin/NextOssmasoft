import { useCallback } from 'react';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { UrlServices } from '../enums/UrlServices.enum';
import { Actividad } from '../interfaces';

export const useActividadProveedorServices = (): {
  getActividadesByProveedor: (codigoProveedor: number) => Promise<Actividad[]>;
  createActividad: (data: Actividad) => Promise<any>;
  updateActividad: (data: Actividad) => Promise<any>;
  deleteActividad: (codigoActProveedor: number) => Promise<any>;
} => {

  const getActividadesByProveedor = useCallback(
    async (codigoProveedor: number): Promise<Actividad[]> => {
      const response = await ossmmasofApi.post(
        UrlServices.GET_ACTIVIDADES,
        { CodigoProveedor: codigoProveedor }
      );

      return response?.data?.data || [];
    },
    []
  );

  const createActividad = useCallback(async (data: Actividad) => {
    const response = await ossmmasofApi.post(
      UrlServices.CREATE_ACTIVIDADES,
      data
    );

    return response.data;
  }, []);

  const updateActividad = useCallback(async (data: Actividad) => {
    const response = await ossmmasofApi.post(
      UrlServices.UPDATE_ACTIVIDADES,
      data
    );

    return response.data;
  }, []);

  const deleteActividad = useCallback(async (codigoActProveedor: number) => {
    const response = await ossmmasofApi.post(
      `${UrlServices.DELETE_ACTIVIDADES}`,
        { codigoActProveedor }
    );

    return response.data;
  }, []);

  return {
    getActividadesByProveedor,
    createActividad,
    updateActividad,
    deleteActividad
  };
};

export default useActividadProveedorServices;

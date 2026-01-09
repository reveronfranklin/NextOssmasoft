import { useCallback } from 'react';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { UrlServices } from '../enums/UrlServices.enum';
import { Actividad } from '../interfaces';
import toast from 'react-hot-toast';

export const useActividadProveedorServices = (): {
  getActividadesByProveedor: (codigoProveedor: number) => Promise<Actividad[]>;
  createActividad: (data: Actividad) => Promise<any>;
  updateActividad: (data: Actividad) => Promise<any>;
  deleteActividad: (codigoActProveedor: number) => Promise<any>;
} => {

  const getActividadesByProveedor = useCallback(
    async (codigoProveedor: number): Promise<Actividad[]> => {
      try {
        const response = await ossmmasofApi.post(
          UrlServices.GET_ACTIVIDADES,
          { CodigoProveedor: codigoProveedor }
        );
        return response?.data?.data || [];
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Error al obtener actividades');
        console.error('Error getActividadesByProveedor:', error);
        throw error;
      }
    },
    []
  );

  const createActividad = useCallback(async (data: Actividad) => {
    try {
      const response = await ossmmasofApi.post(
        UrlServices.CREATE_ACTIVIDADES,
        data
      );

      if (response.data?.isValid === false) {
        toast.error(response.data.message || 'Error de validación');
        throw response.data;
      }

      toast.success('Actividad creada correctamente');
      return response.data;

    } catch (error: any) {
      const errorData = error?.response?.data;

      if (error?.response?.status === 400 && typeof errorData === 'object') {
        const firstKey = Object.keys(errorData)[0];
        const message = errorData[firstKey]?.[0];
        toast.error(message || 'Error de validación');
      } else {
        toast.error(
          errorData?.message ||
          error?.message ||
          'Error al crear la actividad'
        );
      }

      console.error('Error createActividad:', error);
      throw error;
    }
  }, []);

  const updateActividad = useCallback(async (data: Actividad) => {
    try {
      const response = await ossmmasofApi.post(
        UrlServices.UPDATE_ACTIVIDADES,
        data
      );

      if (response.data?.isValid === false) {
        toast.error(response.data.message || 'Error de validación');
        throw response.data;
      }

      toast.success('Actividad actualizada correctamente');
      return response.data;

    } catch (error: any) {
      const errorData = error?.response?.data;

      if (error?.response?.status === 400 && typeof errorData === 'object') {
        const firstKey = Object.keys(errorData)[0];
        const message = errorData[firstKey]?.[0];
        toast.error(message || 'Error de validación');
      } else {
        toast.error(
          errorData?.message ||
          error?.message ||
          'Error al actualizar la actividad'
        );
      }

      console.error('Error updateActividad:', error);
      throw error;
    }
  }, []);

  const deleteActividad = useCallback(async (codigoActProveedor: number) => {
    try {
      const response = await ossmmasofApi.post(
        UrlServices.DELETE_ACTIVIDADES,
        { codigoActProveedor }
      );

      if (response.data?.isValid === false) {
        toast.error(response.data.message || 'Error de validación');
        throw response.data;
      }

      toast.success('Actividad eliminada correctamente');
      return response.data;

    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        'Error al eliminar la actividad'
      );
      console.error('Error deleteActividad:', error);
      throw error;
    }
  }, []);

  return {
    getActividadesByProveedor,
    createActividad,
    updateActividad,
    deleteActividad
  };
};

export default useActividadProveedorServices;

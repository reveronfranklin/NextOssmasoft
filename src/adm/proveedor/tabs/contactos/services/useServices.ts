import { useCallback } from 'react';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { UrlServices } from '../enums/UrlServices.enum';
import { Contacto } from '../interfaces';
import toast from 'react-hot-toast';

export const useContactoProveedorServices = (): {
  getContactosByProveedor: (codigoProveedor: number) => Promise<Contacto[]>;
  createContacto: (data: Contacto) => Promise<any>;
  updateContacto: (data: Contacto) => Promise<any>;
  deleteContacto: (codigoContactoProveedor: number) => Promise<any>;
} => {

  const getContactosByProveedor = useCallback(
    async (codigoProveedor: number): Promise<Contacto[]> => {
      try {
        const response = await ossmmasofApi.post(
          UrlServices.GET_CONTACTOS,
          { CodigoProveedor: codigoProveedor }
        );
        return response?.data?.data || [];
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Error al obtener contactos');
        throw error;
      }
    },
    []
  );

  const createContacto = useCallback(async (data: Contacto) => {
    try {
      const response = await ossmmasofApi.post(
        UrlServices.CREATE_CONTACTOS,
        data
      );

      if (response.data?.isValid === false) {
        toast.error(response.data.message || 'Error de validación');
        throw response.data;
      }

      toast.success('Contacto creado correctamente');
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
          'Error al crear el contacto'
        );
      }

      throw error;
    }
  }, []);

  const updateContacto = useCallback(async (data: Contacto) => {
    try {
      const response = await ossmmasofApi.post(
        UrlServices.UPDATE_CONTACTOS,
        data
      );

      if (response.data?.isValid === false) {
        toast.error(response.data.message || 'Error de validación');
        throw response.data;
      }

      toast.success('Contacto actualizado correctamente');
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
          'Error al actualizar el contacto'
        );
      }

      throw error;
    }
  }, []);

  const deleteContacto = useCallback(async (codigoContactoProveedor: number) => {
    try {
      const response = await ossmmasofApi.post(
        `${UrlServices.DELETE_CONTACTOS}`,
        { codigoContactoProveedor }
      );

      if (response.data?.isValid === false) {
        toast.error(response.data.message || 'Error de validación');
        throw response.data;
      }

      toast.success('Contacto eliminado correctamente');
      return response.data;

    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        'Error al eliminar el contacto'
      );
      throw error;
    }
  }, []);

  return {
    getContactosByProveedor,
    createContacto,
    updateContacto,
    deleteContacto
  };
};

export default useContactoProveedorServices;

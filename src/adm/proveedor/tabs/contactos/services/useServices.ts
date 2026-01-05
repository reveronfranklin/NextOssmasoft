import { useCallback } from 'react';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { UrlServices } from '../enums/UrlServices.enum';
import { Contacto } from '../interfaces';

export const useContactoProveedorServices = (): {
  getContactosByProveedor: (codigoProveedor: number) => Promise<Contacto[]>;
  createContacto: (data: Contacto) => Promise<any>;
  updateContacto: (data: Contacto) => Promise<any>;
  deleteContacto: (codigoContactoProveedor: number) => Promise<any>;
} => {

  const getContactosByProveedor = useCallback(
    async (codigoProveedor: number): Promise<Contacto[]> => {
      const response = await ossmmasofApi.post(
        UrlServices.GET_CONTACTOS,
        { CodigoProveedor: codigoProveedor }
      );

      return response?.data?.data || [];
    },
    []
  );

  const createContacto = useCallback(async (data: Contacto) => {
    const response = await ossmmasofApi.post(
      UrlServices.CREATE_CONTACTOS,
      data
    );

    return response.data;
  }, []);

  const updateContacto = useCallback(async (data: Contacto) => {
    const response = await ossmmasofApi.post(
      UrlServices.UPDATE_CONTACTOS,
      data
    );

    return response.data;
  }, []);

  const deleteContacto = useCallback(async (codigoContactoProveedor: number) => {
    const response = await ossmmasofApi.post(
      `${UrlServices.DELETE_CONTACTOS}`,
      { codigoContactoProveedor }
    );

    return response.data;
  }, []);

  return {
    getContactosByProveedor,
    createContacto,
    updateContacto,
    deleteContacto
  };
};

export default useContactoProveedorServices;

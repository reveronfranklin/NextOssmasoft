import { useCallback } from "react";
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { UrlServices } from '../enums/UrlServices.enum';
import { IGenericoDescripcion } from '../interfaces';
import toast from 'react-hot-toast';

export const useServices = (): {
  getPaises: () => Promise<IGenericoDescripcion[]>;
  getEstados: (paisId: string) => Promise<IGenericoDescripcion[]>;
  getMunicipios: (params: { CodigoPais: number; CodigoEstado: number }) => Promise<IGenericoDescripcion[]>;
  getCiudades: (params: { CodigoPais: number; CodigoEstado: number; CodigoMunicipio: number }) => Promise<IGenericoDescripcion[]>;
  getParroquias: (params: { CodigoPais: number; CodigoEstado: number; CodigoMunicipio: number; CodigoCiudad: number }) => Promise<IGenericoDescripcion[]>;
  getDirecciones: (filters: { pais?: string; estado?: string; municipio?: string }) => Promise<any>;
  getSectores: (params: { CodigoPais: number; CodigoEstado: number; CodigoMunicipio: number; CodigoCiudad: number; CodigoParroquia: number }) => Promise<IGenericoDescripcion[]>;
  getUrbanizaciones: (params: { CodigoPais: number; CodigoEstado: number; CodigoMunicipio: number; CodigoCiudad: number; CodigoParroquia: number; CodigoSector: number }) => Promise<IGenericoDescripcion[]>;
  getTituloDescriptiva: (tituloId: number) => Promise<any>;
  getDireccionesByProveedor: (codigoProveedor: number) => Promise<any>;
  createDireccion: (data: any) => Promise<any>;
  updateDireccion: (data: any) => Promise<any>;
  deleteDireccion: (codigoDirProveedor: number) => Promise<any>;
} => {

  const getPaises = useCallback(async (): Promise<IGenericoDescripcion[]> => {
    try {
      const response = await ossmmasofApi.post(UrlServices.GET_PAISES);

      return response.data as IGenericoDescripcion[];
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al obtener países');

      throw error;
    }
  }, []);

  const getEstados = useCallback(async (paisId: string): Promise<IGenericoDescripcion[]> => {
    try {
      const response = await ossmmasofApi.post(UrlServices.GET_ESTADOS, { paisId });

      return response.data as IGenericoDescripcion[];
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al obtener estados');

      throw error;
    }
  }, []);

  const getMunicipios = useCallback(async (params: { CodigoPais: number; CodigoEstado: number }): Promise<IGenericoDescripcion[]> => {
    try {
      const response = await ossmmasofApi.post(UrlServices.GET_MUNICIPIOS, params);

      return response.data as IGenericoDescripcion[];
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al obtener municipios');

      throw error;
    }
  }, []);

  const getCiudades = useCallback(async (params: { CodigoPais: number; CodigoEstado: number; CodigoMunicipio: number }): Promise<IGenericoDescripcion[]> => {
    try {
      const response = await ossmmasofApi.post(UrlServices.GET_CIUDADES, params);

      return response.data as IGenericoDescripcion[];
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al obtener ciudades');

      throw error;
    }
  }, []);

  const getParroquias = useCallback(async (params: { CodigoPais: number; CodigoEstado: number; CodigoMunicipio: number; CodigoCiudad: number }): Promise<IGenericoDescripcion[]> => {
    try {
      const response = await ossmmasofApi.post(UrlServices.GET_PARROQUIAS, params);

      return response.data as IGenericoDescripcion[];
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al obtener parroquias');

      throw error;
    }
  }, []);

  const getDirecciones = useCallback(async (filters: { pais?: string; estado?: string; municipio?: string }) => {
    try {
      const response = await ossmmasofApi.post(UrlServices.GET_DIRECCIONES, filters);

      if (response.data?.isValid === false) {
        toast.error(response.data.message || 'Error al obtener direcciones');

        throw response.data;
      }

      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Error al obtener direcciones');
      throw error;
    }
  }, []);

  const getUrbanizaciones = useCallback(async (params: { CodigoPais: number; CodigoEstado: number; CodigoMunicipio: number; CodigoCiudad: number; CodigoParroquia: number; CodigoSector: number }): Promise<IGenericoDescripcion[]> => {
    try {
      const response = await ossmmasofApi.post(UrlServices.GET_URBANIZACIONES, params);

      return response.data as IGenericoDescripcion[];
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al obtener urbanizaciones');

      throw error;
    }
  }, []);

  const getSectores = useCallback(async (params: { CodigoPais: number; CodigoEstado: number; CodigoMunicipio: number; CodigoCiudad: number; CodigoParroquia: number }): Promise<IGenericoDescripcion[]> => {
    try {
      const response = await ossmmasofApi.post(UrlServices.GET_SECTORES, params);

      return response.data as IGenericoDescripcion[];
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al obtener sectores');

      throw error;
    }
  }, []);

  const getTituloDescriptiva = useCallback(async (tituloId: number) => {
    try {
      const response = await ossmmasofApi.post(UrlServices.GET_TITULO, { tituloId });

      if (response.data?.isValid === false) {
        toast.error(response.data.message || 'Error al obtener título');

        throw response.data;
      }

      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Error al obtener título');

      throw error;
    }
  }, []);

  const getDireccionesByProveedor = useCallback(async (codigoProveedor: number) => {
    try {
      const response = await ossmmasofApi.post(UrlServices.GET_DIRECCIONES, { CodigoProveedor: codigoProveedor });

      if (response.data?.isValid === false) {
        toast.error(response.data.message || 'Error al obtener direcciones del proveedor');

        throw response.data;
      }

      return response?.data?.data || [];
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Error al obtener direcciones del proveedor');
      throw error;
    }
  }, []);

  const createDireccion = useCallback(async (data: any) => {
    try {
      const response = await ossmmasofApi.post(UrlServices.CREATE_DIRECCION, data);

      if (response.data?.isValid === false) {
        toast.error(response.data.message || 'Error de validación');

        throw response.data;
      }

      toast.success('Dirección creada correctamente');

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
          'Error al crear la dirección'
        );
      }

      throw error;
    }
  }, []);

  const updateDireccion = useCallback(async (data: any) => {
    try {
      const response = await ossmmasofApi.post(`${UrlServices.UPDATE_DIRECCION}`, data);

      if (response.data?.isValid === false) {
        toast.error(response.data.message || 'Error de validación');

        throw response.data;
      }

      toast.success('Dirección actualizada correctamente');

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
          'Error al actualizar la dirección'
        );
      }

      throw error;
    }
  }, []);

  const deleteDireccion = useCallback(async (codigoDirProveedor: number) => {
    try {
      const response = await ossmmasofApi.post(
        `${UrlServices.DELETE_DIRECCION}`,
        { CodigoDirProveedor: codigoDirProveedor }
      );

      if (response.data?.isValid === false) {
        toast.error(response.data.message || 'Error de validación');

        throw response.data;
      }

      toast.success('Dirección eliminada correctamente');

      return response.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        'Error al eliminar la dirección'
      );

      throw error;
    }
  }, []);

  return {
    getPaises,
    getEstados,
    getMunicipios,
    getCiudades,
    getParroquias,
    getDirecciones,
    getUrbanizaciones,
    getSectores,
    getTituloDescriptiva,
    getDireccionesByProveedor,
    createDireccion,
    updateDireccion,
    deleteDireccion
  };
};

export default useServices;

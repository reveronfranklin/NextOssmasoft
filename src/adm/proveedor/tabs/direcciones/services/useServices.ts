import { useCallback } from "react";
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { UrlServices } from '../enums/UrlServices.enum';
import { IGenericoDescripcion } from '../interfaces';

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
    const response = await ossmmasofApi.post(UrlServices.GET_PAISES);

    return response.data as IGenericoDescripcion[];
  }, []);

  const getEstados = useCallback(async (paisId: string): Promise<IGenericoDescripcion[]> => {
    const response = await ossmmasofApi.post(UrlServices.GET_ESTADOS, { paisId });

    return response.data as IGenericoDescripcion[];
  }, []);

  const getMunicipios = useCallback(async (params: { CodigoPais: number; CodigoEstado: number }): Promise<IGenericoDescripcion[]> => {
    const response = await ossmmasofApi.post(UrlServices.GET_MUNICIPIOS, params);

    return response.data as IGenericoDescripcion[];
  }, []);

  const getCiudades = useCallback(async (params: { CodigoPais: number; CodigoEstado: number; CodigoMunicipio: number }): Promise<IGenericoDescripcion[]> => {
    const response = await ossmmasofApi.post(UrlServices.GET_CIUDADES, params);

    return response.data as IGenericoDescripcion[];
  }, []);

  const getParroquias = useCallback(async (params: { CodigoPais: number; CodigoEstado: number; CodigoMunicipio: number; CodigoCiudad: number }): Promise<IGenericoDescripcion[]> => {
    const response = await ossmmasofApi.post(UrlServices.GET_PARROQUIAS, params);

    return response.data as IGenericoDescripcion[];
  }, []);

  const getDirecciones = useCallback(async (filters: { pais?: string; estado?: string; municipio?: string }) => {
    const response = await ossmmasofApi.post(UrlServices.GET_DIRECCIONES, filters);

    return response.data;
  }, []);

  const getUrbanizaciones = useCallback(async (params: { CodigoPais: number; CodigoEstado: number; CodigoMunicipio: number; CodigoCiudad: number; CodigoParroquia: number,  CodigoSector: number }): Promise<IGenericoDescripcion[]> => {
    const response = await ossmmasofApi.post(UrlServices.GET_URBANIZACIONES, params);

    return response.data as IGenericoDescripcion[];
  }, []);

  const getSectores = useCallback(async (params: { CodigoPais: number; CodigoEstado: number; CodigoMunicipio: number; CodigoCiudad: number; CodigoParroquia: number }): Promise<IGenericoDescripcion[]> => {
    const response = await ossmmasofApi.post(UrlServices.GET_SECTORES, params);

    return response.data as IGenericoDescripcion[];
  }, []);

  const getTituloDescriptiva = useCallback(async (tituloId: number) => {
    const response = await ossmmasofApi.post(UrlServices.GET_TITULO, { tituloId });

    return response.data;
  }, []);

  const getDireccionesByProveedor = useCallback(async (codigoProveedor: number) => {
    const response = await ossmmasofApi.post(UrlServices.GET_DIRECCIONES, { CodigoProveedor: codigoProveedor });

    return response?.data?.data || [];
  }, []);

  const createDireccion = useCallback(async (data: any) => {
    const response = await ossmmasofApi.post(UrlServices.CREATE_DIRECCION, data);

    return response.data;
  }, []);

  const updateDireccion = useCallback(async (data: any) => {
    const response = await ossmmasofApi.post(`${UrlServices.UPDATE_DIRECCION}`, data);

    return response.data;
  }, []);

  const deleteDireccion = useCallback(async (codigoDirProveedor: number) => {
    const response = await ossmmasofApi.post(`${UrlServices.DELETE_DIRECCION}`, { CodigoDirProveedor: codigoDirProveedor });

    return response.data;
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

export default useServices
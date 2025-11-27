import { useCallback } from "react";
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { DireccionesUrls } from '../enums/urlServices.enum';
import { IGenericoDescripcion } from '../interfaces/direcciones.interfaces';

export const useDireccionesService = (): {
  getPaises: () => Promise<IGenericoDescripcion[]>;
  getEstados: (paisId: string) => Promise<IGenericoDescripcion[]>;
  getMunicipios: (params: { CodigoPais: number; CodigoEstado: number }) => Promise<IGenericoDescripcion[]>;
  getCiudades: (params: { CodigoPais: number; CodigoEstado: number; CodigoMunicipio: number }) => Promise<IGenericoDescripcion[]>;
  getParroquias: (params: { CodigoPais: number; CodigoEstado: number; CodigoMunicipio: number; CodigoCiudad: number }) => Promise<IGenericoDescripcion[]>;
  getDirecciones: (filters: { pais?: string; estado?: string; municipio?: string }) => Promise<any>;
  getTituloDescriptiva: (tituloId: number) => Promise<any>;
  getDireccionesByPersona: (codigoPersona: number) => Promise<any>;
  createDireccion: (data: any) => Promise<any>;
  updateDireccion: (data: any) => Promise<any>;
  deleteDireccion: (id: number) => Promise<any>;
} => {
  const getPaises = useCallback(async (): Promise<IGenericoDescripcion[]> => {
    const response = await ossmmasofApi.post(DireccionesUrls.GET_PAISES);

    return response.data as IGenericoDescripcion[];
  }, []);

  const getEstados = useCallback(async (paisId: string): Promise<IGenericoDescripcion[]> => {
    const response = await ossmmasofApi.post(DireccionesUrls.GET_ESTADOS, { paisId });

    return response.data as IGenericoDescripcion[];
  }, []);

  const getMunicipios = useCallback(async (params: { CodigoPais: number; CodigoEstado: number }): Promise<IGenericoDescripcion[]> => {
    const response = await ossmmasofApi.post(DireccionesUrls.GET_MUNICIPIOS, params);

    return response.data as IGenericoDescripcion[];
  }, []);

  const getCiudades = useCallback(async (params: { CodigoPais: number; CodigoEstado: number; CodigoMunicipio: number }): Promise<IGenericoDescripcion[]> => {
    const response = await ossmmasofApi.post(DireccionesUrls.GET_CIUDADES, params);

    return response.data as IGenericoDescripcion[];
  }, []);

  const getParroquias = useCallback(async (params: { CodigoPais: number; CodigoEstado: number; CodigoMunicipio: number; CodigoCiudad: number }): Promise<IGenericoDescripcion[]> => {
    const response = await ossmmasofApi.post(DireccionesUrls.GET_PARROQUIAS, params);

    return response.data as IGenericoDescripcion[];
  }, []);

  const getDirecciones = useCallback(async (filters: { pais?: string; estado?: string; municipio?: string }) => {
    const response = await ossmmasofApi.post(DireccionesUrls.GET_DIRECCIONES, filters);

    return response.data;
  }, []);

  const getTituloDescriptiva = useCallback(async (tituloId: number) => {
    const response = await ossmmasofApi.post(DireccionesUrls.GET_TITULO, { tituloId });

    return response.data;
  }, []);

  const getDireccionesByPersona = useCallback(async (codigoPersona: number)=> {
    const response = await ossmmasofApi.post(DireccionesUrls.GET_BY_PERSONA, { codigoPersona });

    return response.data;
  }, []);

  const createDireccion = useCallback(async (data: any) => {
    const response = await ossmmasofApi.post(DireccionesUrls.CREATE_DIRECCION, data);

    return response.data;
  }, []);

  const updateDireccion = useCallback(async (data: any) => {
    const response = await ossmmasofApi.post(`${DireccionesUrls.UPDATE_DIRECCION}`, data);

    return response.data;
  }, []);

  const deleteDireccion = useCallback(async (id: number) => {
    const response = await ossmmasofApi.post(`${DireccionesUrls.DELETE_DIRECCION}/${id}`);

    return response.data;
  }, []);

  return {
    getPaises,
    getEstados,
    getMunicipios,
    getCiudades,
    getParroquias,
    getDirecciones,
    getTituloDescriptiva,
    getDireccionesByPersona,
    createDireccion,
    updateDireccion,
    deleteDireccion
  };
};
import useSWR, { SWRConfiguration } from "swr";
import { IPresupuesto } from '../interfaces/Presupuesto/i-presupuesto';

// ** Config
import authConfig from 'src/configs/auth'
import { useMemo } from "react";


const fetcher = (...args:[key:string] ) => fetch(...args).then(res => res.json());


//const storedToken = localStorage.getItem(authConfig.storageTokenKeyName);
const storedToken= typeof window !== "undefined" ? window.localStorage.getItem(authConfig.storageTokenKeyName) : false


export const usePresupuesto=(url: string,config:SWRConfiguration={})=>{
  const configuration = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${storedToken}`,
        'Content-Type': 'application/json',
      },
    }),
    []
  );

  const { data, error } = useSWR<IPresupuesto[]>([`http://localhost:46196/api${url}`,configuration], fetcher,config);


  return {
    presupuestos:data || [],
    isLoading:!error && !data,
    isError:error
  }
}

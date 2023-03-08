import useSWR, { SWRConfiguration } from "swr";
import { IPresupuesto } from '../interfaces/Presupuesto/i-presupuesto';


const fetcher = (...args:[key:string] ) => fetch(...args).then(res => res.json());

export const usePresupuesto=(url: string,config:SWRConfiguration={})=>{

  const { data, error } = useSWR<IPresupuesto[]>(`http://localhost:46196/api${url}`, fetcher,config);


  return {
    presupuestos:data || [],
    isLoading:!error && !data,
    isError:error
  }
}

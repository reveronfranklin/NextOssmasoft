import useSWR, { SWRConfiguration } from "swr";


const fetcher = (...args:[key:string] ) => fetch(...args).then(res => res.json());

export const usePresupuesto=(url: string,config:SWRConfiguration={})=>{

  const { data, error } = useSWR(`http://localhost:46196/api${url}`, fetcher,config);


  return {
    presupuestos:data.data || [],
    isLoading:!error && !data,
    isError:error
  }
}

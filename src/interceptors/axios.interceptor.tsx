
// ** Axios Imports
import axios, { AxiosRequestConfig } from 'axios';
import { getValidationError } from 'src/utlities/get-validation-error';


export const AxiosInterceptor=()=>{

  //saveInLocalStorage(LocalStorageKeys.TOKEN, '123123123123');

  const updateHeader = (request: AxiosRequestConfig) => {

    const token = '123123123123' //getInLocalStorage(LocalStorageKeys.TOKEN);
    const newHeaders = {
      Authorization: token,
      'Content-Type': 'application/json'
    };
    request.headers = newHeaders;

    return request;
  };
  axios.interceptors.request.use((request) => {
    if (request.url?.includes('assets')) return request;

    return updateHeader(request);
  });

  axios.interceptors.response.use(
    (response) => {
      console.log('response desde el interceptor', response);

      return response;
    },
    (error) => {
      console.log('error desde el interceptor', getValidationError(error.code));

      return Promise.reject(error);
    }
  );



}

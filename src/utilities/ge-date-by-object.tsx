import { IFechaDto } from "src/interfaces/fecha-dto";

export const getDateByObject=(dateObject:IFechaDto)=>{

if(dateObject !== undefined){


  const date = new Date(+dateObject.year, +dateObject.month, +dateObject.day);

  return date;
}else{
  return new Date();;
}


};

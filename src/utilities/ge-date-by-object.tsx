
import { IFechaDto } from "src/interfaces/fecha-dto";

export const getDateByObject=(dateObject:IFechaDto)=>{
console.log('getDateByObject',dateObject)
if(dateObject !== undefined){

   const year= Number(dateObject.year);

   const month = Number(dateObject.month);
   const day = Number(dateObject.day);
   const date = new Date(year, month-1, day);

  return date;
}else{
  return new Date();;
}


};

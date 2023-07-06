import { IFechaDto } from "src/interfaces/fecha-dto";


export const fechaToFechaObj = (hasta:Date)=>{

  const originalMonth = hasta.getUTCMonth() + 1; //months from 1-12
  const originalDay = hasta.getUTCDate();
  const originalYear = hasta.getUTCFullYear();

  let month='00'+ originalMonth.toString();
  month=month.substring(month.length - 2)

  let day = '00' + originalDay.toString();
  day = day.substring(day.length-2)

  const fechaObj:IFechaDto = {year:originalYear.toString(),month:month,day:day};

  return fechaObj;

}



export function padTo2Digits(num:any) {
  return num.toString().padStart(2, '0');
}

export const getDefaultFechaObj=()=>{

const date = new Date();

const year = date.getFullYear().toString();
const month = padTo2Digits(date.getMonth() + 1);
const day = padTo2Digits(date.getDate());
const defaultDate :IFechaDto={
  year:year,
  month:month,
  day:day
 }

 return defaultDate


}


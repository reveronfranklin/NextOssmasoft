
import { IFechaDto, IIndexMonth } from "src/interfaces/fecha-dto";

const indexMonth:IIndexMonth[]=[
  {index:0,month:1},
  {index:1,month:2},
  {index:2,month:3},
  {index:3,month:4},
  {index:4,month:5},
  {index:5,month:6},
  {index:6,month:7},
  {index:7,month:8},
  {index:8,month:9},
  {index:9,month:10},
  {index:10,month:11},
  {index:11,month:12},

]

export const getDateByObject=(dateObject:IFechaDto)=>{

if(dateObject ){

   const year= Number(dateObject.year);
   const month = Number(dateObject.month);
   const day = Number(dateObject.day);
  const date = new Date(year,month-1, day);

  return date;

}else{

  return null;
}


};

export const monthByIndex= (indexParam:number)=>{

 
  const indice= indexMonth.filter((num) => num.index === indexParam)

  return indice[0].month;
};




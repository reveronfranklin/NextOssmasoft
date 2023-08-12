
export const getDate=(dateInput:string)=>{

if(dateInput !== undefined){
  const str = dateInput.substring(0, 10);
  const fechaArr = str.split('-');
  const year=fechaArr[0];
  const month=fechaArr[1];
  const day=fechaArr[2];
  const date = new Date(+year, +month-1, +day);

  return date;
}else{
  return new Date();;
}


};

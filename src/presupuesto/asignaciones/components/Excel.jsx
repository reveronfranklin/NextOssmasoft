import React from "react";
import * as XLSX from 'xlsx';
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setListPreAsignacionesCreate} from 'src/store/apps/pre-asignaciones'
import { Button } from "@mui/material";
import { NumericFormat } from "react-number-format";
import TextField from '@mui/material/TextField'

//https://github.com/HamzaAnwar1998/Upload-And-View-Excel-Files/blob/main/src/App.js
const Excel = () => {
  // onchange states
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [totalMonto, setTotalMonto] = useState(null);


  // submit state
  const [excelData, setExcelData] = useState(null);
  const dispatch = useDispatch();

  // onchange event
  const handleFile=(e)=>{

    let fileTypes = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv'];
    let selectedFile = e.target.files[0];
    if(selectedFile){
      if(selectedFile&&fileTypes.includes(selectedFile.type)){
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload=(e)=>{
          setExcelFile(e.target.result);
        }
      }
      else{
        setTypeError('Please select only excel file types');
        setExcelFile(null);
      }
    }
    else{
      console.log('Please select your file');
    }
  }


  // submit event
  const handleFileSubmit=(e)=>{
    e.preventDefault();

    if(excelFile!==null){
      const workbook = XLSX.read(excelFile,{type: 'buffer'});
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      //setExcelData(data.slice(0,10));
      setExcelData(data);
      console.log(excelData)
      if(excelData && excelData[0].codigoPucConcat){
        dispatch(setListPreAsignacionesCreate(data));
        const suma = excelData.reduce((anterior, actual) => anterior + (actual.presupuestado), 0);

        setTotalMonto(suma);
      }


    }
  }

  return (
    <div className="wrapper">

      {/* form */}
      <form className="form-group custom-form" onSubmit={handleFileSubmit}>


        <input type="file" required onChange={handleFile} />
        <Button type="submit" variant="outlined"  size='large' sx={{ ml:2}} >
         Cargar
        </Button>
        {typeError&&(
            <div className="alert alert-danger" role="alert">{typeError}</div>
          )}
          <NumericFormat
            sx={{ml:2 ,typography: 'body1' }}
            label='Total Desembolso:'
            disabled
            customInput={TextField}
            value={totalMonto} decimalSeparator="," decimalScale={2} thousandSeparator="."
          />
      {/*   <button type="submit" className="btn btn-success btn-md">Cargar</button>
        {typeError&&(
          <div className="alert alert-danger" role="alert">{typeError}</div>
        )} */}
      </form>

      {/* view data */}
{/*       <div className="viewer">
        {excelData?(
          <div className="table-responsive">
            <table className="table">

              <thead>
                <tr>
                  {Object.keys(excelData[0]).map((key)=>(
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {excelData.map((individualExcelData, index)=>(
                  <tr key={index}>
                    {Object.keys(individualExcelData).map((key)=>(
                      <td key={key}>{individualExcelData[key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        ):(
          <div>No File is uploaded yet!</div>
        )}
      </div>
 */}
    </div>
  );

}


export default Excel

import { Box, Card, CardActions, CardHeader, Grid, IconButton, Tooltip} from '@mui/material'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'

//import { ReactDatePickerProps } from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { DataGrid  } from '@mui/x-data-grid';

//import { useTheme } from '@mui/material/styles'

//import { usePresupuesto } from 'src/hooks/usePresupuesto';


import { useDispatch } from 'react-redux';


import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import Spinner from 'src/@core/components/spinner';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

import { FilterByPresupuestoDto } from 'src/interfaces/Presupuesto/i-filter-by-presupuesto-dto';
import FilterOnlyPresupuesto from 'src/views/forms/form-elements/presupuesto/FilterOnlyPresupuesto';
import { setListpresupuestoDtoSeleccionado } from 'src/store/apps/presupuesto';
import { IPreCargosGetDto } from 'src/interfaces/Presupuesto/i-pre-cargos-get-dto';
import { IFilterPreTituloDto } from 'src/interfaces/Presupuesto/i-filter-pre-titulo-dto';
import {  setListTipoPersonal, setOperacionCrudPreCargo, setPreCargoSeleccionado, setVerPreCargoActive } from 'src/store/apps/pre-cargo';
import DialogPreCargoInfo from 'src/presupuesto/cargo/views/DialogPreCargoInfo';
import { IListPresupuestoDto } from '../../../../interfaces/Presupuesto/i-list-presupuesto-dto';
import { IFilterPresupuestoIcp } from 'src/interfaces/Presupuesto/i-filter-presupuesto-icp';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar';

interface CellType {
  row: IPreCargosGetDto
}

const CargoList = () => {

  const columns = [

    {

      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Ver'>
            <IconButton size='small' onClick={() => handleView(row)}>
            <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip>

        </Box>
      )
    },
    {

      field: 'codigoCargo',
      headerName: 'Codigo',
      width: 80

    },

    {

      field: 'descripcionTipoPersonal',
      headerName: 'Tipo Personal',
      width: 300

    },

    {

      field: 'descripcionTipoCargo',
      headerName: 'Tipo Cargo',
      width: 400

    },
    {

      field: 'denominacion',
      headerName: 'Denominacion',
      width: 400

    },
   

  ]


  const updateField = (originalObject:IPreCargosGetDto, key:string, value:number) => {
    return {
      ...originalObject,
      [key]: value
    };
  };
  const updateFieldString = (originalObject:IPreCargosGetDto, key:string, value:string) => {
    return {
      ...originalObject,
      [key]: value
    };
  };

  const handleView=  (row : IPreCargosGetDto)=>{

    
    dispatch(setPreCargoSeleccionado(updateField(row,'page',page)))
    dispatch(setPreCargoSeleccionado(updateFieldString(row,'searchText',searchText)))

     // Operacion Crud 2 = Modificar presupuesto
    dispatch(setOperacionCrudPreCargo(2));
    dispatch(setVerPreCargoActive(true))


  }

/*   const handleAddChild=  (row : IPreCargosGetDto)=>{


    const newRow = {...row};
    newRow.codigoCargo=0;
    dispatch(setPreCargoSeleccionado(newRow))


   // Operacion Crud 1 = Crear presupuesto
   dispatch(setOperacionCrudPreCargo(1));
   dispatch(setVerPreCargoActive(true))


  } */

/*   const handleDoubleClick=(row:any)=>{


      handleView(row.row)
  } */
  const handleAdd=  ()=>{

    //dispatch(setPresupuesto(row))
    // Operacion Crud 1 = Crear presupuesto


      const defaultValues:IPreCargosGetDto = {
        codigoCargo: 0,
        tipoPersonalId:0,
        descripcionTipoPersonal:'',
        tipoCargoId:0,
        descripcionTipoCargo:'',
        denominacion:'',
        descripcion:'',
        grado:0,
        extra1:'',
        extra2:'',
        extra3:'',
        codigoPresupuesto:listpresupuestoDtoSeleccionado.codigoPresupuesto,
      }


      dispatch(setPreCargoSeleccionado(defaultValues))


    dispatch(setOperacionCrudPreCargo(1));
    dispatch(setVerPreCargoActive(true))


  }


  const dispatch = useDispatch();


  const {verPreCargoActive=false} = useSelector((state: RootState) => state.preCargo)
  const {listpresupuestoDtoSeleccionado={} as IListPresupuestoDto ,listpresupuestoDto=[] as IListPresupuestoDto[] } = useSelector((state: RootState) => state.presupuesto)




  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState<number>(20)
  const [searchText, setSearchText] = useState('')
  const [buffer, setBuffer] = useState('')

  const debounceTimeoutRef = useRef<any>(null)



  const qc: QueryClient = useQueryClient()

  const {isLoading,data} = useQuery({
    queryKey: ['cargos',  page,listpresupuestoDtoSeleccionado.codigoPresupuesto,searchText],
    queryFn: () => fetchCargo(listpresupuestoDtoSeleccionado.codigoPresupuesto),
    initialData: () => {
        return qc.getQueryData(['cargos', page,listpresupuestoDtoSeleccionado.codigoPresupuesto])
    },
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60, // 1 minuto en milisegundos
    retry: 3,
    enabled: !!listpresupuestoDtoSeleccionado,
 
}, qc)



const rowCount = data?.cantidadRegistros || 0
const rows =data?.data || []



const handlePageChange = (newPage: number) => {
  setPage(newPage)
}

const handleSizeChange = (newPageSize: number) => {
  setPage(0)
  setPageSize(newPageSize)
}

const fetchCargo=async(presupuesto:number)=>{

  //if(currentPage<=0) currentPage=1;
  const filter:IFilterPresupuestoIcp  ={
    codigoPresupuesto:presupuesto,
    codigoIcp:0,
    pageSize :pageSize,
    pageNumber:page,
    searchText:searchText
  }



  const response =  await ossmmasofApi.post<any>('/PreCargos/GetAllByPresupuestoPaginate',filter);

  
  return response.data;
}


  const handleViewTree=()=>{
   
   // setViewTable(false);

  }

  /*const handleViewTable=()=>{
    setViewTable(true);

  }*/
  useEffect(() => {

    const getCargo = async () => {
      
      //setLoading(true);


      //const responseAll= await ossmmasofApi.post<any>('/PreCargos/GetAllByPresupuesto',filter);
      //const data = responseAll.data.data;

      //dispatch(setListPreCargos(data));

      //setCargos(data);


      const filterTipoPersonal:IFilterPreTituloDto={
        tituloId:0,
        codigo:'TP'
      }
      const responseTipoPersonal= await ossmmasofApi.post<any>('/PreDescriptivas/GetAllByCodigoTitulo',filterTipoPersonal);
      console.log('responseTipoPersonal.data.data',responseTipoPersonal.data.data)
      dispatch(setListTipoPersonal(responseTipoPersonal.data.data));

     

     // setLoading(false);
    };



    const filter:FilterByPresupuestoDto={
      codigoPresupuesto:0
    }

    if(listpresupuestoDtoSeleccionado && listpresupuestoDtoSeleccionado.codigoPresupuesto!=null){
      filter.codigoPresupuesto=listpresupuestoDtoSeleccionado.codigoPresupuesto;
    }else{
      filter.codigoPresupuesto==listpresupuestoDto[0].codigoPresupuesto;
      dispatch(setListpresupuestoDtoSeleccionado(listpresupuestoDto[0]));
    }
    getCargo();



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verPreCargoActive, listpresupuestoDtoSeleccionado]);


  const handleSearch = (value: string) => {
  
    if (value === '') {
        setSearchText('')
        setBuffer('')

        return
    }

    const newBuffer =  value
    setBuffer(newBuffer)
    debouncedSearch()
    console.log('searchText---',searchText)
 
}

const debouncedSearch = () => {
    clearTimeout(debounceTimeoutRef.current)

    debounceTimeoutRef.current = setTimeout(() => {
        setSearchText(buffer)
    }, 2500)
}

  return (
    <Grid item xs={12}>
       <Card>
        <CardHeader title='Maestro Cargos' />
        <FilterOnlyPresupuesto/>
        <CardActions>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Agregar'>
            <IconButton  color='primary' size='small' onClick={() => handleAdd()}>
            <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip>

        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Tabla'>
            <IconButton size='small'  color='primary' onClick={() => handleViewTree()}>
            <Icon icon='fluent:table-24-regular' fontSize={20} />
            </IconButton>
          </Tooltip>

        </Box>


        </CardActions>

           
            {/*   {viewTable
              ?  <div></div>
              :
                loading ?   <Spinner sx={{ height: '100%' }} />
                :
                <Box sx={{ height: 500 }}>
                <DataGrid
                  getRowId={(row) => row.codigoCargo + row.denominacion}

                  columns={columns}
                  rows={rows}
                  onRowDoubleClick={(row) => handleDoubleClick(row)}

                  />


                </Box>

              } */}

{ isLoading  ? (
       <Spinner sx={{ height: '100%' }} />
      ) : (
        <DataGrid
        autoHeight
        pagination
        getRowId={(row) => row.codigoCargo}
        rows={rows}
        rowCount={rowCount}
        columns={columns}
        pageSize={pageSize}
        page={page}
        sortingMode='server'
        paginationMode='server'
        rowsPerPageOptions={[5, 10, 50]}
        onPageSizeChange={handleSizeChange}
        onPageChange={handlePageChange}
        components={{ Toolbar: ServerSideToolbar }}
        componentsProps={{
            baseButton: {
                variant: 'outlined'
            },
            toolbar: {
                printOptions: { disableToolbarButton: true },
                value: buffer,
                clearSearch: () => handleSearch(''),
                onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value)
            }
        }}
    />


      )}





        </Card>

        <DatePickerWrapper>
              <DialogPreCargoInfo/>
        </DatePickerWrapper>
    </Grid>


  )
}

export default CargoList

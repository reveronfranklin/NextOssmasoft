// ** React Imports
import { useEffect} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Third Party Imports
//import { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
//import CustomInput from '../pickers/PickersCustomInput'

// ** Types
//import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { Autocomplete, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

import { fetchDataListPresupuestoDto, fetchDataPost } from 'src/store/apps/presupuesto/thunks'



import { setListpresupuestoDtoSeleccionado } from 'src/store/apps/presupuesto'
import { IListPresupuestoDto } from 'src/interfaces/Presupuesto/i-list-presupuesto-dto'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'

import { setIcpSeleccionado, setListIcp } from 'src/store/apps/ICP'
import { IPreIndiceCategoriaProgramaticaGetDto } from '../../../interfaces/Presupuesto/i-pre-indice-categoria-programatica-get-dto';
import { IFilterPresupuestoIcp } from 'src/interfaces/Presupuesto/i-filter-presupuesto-icp'
import { FilterPrePresupuestoDto } from 'src/interfaces/Presupuesto/i-filter-by-presupuesto-dto'

//const FilterPresupuesto = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {

const FilterPresupuestoRelacionCargo = () => {


  const dispatch = useDispatch();

  const {listpresupuestoDto,listpresupuestoDtoSeleccionado} = useSelector((state: RootState) => state.presupuesto)
  const {listIcp,icpSeleccionado} = useSelector((state: RootState) => state.icp)


  // ** States

  //const [conceptosPorTipoNomina, setConceptosPorTipoNomina] = useState<IListConceptosDto[]>(conceptos)


  const handlePresupuestos= async (e: any,value:any)=>{



    if(value){



      dispatch(setListpresupuestoDtoSeleccionado(value));



    }else{

      const presupuesto:IListPresupuestoDto ={
        ano:0,
        codigoPresupuesto:0,
        descripcion:'',
        preFinanciadoDto:[]
      };


      dispatch(setListpresupuestoDtoSeleccionado(presupuesto));
    }


  }


  const handleICP =async (e: any,value:any)=>{



    if(value){



      dispatch(setIcpSeleccionado(value));




    }else{

      const icp:IPreIndiceCategoriaProgramaticaGetDto ={
        codigoIcp :0,
        codigoIcpPadre :0,
        ano :0,
        codigoSector:'',
        codigoPrograma :'',
        codigoSubPrograma :'',
        codigoProyecto:'',
        codigoActividad :'',
        denominacion :'',
        unidadEjecutora:'',
        descripcion:'',
        codigoFuncionario:0,
        codigoOficina :'',
        codigoPresupuesto:0,
        codigoIcpConcat:'',
        searchText:'',
      };


      dispatch(setIcpSeleccionado(icp));
    }


  }




  useEffect(() => {

    const getData = async (filter:IFilterPresupuestoIcp) => {


      const filterPresupuesto: FilterPrePresupuestoDto={
        codigoPresupuesto: 0,
        searchText : '',
        codigoEmpresa: 0,
        financiadoId:0,
        fechaDesde:new Date(),
        fechaHasta:new Date()
      }
      await fetchDataPost(dispatch,filterPresupuesto)


      await fetchDataListPresupuestoDto(dispatch);

      const responseAll= await ossmmasofApi.post<any>('/PreIndiceCategoriaProgramatica/GetAllFilter',filter);
      const data = responseAll.data.data;

      dispatch(setListIcp(data));

    };

    const filter:IFilterPresupuestoIcp={
      codigoPresupuesto:0,
      codigoIcp:0
    }

    if(listpresupuestoDtoSeleccionado && listpresupuestoDtoSeleccionado.codigoPresupuesto!=null){
      filter.codigoPresupuesto=listpresupuestoDtoSeleccionado.codigoPresupuesto;
      if(icpSeleccionado && icpSeleccionado.codigoIcp!=null){
        filter.codigoIcp=icpSeleccionado.codigoIcp;
      }
    }else{
      if(listpresupuestoDto && listpresupuestoDto.length>0){
        filter.codigoPresupuesto==listpresupuestoDto[0].codigoPresupuesto;
        filter.codigoIcp=listIcp[0].codigoIcp;
        dispatch(setListpresupuestoDtoSeleccionado(listpresupuestoDto[0]));
        dispatch(setListIcp(listIcp[0]));
      }

    }
    getData(filter);



  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, listpresupuestoDtoSeleccionado.codigoPresupuesto]);

  return (
    <Grid item xs={12}>
    <Card>
      <CardHeader title='Filtrar Saldo Presupuesto' />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} >
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>


              <div>
                <Autocomplete
                    sx={{ width: 350 }}
                    options={listpresupuestoDto}
                    isOptionEqualToValue={(option, value) => option.codigoPresupuesto === value.codigoPresupuesto}
                    id='autocomplete-presupuesto'
                    getOptionLabel={option => option.codigoPresupuesto + '-' + option.descripcion}
                    onChange={handlePresupuestos}
                    renderInput={params => <TextField {...params} label='Presupuesto' />}
                  />
              </div>
              <div>
                <Autocomplete
                    sx={{ width: 600 }}
                    options={listIcp}
                    isOptionEqualToValue={(option, value) => option.codigoIcp === value.codigoIcp}
                    id='autocomplete-ICP'
                    getOptionLabel={option => option.codigoIcpConcat + '-' + option.descripcion}
                    onChange={handleICP}
                    renderInput={params => <TextField {...params} label='ICP' />}
                  />
              </div>


          </Box>
        </Grid>

        </Grid>
      </CardContent>
    </Card>
  </Grid>

  )
}

export default FilterPresupuestoRelacionCargo

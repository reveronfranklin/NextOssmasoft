// ** React Imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';

// ** Next Imports
import { GetStaticProps } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

import toast from 'react-hot-toast';

// ** Icon Imports
//import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports

// ** Third Party Components
import axios from 'axios'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { CardStatsType } from 'src/@fake-db/types'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Table Components Imports

import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import { fetchDataPersonasDto } from 'src/store/apps/rh/thunks'
import { IPersonaDto } from 'src/interfaces/rh/i-rh-persona-dto'
import { setPersonaSeleccionado, setPersonasDtoSeleccionado } from 'src/store/apps/rh'
import { IListSimplePersonaDto } from 'src/interfaces/rh/i-list-personas'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';



interface UserStatusType {
  [key: string]: ThemeColor
}

// ** Vars


interface CellType {
  row: IPersonaDto
}

const personaStatusObj: UserStatusType = {
  Activo: 'success',
  Egresado: 'warning',
  Suspendido: 'secondary'
}



// ** renders client column
const renderClient = (row: IPersonaDto) => {
  if (row.avatar.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 3, width: 30, height: 30 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}
      >
        {getInitials(row.nombre ? row.apellido : 'John Doe')}
      </CustomAvatar>
    )
  }
}


const columns = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'nombre',
    headerName: 'User',
    renderCell: ({ row }: CellType) => {
      const { apellido } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
           {/*  <StyledLink href='/apps/rh/persona/view/overview/'>{nombre}</StyledLink> */}
            <Typography noWrap variant='caption'>
              {apellido}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: 'cedula',
    headerName: 'Cedula',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap variant='body2'>
          {row.cedula}
        </Typography>
      )
    }
  },

  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Nacionalidad',
    field: 'nacionalidad',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ textTransform: 'capitalize' }}>
          {row.nacionalidad}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'dercripcionStatus',
    field: 'descripcionStatus',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ textTransform: 'capitalize' }}>
          {row.descripcionStatus}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'dercripcionStatus',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={row.descripcionStatus}
          color={personaStatusObj[row.descripcionStatus]}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    }
  }
]

const UserList = () => {
  // ** State

  const [pageSize, setPageSize] = useState<number>(10)
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.nomina)

  const router = useRouter();

  const handlerPersona= async   (value:any)=>{
    console.log('value en handlerPersona en list',value.row)
    if(value){

      dispatch(setPersonaSeleccionado({}));

      dispatch(setPersonasDtoSeleccionado({}));

      const filter={codigoPersona:value.row.codigoPersona}
      const responseAll= await ossmmasofApi.post<IPersonaDto>('/RhPersona/GetPersona',filter);
      console.log('handlerPersona en list',responseAll.data)
      dispatch(setPersonaSeleccionado(responseAll.data));
      dispatch(setPersonasDtoSeleccionado(responseAll.data));
      router.replace("/apps/rh/persona/view/resumen/");

    }else{

      const personaDefault:IListSimplePersonaDto ={
        apellido:'',
        cedula:0,
        codigoPersona:0,
        nombre:'',
        nombreCompleto:'',
        avatar:'',
        descripcionStatus:'',
        nacionalidad:'',
        sexo:'',
        fechaNacimiento:'',
        email:'',
        paisNacimiento:'',
        edad:0,
        descripcionEstadoCivil:'',
        paisNacimientoId:0,
        estadoNacimientoId:0,
        manoHabil:'',
        status:'',
        fechaGacetaNacional:'',
        estadoCivilId:0,
        estatura:0,
        peso:0,
        identificacionId:0,
        numeroIdentificacion:0,
        numeroGacetaNacional:0,

      };

      dispatch(setPersonaSeleccionado(personaDefault));

    }



  }
  useEffect(() => {

    const getData = async () => {
      //dispatch(setTiposNominaSeleccionado(tiposNomina[0]));

      const data = await  fetchDataPersonasDto(dispatch);
      if(data?.data.isValid===false){
        toast.error(data?.data.message)
      }
      console.log('fetchDataPersonasDto en list',store.personasDto)

    };

    getData();




  }, [dispatch])


  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6}>

      <Grid item xs={12}>
        <Card>
          <CardHeader title='Personas' />

          <Divider />
       {/*    <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} /> */}
          <DataGrid
            autoHeight
            rows={store.personasDto}
            getRowId={(row) => row.codigoPersona}
            columns={columns}
            checkboxSelection
            pageSize={pageSize}
            disableSelectionOnClick
            onRowDoubleClick={(row) => handlerPersona(row)}
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
          />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData: CardStatsType = res.data

  return {
    props: {
      apiData
    }
  }
}

export default UserList

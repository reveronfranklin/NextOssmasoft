// ** React Imports
import { MouseEvent, useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { DataGrid } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'

import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Imports


// ** Custom Component Imports

import OptionsMenu from 'src/@core/components/option-menu'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { IRhAdministrativosResponseDto } from 'src/interfaces/rh/i-rh-administrativos-response-dto'




interface CellType {
  row: IRhAdministrativosResponseDto
}




const columns = [
  {
    flex: 0.2,
    field: 'codigoAdministrativo',
    minWidth: 90,
    headerName: '# ID',
  },

  {
    flex: 0.25,
    minWidth: 90,
    field: 'fechaIngreso',
    headerName: 'FechaIngreso',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>${row.fechaIngreso || 0}</Typography>
  },
  {
    flex: 0.3,
    minWidth: 125,
    field: 'descripcionTipoPago',
    headerName: 'Tipo Pago',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.descripcionTipoPago}</Typography>
  },
  {
    flex: 0.3,
    minWidth: 125,
    field: 'descripcionBanco',
    headerName: 'Banco',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.descripcionBanco}</Typography>
  },
  {
    flex: 0.3,
    minWidth: 125,
    field: 'descripcionCuenta',
    headerName: 'Descripcion Cuenta',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.descripcionCuenta}</Typography>
  },
  {
    flex: 0.3,
    minWidth: 125,
    field: 'noCuenta',
    headerName: 'No Cuenta',
    renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.noCuenta}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 130,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title='Delete Invoice'>
          <IconButton size='small'>
            <Icon icon='mdi:delete-outline' fontSize={20} />
          </IconButton>
        </Tooltip>
        <Tooltip title='View'>
          <IconButton size='small' component={Link} href={`/apps/invoice/preview/${row.codigoPersona}`}>
            <Icon icon='mdi:eye-outline' fontSize={20} />
          </IconButton>
        </Tooltip>
        <OptionsMenu
          iconProps={{ fontSize: 20 }}
          iconButtonProps={{ size: 'small' }}
          menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
          options={[
            {
              text: 'Download',
              icon: <Icon icon='mdi:download' fontSize={20} />
            },
            {
              text: 'Edit',
              icon: <Icon icon='mdi:pencil-outline' fontSize={20} />
            },
            {
              text: 'Duplicate',
              icon: <Icon icon='mdi:content-copy' fontSize={20} />
            }
          ]}
        />
      </Box>
    )
  }
]

const AdministrativosListTable = () => {
  // ** State
  const [pageSize, setPageSize] = useState<number>(7)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [data, setData] = useState<IRhAdministrativosResponseDto[]>([])
  const {personaSeleccionado} = useSelector((state: RootState) => state.nomina)

  // ** Var
  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }


  useEffect(() => {




    const getData = async () => {
      //dispatch(setTiposNominaSeleccionado(tiposNomina[0]));

      const filter={codigoPersona:personaSeleccionado.codigoPersona}
      const responseAll= await ossmmasofApi.post<IRhAdministrativosResponseDto[]>('/RhAdministrativos/GetByPersona',filter);
      console.log('AdministrativosListTable >>>>>>>>',responseAll.data)
      setData(responseAll.data);

    };

     getData();




  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaSeleccionado]);

  return (
    <Card>
      <CardHeader
        title='Administrativos...'
        sx={{ '& .MuiCardHeader-action': { m: 0 } }}
        action={
          <>
            <Button
              variant='contained'
              aria-haspopup='true'
              onClick={handleClick}
              aria-expanded={open ? 'true' : undefined}
              endIcon={<Icon icon='mdi:chevron-down' />}
              aria-controls={open ? 'user-view-overview-export' : undefined}
            >
              Export
            </Button>
            <Menu open={open} anchorEl={anchorEl} onClose={handleClose} id='user-view-overview-export'>
              <MenuItem onClick={handleClose}>PDF</MenuItem>
              <MenuItem onClick={handleClose}>XLSX</MenuItem>
              <MenuItem onClick={handleClose}>CSV</MenuItem>
            </Menu>
          </>
        }
      />
      <DataGrid
        autoHeight
        getRowId={(row) => row.codigoAdministrativo}
        columns={columns}
        rows={data}
        pageSize={pageSize}
        disableSelectionOnClick
        rowsPerPageOptions={[7, 10, 25, 50]}
        onPageSizeChange={newPageSize => setPageSize(newPageSize)}
      />
    </Card>
  )
}

export default AdministrativosListTable

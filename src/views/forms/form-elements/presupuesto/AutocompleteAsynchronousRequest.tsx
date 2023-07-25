// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'

// ** Third Party Imports
//import axios from 'axios'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { IListPreMtrDenominacionPuc } from 'src/interfaces/Presupuesto/i-pre-mtr-denominacion-puc'

//import { useDispatch } from 'react-redux'
//import { useSelector } from 'react-redux'
//import { RootState } from 'src/store'

/*interface FilmType {
  year: number
  title: string
}*/

/*const sleep = (delay = 0) => {
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
}*/

const AutocompleteAsynchronousRequest = () => {
  // ** States
  const [open, setOpen] = useState<boolean>(false)
  const [options, setOptions] = useState<IListPreMtrDenominacionPuc[]>([])

  const loading = open && options.length === 0




  //const {preMtrDenominacionPuc} = useSelector((state: RootState) => state.presupuesto)

  useEffect(() => {
    let active = true

    if (!loading) {
      return undefined
    }

    const fetchData = async () => {

      //await fetchDataPreMtrDenominacionPuc(dispatch);

      //const response = await axios.get('/forms/autocomplete')
      const responseAll= await ossmmasofApi.get<IListPreMtrDenominacionPuc[]>('/PreMtrDenominacionPuc/GetAll');

      //const top100Films = await responseAll.data


      if (active) {

        setOptions(responseAll.data)

        //setOptions(Object.keys(top100Films).map(key => top100Films[key]) as IListPreMtrDenominacionPuc[])
      }





    }
    fetchData()

    return () => {
      active = false
    }
  }, [loading])

  useEffect(() => {
    if (!open) {
      setOptions([])
    }
  }, [open])

  return (
    <Autocomplete
      sx={{ width: 350 }}
      open={open}
      options={options}
      loading={loading}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      id='autocomplete-asynchronous-request'
      getOptionLabel={option => option.dercripcion
      }
      isOptionEqualToValue={(option, value) => option.dercripcion === value.dercripcion}
      renderInput={params => (
        <TextField
          {...params}
          label='Asynchronous'
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? <CircularProgress color='inherit' size={20} /> : null}
                {params.InputProps.endAdornment}
              </Fragment>
            )
          }}
        />
      )}
    />
  )
}

export default AutocompleteAsynchronousRequest

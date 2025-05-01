import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Grid, FormControl } from '@mui/material';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import DatePicker from 'react-datepicker';
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput';
import dayjs from 'dayjs';
import { getDateByObject } from 'src/utilities/ge-date-by-object'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { FechaPagoDto, LoteFilterFechaPagoDto } from '../../interfaces';
import { setBatchPaymentDate } from 'src/store/apps/pagos/lotes';

const FilterDate = () => {
    const currentDate = dayjs(Date()).format('YYYY-MM-DD')

    const currentDateObj = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
    }

    const [fechaPagoLoteStart, setFechaPagoLoteStart]   = useState<string>(currentDate)
    const [fechaPagoLoteEnd, setFechaPagoLoteEnd]       = useState<string>(currentDate)

    const [fechaPagoLoteObjStart, setFechaPagoLoteObjStart] = useState<FechaPagoDto>(currentDateObj)
    const [fechaPagoLoteObjEnd, setFechaPagoLoteObjEnd]     = useState<FechaPagoDto>(currentDateObj)

    const dispatch = useDispatch()

    const handleFechaLotePagoStart = (date: Date | null) => {
        if (date && dayjs(date).isValid()) {
            const fechaPagoLoteStart         = dayjs(date).format('YYYY-MM-DD')
            const fechaPagoLotePagoObjStart  = fechaToFechaObj(date)

            setFechaPagoLoteObjStart(fechaPagoLotePagoObjStart)
            setFechaPagoLoteStart(fechaPagoLoteStart)
        }
    }

    const handleFechaLotePagoEnd = (date: Date | null) => {
        if (date && dayjs(date).isValid()) {
            const fechaPagoLotePagoObjEnd  = fechaToFechaObj(date)
            const fechaPagoLoteEnd         = dayjs(date).format('YYYY-MM-DD')

            setFechaPagoLoteObjEnd(fechaPagoLotePagoObjEnd)
            setFechaPagoLoteEnd(fechaPagoLoteEnd)
        }
    }

    useEffect(() => {
        const batchPaymentDate: LoteFilterFechaPagoDto = {
            start: fechaPagoLoteStart,
            end: fechaPagoLoteEnd
        }

        dispatch(setBatchPaymentDate(batchPaymentDate))
    }, [ fechaPagoLoteStart, fechaPagoLoteEnd ])

    return (
        <Grid  container spacing={12} justifyContent="flex">
            <Grid item sm={6} xs={6} sx={{ padding: '5px' }}>
                <FormControl fullWidth>
                    <DatePickerWrapper>
                        <DatePicker
                            selected={fechaPagoLoteObjStart ? getDateByObject(fechaPagoLoteObjStart) : null}
                            id='date-time-picker-desde'
                            dateFormat='dd/MM/yyyy'
                            onChange={(date: Date) => { handleFechaLotePagoStart(date) }}
                            placeholderText='Fecha desde'
                            customInput={<CustomInput label='Fecha desde' />}
                            required
                            autoFocus
                        />
                    </DatePickerWrapper>
                </FormControl>
            </Grid>
            <Grid item sm={6} xs={6} sx={{ padding: '5px' }}>
                <FormControl fullWidth>
                    <DatePickerWrapper>
                        <DatePicker
                            selected={fechaPagoLoteObjEnd ? getDateByObject(fechaPagoLoteObjEnd) : null}
                            id='date-time-picker-hasta'
                            dateFormat='dd/MM/yyyy'
                            onChange={(date: Date) => { handleFechaLotePagoEnd(date) }}
                            placeholderText='Fecha hasta'
                            customInput={<CustomInput label='Fecha hasta' />}
                            required
                        />
                    </DatePickerWrapper>
                </FormControl>
            </Grid>
        </Grid>
    )
}

export default FilterDate

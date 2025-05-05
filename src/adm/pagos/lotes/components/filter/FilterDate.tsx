import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import DatePicker from 'react-datepicker';
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput';
import dayjs from 'dayjs';
import { RootState } from 'src/store';
import { getDateByObject } from 'src/utilities/ge-date-by-object'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { FechaPagoDto, LoteFilterFechaPagoDto } from '../../interfaces';
import { setBatchPaymentDate } from 'src/store/apps/pagos/lotes';
import generateDateRangesByYear from '../../helpers/dateRangesYear'

const FilterDate = () => {
    const currentDate       = dayjs(Date()).format('YYYY-MM-DD')
    const currentYear       = currentDate.split('-')[0]
    const dateRangesByYear  = generateDateRangesByYear(currentYear)

    const [fechaPagoLoteStart, setFechaPagoLoteStart]   = useState<string>(dateRangesByYear.start.date)
    const [fechaPagoLoteEnd, setFechaPagoLoteEnd]       = useState<string>(dateRangesByYear.end.date)

    const [fechaPagoLoteObjStart, setFechaPagoLoteObjStart] = useState<FechaPagoDto>(dateRangesByYear.start.dateObject)
    const [fechaPagoLoteObjEnd, setFechaPagoLoteObjEnd]     = useState<FechaPagoDto>(dateRangesByYear.end.dateObject)

    const dispatch = useDispatch()

    const presupuestoSeleccionado = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

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
        if (presupuestoSeleccionado?.codigoPresupuesto > 0) {
            const selectedYear      = presupuestoSeleccionado.ano
            const dateRangesByYear  = generateDateRangesByYear(selectedYear)

            if (dateRangesByYear?.start && dateRangesByYear?.end) {
                setFechaPagoLoteObjStart(dateRangesByYear.start.dateObject)
                setFechaPagoLoteStart(dateRangesByYear.start.date)

                setFechaPagoLoteObjEnd(dateRangesByYear.end.dateObject)
                setFechaPagoLoteEnd(dateRangesByYear.end.date)
            }
        }
    }, [ presupuestoSeleccionado.codigoPresupuesto ])

    useEffect(() => {
        const batchPaymentDate: LoteFilterFechaPagoDto = {
            start: fechaPagoLoteStart,
            end: fechaPagoLoteEnd
        }

        dispatch(setBatchPaymentDate(batchPaymentDate))
    }, [ fechaPagoLoteStart, fechaPagoLoteEnd ])

    return (
        <Grid container spacing={3} justifyContent="flex" flexWrap="wrap" paddingTop={4}>
            <Grid item sm={6} xs={6}>
                <DatePickerWrapper>
                    <DatePicker
                        selected={fechaPagoLoteObjStart ? getDateByObject(fechaPagoLoteObjStart) : null}
                        id='date-time-picker-desde'
                        dateFormat='dd/MM/yyyy'
                        onChange={(date: Date) => { handleFechaLotePagoStart(date) }}
                        placeholderText='Fecha desde'
                        customInput={<CustomInput label='Fecha desde' />}
                        minDate={dateRangesByYear.start.dateObject ? getDateByObject(dateRangesByYear.start.dateObject) : null}
                        maxDate={dateRangesByYear.end.dateObject ? getDateByObject(dateRangesByYear.end.dateObject) : null}
                    />
                </DatePickerWrapper>
            </Grid>
            <Grid item sm={6} xs={6}>
                <DatePickerWrapper>
                    <DatePicker
                        selected={fechaPagoLoteObjEnd ? getDateByObject(fechaPagoLoteObjEnd) : null}
                        id='date-time-picker-hasta'
                        dateFormat='dd/MM/yyyy'
                        onChange={(date: Date) => { handleFechaLotePagoEnd(date) }}
                        placeholderText='Fecha hasta'
                        customInput={<CustomInput label='Fecha hasta' />}
                        minDate={dateRangesByYear.start.dateObject ? getDateByObject(dateRangesByYear.start.dateObject) : null}
                        maxDate={dateRangesByYear.end.dateObject ? getDateByObject(dateRangesByYear.end.dateObject) : null}
                    />
                </DatePickerWrapper>
            </Grid>
        </Grid>
    )
}

export default FilterDate
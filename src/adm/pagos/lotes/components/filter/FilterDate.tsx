import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import DatePicker from 'react-datepicker';
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput';
import dayjs from 'dayjs';
import { RootState } from 'src/store';
import { getDateByObject } from 'src/utilities/ge-date-by-object';
import { setBatchPaymentDate } from 'src/store/apps/pagos/lotes';
import { FechaPagoDto, LoteFilterFechaPagoDto } from '../../interfaces';
import generateDateRangesByYear from '../../helpers/dateRangesYear'

const StyledCustomInput = styled(CustomInput)(() => ({
    width: "100%",
    "& .MuiInputBase-root": {
        width: "100%"
    },
    "& .MuiInputBase-input": {
        width: "100%"
    }
}))

const FilterDate = () => {
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
    const [startDate, endDate]      = dateRange

    const [minDate, setMinDate] = useState<FechaPagoDto>()
    const [maxDate, setMaxDate] = useState<FechaPagoDto>()

    const dispatch                  = useDispatch()
    const presupuestoSeleccionado   = useSelector((state: RootState) => state.presupuesto.listpresupuestoDtoSeleccionado)

    useEffect(() => {
        if (presupuestoSeleccionado?.codigoPresupuesto > 0) {
            const selectedYear      = presupuestoSeleccionado.ano
            const dateRangesByYear  = generateDateRangesByYear(selectedYear)

            if (dateRangesByYear?.start && dateRangesByYear?.end) {
                setDateRange([dateRangesByYear.start.date, dateRangesByYear.end.date])
                setMinDate(dateRangesByYear.start.dateObject)
                setMaxDate(dateRangesByYear.end.dateObject)
            }
        }
    }, [ presupuestoSeleccionado.codigoPresupuesto ])

    useEffect(() => {
        const batchPaymentDate = {} as LoteFilterFechaPagoDto

        if (startDate && dayjs(startDate).isValid()) {
            batchPaymentDate.start = dayjs(startDate).format('YYYY-MM-DD')
        }

        if (endDate && dayjs(endDate).isValid()) {
            batchPaymentDate.end = dayjs(endDate).format('YYYY-MM-DD')
        }

        dispatch(setBatchPaymentDate(batchPaymentDate))
    }, [ startDate, endDate ])

    return (
        <Grid container spacing={3} paddingTop={4}>
            <Grid item sm={12} xs={12}>
                <DatePickerWrapper>
                    <DatePicker
                        id='date-time-picker-start-end'
                        dateFormat='dd/MM/yyyy'
                        placeholderText='Fecha Desde - Fecha Hasta'
                        customInput={<StyledCustomInput label='Fecha Desde - Fecha Hasta' />}
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        isClearable={true}
                        minDate={minDate ? getDateByObject(minDate) : null}
                        maxDate={maxDate ? getDateByObject(maxDate) : null}
                        onChange={(update) => {
                            setDateRange(update)
                        }}
                    />
                </DatePickerWrapper>
            </Grid>
        </Grid>
    )
}

export default FilterDate
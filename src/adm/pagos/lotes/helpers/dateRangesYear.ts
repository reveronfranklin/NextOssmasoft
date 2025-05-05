import moment from 'moment';
import { FechaPagoDto } from '../interfaces';

const generateDateRangesByYear = (year: string | number) => {
    const currentDate   = moment().format('YYYY-MM-DD')
    const currentYear   = currentDate.split('-')[0]
    let endDateString   = `${year}-12-31`

    if (currentYear == year) {
        endDateString = currentDate
    }

    const startDate = moment(`${year}-01-01`).format('YYYY-MM-DD')
    const endDate   = moment(endDateString).format('YYYY-MM-DD')

    const startDateObject: FechaPagoDto = {
        year: moment(startDate).year(),
        month: moment(startDate).month() + 1, // Los meses en Moment.js son 0-indexed
        day: moment(startDate).date()
    }

    const endDateObject: FechaPagoDto = {
        year: moment(endDate).year(),
        month: moment(endDate).month() + 1,
        day: moment(endDate).date()
    }

    const batchPaymentDate = {
        start: {
            date: startDate,
            dateObject: startDateObject
        },
        end: {
            date: endDate,
            dateObject: endDateObject
        }
    }

    return batchPaymentDate
}

export default generateDateRangesByYear
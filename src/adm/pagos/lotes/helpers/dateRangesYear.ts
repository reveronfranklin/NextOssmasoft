import moment from 'moment';
import { FechaPagoDto } from '../interfaces';

const generateDateRangesByYear = (year: string | number) => {
    const currentYear = moment().format('YYYY')
    let endDateString = moment(`${year}-12-31`)

    if (currentYear == year) {
        endDateString = moment()
    }

    const startDate = moment(`${year}-01-01`)
    const endDate   = endDateString

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
            date: startDate.toDate(),
            dateObject: startDateObject
        },
        end: {
            date: endDate.toDate(),
            dateObject: endDateObject
        }
    }

    return batchPaymentDate
}

export default generateDateRangesByYear
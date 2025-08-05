import { UrlServices } from '../../../enums/urlServices.enum'

export const reportOptions = [
  {
    label: 'Pago Electrónico',
    value: UrlServices.GET_REPORT_BY_ELECTRONIC,
    icon: 'mdi:file-document-outline',
    color: 'primary.main'
  },
  {
    label: 'Pago Electrónico a terceros',
    value: UrlServices.GET_REPORT_BY_ELECTRONIC_THIRD_PARTIES,
    icon: 'mdi:file-document-outline',
    color: 'primary.main'
  },
  {
    label: 'Nota de débito a terceros',
    value: UrlServices.GET_REPORT_BY_DEBIT_NOTE_THIRD_PARTIES,
    icon: 'mdi:file-document-outline',
    color: 'primary.main'
  }
]
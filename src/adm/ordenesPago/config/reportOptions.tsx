import { UrlServices } from '../enums/UrlServices.enum'

export const reportOptions = [
  {
    label: 'Orden de Pago',
    value: UrlServices.GETREPORTBYORDENPAGO,
    icon: 'mdi:file-document-outline',
    color: 'primary.main',
  },
  {
    label: 'Retenciones ISLR',
    value: UrlServices.GETREPORTBYRETENCIONES,
    icon: 'mdi:file-document-outline',
    color: 'primary.main',
  },
  {
    label: 'Retenciones IVA',
    value: UrlServices.GETREPORTBYCOMPROBANTE,
    icon: 'mdi:file-document-outline',
    color: 'primary.main',
  },
  {
    label: 'Timbre Fiscal',
    value: UrlServices.TIMBREFISCAL,
    icon: 'mdi:file-document-outline',
    color: 'primary.main',
  }
]
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { CntComprobantePrintDto } from '../interfaces/CntDtos'

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value ?? 0)

const formatDate = (value?: string) => (value ? value.slice(0, 10) : '')

const normalizeFileToken = (value?: string) =>
  (value || 'SinNumero')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export const getCntComprobantePdfName = (data?: CntComprobantePrintDto | null) =>
  `Comprobante-${normalizeFileToken(data?.encabezado?.numeroComprobante)}.pdf`

export const buildCntComprobantePdf = (data: CntComprobantePrintDto) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' })
  const encabezado = data.encabezado
  const detalles = data.detalles ?? []
  const totalDebe = detalles.reduce((sum, item) => sum + Number(item.debe || 0), 0)
  const totalHaber = detalles.reduce((sum, item) => sum + Number(item.haber || 0), 0)
  const diferencia = totalDebe - totalHaber

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text('Comprobante contable', 40, 42)

  doc.setFontSize(12)
  doc.text(encabezado.numeroComprobante || '-', 40, 62)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`Fecha: ${formatDate(encabezado.fechaComprobante)}`, 390, 42)
  doc.text(`Periodo: ${encabezado.periodo || '-'}`, 390, 57)
  doc.text(`Empresa: ${encabezado.codigoEmpresa || '-'}`, 390, 72)

  doc.text(`Tipo: ${encabezado.tipoComprobante || '-'}`, 40, 96)
  doc.text(`Origen: ${encabezado.origen || '-'}`, 250, 96)
  doc.text(`Observacion: ${encabezado.observacion || '-'}`, 40, 114, { maxWidth: 520 })

  autoTable(doc, {
    startY: 140,
    head: [['Mayor', 'Auxiliar', 'Descripcion', 'Referencia', 'Debe', 'Haber']],
    body: detalles.map(item => [
      item.mayor || '',
      item.auxiliar || '',
      item.descripcion || '',
      [item.referencia1, item.referencia2, item.referencia3].filter(Boolean).join(' / '),
      formatMoney(item.debe),
      formatMoney(item.haber)
    ]),
    foot: [
      ['', '', '', 'Totales', formatMoney(totalDebe), formatMoney(totalHaber)],
      ['', '', '', 'Diferencia', '', formatMoney(diferencia)]
    ],
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 4,
      overflow: 'linebreak',
      valign: 'top'
    },
    headStyles: {
      fillColor: [68, 68, 84],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    footStyles: {
      fillColor: [245, 245, 247],
      textColor: [40, 40, 48],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 110 },
      2: { cellWidth: 125 },
      3: { cellWidth: 100 },
      4: { cellWidth: 60, halign: 'right' },
      5: { cellWidth: 60, halign: 'right' }
    },
    margin: { left: 40, right: 40 },
    didDrawPage: hookData => {
      const pageCount = doc.getNumberOfPages()
      doc.setFontSize(8)
      doc.setTextColor(110)
      doc.text(`Pagina ${hookData.pageNumber} de ${pageCount}`, 500, 760)
    }
  })

  return doc
}

export const createCntComprobantePdfUrl = (data: CntComprobantePrintDto) => {
  const doc = buildCntComprobantePdf(data)

  return URL.createObjectURL(doc.output('blob'))
}

export const downloadCntComprobantePdf = (data: CntComprobantePrintDto) => {
  const doc = buildCntComprobantePdf(data)

  doc.save(getCntComprobantePdfName(data))
}

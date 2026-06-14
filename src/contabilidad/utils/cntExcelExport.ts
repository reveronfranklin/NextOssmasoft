import * as XLSX from 'xlsx'

const normalizeFileToken = (value: string) =>
  value
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

export const exportCntRowsToExcel = <T extends Record<string, string | number | boolean | null | undefined>>(
  rows: T[],
  sheetName: string,
  fileName: string
) => {
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(rows)

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31))
  XLSX.writeFile(workbook, `${normalizeFileToken(fileName)}.xlsx`)
}

export const readCntExcelRows = async <T extends Record<string, unknown>>(file: File): Promise<T[]> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = event => {
      try {
        const data = event.target?.result
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json<T>(worksheet, { defval: '' })

        resolve(rows)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(file)
  })

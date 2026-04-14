/**
 * Formatea la identificación con separador de miles.
 * Ejemplo: "V-12345678" -> "V-12.345.678"
 */
export const formatCedula = (nacionalidad: string = 'V', cedula: string | number = ''): string => {
  if (!cedula) return `${nacionalidad}-`

  // Convertimos a string y quitamos cualquier caracter que no sea número
  const numberStr = String(cedula).replace(/\D/g, '')

  // Aplicamos el formato de miles (puntos)
  const formattedNumber = numberStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  return `${nacionalidad}-${formattedNumber}`
}
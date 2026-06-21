export const getShortName = (firstName?: string, lastName?: string): string => {
  const namePart = firstName?.trim().split(/\s+/)[0] || ""
  const lastNamePart = lastName?.trim().split(/\s+/)[0] || ""

  return `${namePart} ${lastNamePart}`.trim()
}
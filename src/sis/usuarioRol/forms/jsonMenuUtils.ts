import { OssUsuarioRolMenuItem } from '../interfaces/OssUsuarioRolDtos'

export const defaultJsonMenuText = '[]'

export const stringifyJsonMenu = (jsonMenu: OssUsuarioRolMenuItem[] | undefined) =>
  JSON.stringify(Array.isArray(jsonMenu) ? jsonMenu : [], null, 2)

export const parseJsonMenu = (value: string): { menu: OssUsuarioRolMenuItem[]; message: string } => {
  try {
    const parsed = JSON.parse(value || defaultJsonMenuText)

    if (!Array.isArray(parsed)) {
      return {
        menu: [],
        message: 'El JSON del menu debe ser un arreglo.'
      }
    }

    return {
      menu: parsed,
      message: ''
    }
  } catch (error: any) {
    return {
      menu: [],
      message: `JSON invalido: ${error.message}`
    }
  }
}

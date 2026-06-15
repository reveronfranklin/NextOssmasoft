// ** React Imports
import { ReactNode, useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Types
import { NavGroup, NavLink } from 'src/@core/layouts/types'

interface Props {
  navGroup?: NavGroup
  children: ReactNode
}

const CanViewNavGroup = (props: Props) => {
  // ** Props
  const { children, navGroup } = props

  // ** Hook
  const ability = useContext(AbilityContext)

  const canViewMenuItem = (item: NavGroup | NavLink): boolean => {
    if ('children' in item && item.children) {
      return canViewMenuGroup(item)
    }

    if (!(item.action && item.subject)) {
      return true
    }

    return ability ? ability.can(item.action, item.subject) : false
  }

  const canViewMenuGroup = (item: NavGroup): boolean => {
    const hasAnyVisibleChild = item.children?.some(child => canViewMenuItem(child)) ?? false

    if (!(item.action && item.subject)) {
      return hasAnyVisibleChild
    }

    return ability && ability.can(item.action, item.subject) && hasAnyVisibleChild
  }

  return navGroup && canViewMenuGroup(navGroup) ? <>{children}</> : null
}

export default CanViewNavGroup

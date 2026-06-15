// ** React Imports
import { ReactNode } from 'react'

// ** Types
import { NavGroup } from 'src/@core/layouts/types'

interface Props {
  navGroup?: NavGroup
  children: ReactNode
}

const CanViewNavGroup = (props: Props) => {
  // ** Props
  const { children } = props

  return <>{children}</>
}

export default CanViewNavGroup

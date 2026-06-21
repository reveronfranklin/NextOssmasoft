import { useQuery } from '@tanstack/react-query'
import {
  checkCntPermission,
  CNT_PERMISSION_CATALOG_ADMIN,
  CNT_PERMISSION_CATALOG_VIEW,
  CNT_PERMISSIONS_QUERY_KEY
} from '../services/cntService'
import { useCntCurrentUserId } from './useCntCurrentUserId'

export const useCntCatalogPermissions = () => {
  const currentUserId = useCntCurrentUserId()

  const viewQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, CNT_PERMISSION_CATALOG_VIEW, currentUserId],
    queryFn: () => checkCntPermission({ usuarioId: currentUserId, permission: CNT_PERMISSION_CATALOG_VIEW }),
    enabled: currentUserId > 0,
    retry: 1
  })

  const adminQuery = useQuery({
    queryKey: [CNT_PERMISSIONS_QUERY_KEY, CNT_PERMISSION_CATALOG_ADMIN, currentUserId],
    queryFn: async () => {
      try {
        return await checkCntPermission({ usuarioId: currentUserId, permission: CNT_PERMISSION_CATALOG_ADMIN })
      } catch {
        return { hasPermission: false, permission: CNT_PERMISSION_CATALOG_ADMIN }
      }
    },
    enabled: currentUserId > 0,
    retry: 1
  })

  return {
    currentUserId,
    canView: viewQuery.data?.hasPermission === true || adminQuery.data?.hasPermission === true,
    canAdmin: adminQuery.data?.hasPermission === true,
    isLoading: viewQuery.isLoading || adminQuery.isLoading,
    viewMessage: viewQuery.isError ? CNT_PERMISSION_CATALOG_VIEW : '',
    adminPermission: CNT_PERMISSION_CATALOG_ADMIN
  }
}

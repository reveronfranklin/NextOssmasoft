import { useMemo, useState } from 'react'
import { Box, Button, Card, CardActions, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import Spinner from 'src/@core/components/spinner'
import { useCntCatalogPermissions } from '../../hooks/useCntCatalogPermissions'
import { exportCntRowsToExcel } from '../../utils/cntExcelExport'
import {
  CNT_AUXILIARES_ADMIN_QUERY_KEY,
  CNT_AUXILIARES_PUC_QUERY_KEY,
  CNT_BALANCES_QUERY_KEY,
  CNT_MAYORES_ADMIN_QUERY_KEY,
  CNT_RUBROS_QUERY_KEY,
  cloneCntPlanCuentas,
  fetchCntAuxiliaresAdmin,
  fetchCntAuxiliaresPuc,
  fetchCntBalances,
  fetchCntMayoresAdmin,
  fetchCntRubros
} from '../../services/cntService'

type PlanNodeType = 'Rubro' | 'Balance' | 'Mayor' | 'Auxiliar' | 'PUC'

interface PlanNode {
  id: string
  type: PlanNodeType
  code: string
  title: string
  description?: string
  children: PlanNode[]
}

interface VisiblePlanNode {
  node: PlanNode
  level: number
}

const nodeMatches = (node: PlanNode, searchText: string): boolean => {
  if (!searchText.trim()) return true

  const text = `${node.type} ${node.code} ${node.title} ${node.description ?? ''}`.toLowerCase()

  return text.includes(searchText.toLowerCase())
}

const filterNodes = (nodes: PlanNode[], searchText: string): PlanNode[] =>
  nodes
    .map(node => {
      const children = filterNodes(node.children, searchText)

      if (nodeMatches(node, searchText) || children.length > 0) {
        return { ...node, children }
      }

      return null
    })
    .filter((node): node is PlanNode => node !== null)

const flattenNodes = (nodes: PlanNode[]): PlanNode[] => nodes.flatMap(node => [node, ...flattenNodes(node.children)])

const getVisibleNodes = (nodes: PlanNode[], expandedIds: Set<string>, level = 0): VisiblePlanNode[] =>
  nodes.flatMap(node => [
    { node, level },
    ...(expandedIds.has(node.id) ? getVisibleNodes(node.children, expandedIds, level + 1) : [])
  ])

const buildAccountNumber = (segments: Array<string | undefined>) => segments.filter(segment => !!segment?.trim()).join('.')

const SEARCH_AUTO_EXPAND_LIMIT = 500

const appendToMap = <T,>(map: Map<number, T[]>, key: number, item: T) => {
  const items = map.get(key)

  if (items) {
    items.push(item)

    return
  }

  map.set(key, [item])
}

const NodeLabel = ({ node }: { node: PlanNode }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0, flex: 1 }}>
    <Chip size='small' label={node.type} sx={{ minWidth: 72 }} />
    <Typography variant='body2' sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
      {node.code || '-'}
    </Typography>
    <Typography variant='body2' sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {node.title}
    </Typography>
  </Box>
)

const CntPlanCuentasCatalog = () => {
  const { currentUserId, canView, canAdmin, isLoading: permissionLoading } = useCntCatalogPermissions()
  const [searchText, setSearchText] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const [isCloneOpen, setIsCloneOpen] = useState(false)
  const [cloneEmpresaOrigen, setCloneEmpresaOrigen] = useState('')

  const rubrosQuery = useQuery({
    queryKey: [CNT_RUBROS_QUERY_KEY, currentUserId, 'plan-cuentas'],
    queryFn: () => fetchCntRubros(currentUserId, ''),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const balancesQuery = useQuery({
    queryKey: [CNT_BALANCES_QUERY_KEY, currentUserId, 'plan-cuentas'],
    queryFn: () => fetchCntBalances(currentUserId, undefined, ''),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const mayoresQuery = useQuery({
    queryKey: [CNT_MAYORES_ADMIN_QUERY_KEY, currentUserId, 'plan-cuentas'],
    queryFn: () => fetchCntMayoresAdmin(currentUserId, undefined, ''),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const auxiliaresQuery = useQuery({
    queryKey: [CNT_AUXILIARES_ADMIN_QUERY_KEY, currentUserId, 'plan-cuentas'],
    queryFn: () => fetchCntAuxiliaresAdmin(currentUserId, undefined, false, ''),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const pucQuery = useQuery({
    queryKey: [CNT_AUXILIARES_PUC_QUERY_KEY, currentUserId, 'plan-cuentas'],
    queryFn: () => fetchCntAuxiliaresPuc(currentUserId, undefined, undefined, ''),
    enabled: currentUserId > 0 && canView,
    retry: 1
  })

  const nodes = useMemo<PlanNode[]>(() => {
    const balances = balancesQuery.data ?? []
    const mayores = mayoresQuery.data ?? []
    const auxiliares = auxiliaresQuery.data ?? []
    const pucItems = pucQuery.data ?? []

    const balancesByRubro = new Map<number, typeof balances>()
    const mayoresByBalance = new Map<number, typeof mayores>()
    const auxiliaresByMayor = new Map<number, typeof auxiliares>()
    const pucByAuxiliar = new Map<number, typeof pucItems>()

    balances.forEach(balance => {
      const key = balance.codigoRubro ?? 0
      appendToMap(balancesByRubro, key, balance)
    })

    mayores.forEach(mayor => {
      const key = mayor.codigoBalance ?? 0
      appendToMap(mayoresByBalance, key, mayor)
    })

    auxiliares.forEach(auxiliar => {
      appendToMap(auxiliaresByMayor, auxiliar.codigoMayor, auxiliar)
    })

    pucItems.forEach(puc => {
      appendToMap(pucByAuxiliar, puc.codigoAuxiliar, puc)
    })

    const buildPucNodes = (codigoAuxiliar: number): PlanNode[] =>
      (pucByAuxiliar.get(codigoAuxiliar) ?? []).map(puc => ({
        id: `puc-${puc.codigoAuxiliarPuc}`,
        type: 'PUC',
        code: String(puc.codigoPuc),
        title: puc.tipoDocumentoId || 'Sin tipo documento',
        description: puc.auxiliar,
        children: []
      }))

    const buildAuxiliarNodes = (codigoMayor: number): PlanNode[] =>
      (auxiliaresByMayor.get(codigoMayor) ?? []).map(auxiliar => ({
        id: `aux-${auxiliar.codigoAuxiliar}`,
        type: 'Auxiliar',
        code: buildAccountNumber([
          auxiliar.segmento1,
          auxiliar.segmento2,
          auxiliar.segmento3,
          auxiliar.segmento4,
          auxiliar.segmento5,
          auxiliar.segmento6,
          auxiliar.segmento7,
          auxiliar.segmento8,
          auxiliar.segmento9,
          auxiliar.segmento10
        ]),
        title: auxiliar.denominacion,
        description: auxiliar.descripcion,
        children: buildPucNodes(auxiliar.codigoAuxiliar)
      }))

    const buildMayorNodes = (codigoBalance: number): PlanNode[] =>
      (mayoresByBalance.get(codigoBalance) ?? []).map(mayor => ({
        id: `may-${mayor.codigoMayor}`,
        type: 'Mayor',
        code: mayor.numeroMayor,
        title: mayor.denominacion,
        description: mayor.descripcion,
        children: buildAuxiliarNodes(mayor.codigoMayor)
      }))

    const buildBalanceNodes = (codigoRubro: number): PlanNode[] =>
      (balancesByRubro.get(codigoRubro) ?? []).map(balance => ({
        id: `bal-${balance.codigoBalance}`,
        type: 'Balance',
        code: balance.numeroBalance,
        title: balance.denominacion,
        description: balance.descripcion,
        children: buildMayorNodes(balance.codigoBalance)
      }))

    const rubros = (rubrosQuery.data ?? []).map(rubro => ({
      id: `rub-${rubro.codigoRubro}`,
      type: 'Rubro' as const,
      code: rubro.numeroRubro,
      title: rubro.denominacion,
      description: rubro.descripcion,
      children: buildBalanceNodes(rubro.codigoRubro)
    }))

    const sinRubro = buildBalanceNodes(0)

    return sinRubro.length > 0
      ? [
          ...rubros,
          {
            id: 'rub-0',
            type: 'Rubro' as const,
            code: '',
            title: 'Sin rubro',
            children: sinRubro
          }
        ]
      : rubros
  }, [auxiliaresQuery.data, balancesQuery.data, mayoresQuery.data, pucQuery.data, rubrosQuery.data])

  const hasSearch = searchText.trim().length > 0
  const filteredNodes = useMemo(() => (hasSearch ? filterNodes(nodes, searchText) : nodes), [hasSearch, nodes, searchText])
  const flatNodes = useMemo(() => flattenNodes(nodes), [nodes])
  const filteredFlatNodes = useMemo(() => (hasSearch ? flattenNodes(filteredNodes) : flatNodes), [filteredNodes, flatNodes, hasSearch])
  const searchExpandedIds = useMemo(
    () =>
      hasSearch && filteredFlatNodes.length <= SEARCH_AUTO_EXPAND_LIMIT
        ? filteredFlatNodes.filter(node => node.children.length > 0).map(node => node.id)
        : [],
    [filteredFlatNodes, hasSearch]
  )
  const activeExpandedIds = hasSearch && searchExpandedIds.length > 0 ? searchExpandedIds : expandedIds
  const activeExpandedSet = useMemo(() => new Set(activeExpandedIds), [activeExpandedIds])
  const visibleNodes = useMemo(() => getVisibleNodes(filteredNodes, activeExpandedSet), [activeExpandedSet, filteredNodes])
  const selectedNode = flatNodes.find(node => node.id === selectedId)
  const isLoading = permissionLoading || rubrosQuery.isLoading || balancesQuery.isLoading || mayoresQuery.isLoading || auxiliaresQuery.isLoading || pucQuery.isLoading

  const totals = {
    rubros: rubrosQuery.data?.length ?? 0,
    balances: balancesQuery.data?.length ?? 0,
    mayores: mayoresQuery.data?.length ?? 0,
    auxiliares: auxiliaresQuery.data?.length ?? 0,
    puc: pucQuery.data?.length ?? 0
  }

  const refresh = () => {
    rubrosQuery.refetch()
    balancesQuery.refetch()
    mayoresQuery.refetch()
    auxiliaresQuery.refetch()
    pucQuery.refetch()
  }

  const cloneMutation = useMutation({
    mutationFn: () => cloneCntPlanCuentas({ usuarioId: currentUserId, empresaOrigen: Number(cloneEmpresaOrigen) }),
    onSuccess: response => {
      if (response.isValid === false) {
        toast.error(response.message)

        return
      }

      const data = response.data
      toast.success(
        `Clonacion completada: ${data?.rubros ?? 0} rubros, ${data?.balances ?? 0} balances, ${data?.mayores ?? 0} mayores, ${data?.auxiliares ?? 0} auxiliares`
      )
      setIsCloneOpen(false)
      setCloneEmpresaOrigen('')
      refresh()
    },
    onError: error => toast.error((error as Error).message)
  })

  const handleExportExcel = () => {
    const rows = filteredFlatNodes.map(node => ({
      Tipo: node.type,
      Codigo: node.code,
      Denominacion: node.title,
      Descripcion: node.description ?? '',
      Hijos: node.children.length
    }))

    exportCntRowsToExcel(rows, 'Plan de cuentas', 'CNT-Plan-Cuentas')
  }

  const toggleNode = (nodeId: string) =>
    setExpandedIds(current => (current.includes(nodeId) ? current.filter(item => item !== nodeId) : [...current, nodeId]))

  const renderVisibleNode = ({ node, level }: VisiblePlanNode) => {
    const hasChildren = node.children.length > 0
    const isExpanded = activeExpandedSet.has(node.id)
    const isSelected = selectedId === node.id

    return (
      <Box
        key={node.id}
        onClick={() => setSelectedId(node.id)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          minWidth: 0,
          py: 0.5,
          pr: 2,
          pl: 1 + level * 3,
          borderRadius: 1,
          cursor: 'pointer',
          bgcolor: isSelected ? 'action.selected' : 'transparent',
          '&:hover': { bgcolor: 'action.hover' }
        }}
      >
        {hasChildren ? (
          <IconButton
            size='small'
            onClick={event => {
              event.stopPropagation()
              toggleNode(node.id)
            }}
            sx={{ mr: 1 }}
          >
            <Icon icon={isExpanded ? 'mdi:chevron-down' : 'mdi:chevron-right'} fontSize={20} />
          </IconButton>
        ) : (
          <Box sx={{ width: 34, mr: 1 }} />
        )}
        <NodeLabel node={node} />
      </Box>
    )
  }

  if (permissionLoading) return <Spinner />

  if (!canView) {
    return <Typography color='error'>El usuario no tiene el permiso requerido: contabilidad.catalogos.ver.</Typography>
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Grid container spacing={4}>
          {[
            ['Rubros', totals.rubros],
            ['Balances', totals.balances],
            ['Mayores', totals.mayores],
            ['Auxiliares', totals.auxiliares],
            ['PUC', totals.puc]
          ].map(([label, value]) => (
            <Grid item xs={12} sm={6} md={2.4} key={label}>
              <Card>
                <CardContent>
                  <Typography variant='body2' color='text.secondary'>
                    {label}
                  </Typography>
                  <Typography variant='h4'>{value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card>
          <CardActions sx={{ justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title='Refrescar'>
                <IconButton color='primary' onClick={refresh}>
                  <Icon icon='mdi:refresh' />
                </IconButton>
              </Tooltip>
              <Tooltip title='Exportar Excel'>
                <span>
                  <IconButton color='primary' disabled={filteredFlatNodes.length === 0} onClick={handleExportExcel}>
                    <Icon icon='mdi:file-excel-outline' />
                  </IconButton>
                </span>
              </Tooltip>
              {canAdmin && (
                <Tooltip title='Clonar desde empresa'>
                  <IconButton color='primary' onClick={() => setIsCloneOpen(true)}>
                    <Icon icon='mdi:content-copy' />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <TextField size='small' label='Buscar' value={searchText} onChange={event => setSearchText(event.target.value)} sx={{ minWidth: 280 }} />
          </CardActions>
          <CardContent sx={{ pt: 0 }}>
            {isLoading ? (
              <Spinner />
            ) : (
              <Box sx={{ minHeight: 420, maxHeight: 'calc(100vh - 360px)', overflow: 'auto' }}>
                {hasSearch && filteredFlatNodes.length > SEARCH_AUTO_EXPAND_LIMIT && (
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                    Hay {filteredFlatNodes.length} coincidencias. Refina la busqueda para expandir automaticamente.
                  </Typography>
                )}
                {visibleNodes.map(renderVisibleNode)}
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 4 }}>
              Detalle
            </Typography>
            {selectedNode ? (
              <Stack spacing={3}>
                <Box>
                  <Typography variant='caption' color='text.secondary'>
                    Tipo
                  </Typography>
                  <Typography variant='body1'>{selectedNode.type}</Typography>
                </Box>
                <Box>
                  <Typography variant='caption' color='text.secondary'>
                    Codigo
                  </Typography>
                  <Typography variant='body1'>{selectedNode.code || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant='caption' color='text.secondary'>
                    Denominacion
                  </Typography>
                  <Typography variant='body1'>{selectedNode.title}</Typography>
                </Box>
                <Box>
                  <Typography variant='caption' color='text.secondary'>
                    Descripcion
                  </Typography>
                  <Typography variant='body1'>{selectedNode.description || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant='caption' color='text.secondary'>
                    Hijos
                  </Typography>
                  <Typography variant='body1'>{selectedNode.children.length}</Typography>
                </Box>
              </Stack>
            ) : (
              <Typography variant='body2' color='text.secondary'>
                Sin seleccion
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Dialog open={isCloneOpen} onClose={() => setIsCloneOpen(false)} fullWidth maxWidth='xs'>
        <DialogTitle>Clonar plan de cuentas</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            type='number'
            label='Empresa origen'
            value={cloneEmpresaOrigen}
            onChange={event => setCloneEmpresaOrigen(event.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' color='secondary' onClick={() => setIsCloneOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            disabled={!canAdmin || Number(cloneEmpresaOrigen) <= 0 || cloneMutation.isPending}
            onClick={() => {
              if (window.confirm('Clonar plan de cuentas desde la empresa indicada?')) cloneMutation.mutate()
            }}
          >
            Clonar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default CntPlanCuentasCatalog

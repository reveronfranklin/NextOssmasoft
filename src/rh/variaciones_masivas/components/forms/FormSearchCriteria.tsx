import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useQueryClient, useQuery, QueryClient } from '@tanstack/react-query';
import { CleaningServices } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Grid,
  TextField,
  Autocomplete,
  Button,
  Alert
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import BackspaceIcon from '@mui/icons-material/Backspace';
import toast from 'react-hot-toast';
import Spinner from 'src/@core/components/spinner';
import AlertMessage from 'src/views/components/alerts/AlertMessage';
import DialogConfirmation from 'src/views/components/dialogs/DialogConfirmationDynamic';
import useServiceFixedParams from '../../services/useServiceFixedParams';
import getRules from './rules';
import { setIsOpenSearchCriteriaDialog, setCustomQuery } from 'src/store/apps/rh-variaciones_masivas';
import {
  mapFieldConfigs,
  formatRuleToString,
  validateOperatorAddition,
  validateRuleAddition,
  validateDataIntegrity,
  validateFinalQuery
} from '../../utils';
import {
  FIELD_OPTIONS,
  OPERATOR_OPTIONS,
  operatorButtonStyle,
  boxQueryStyle
} from '../../constants';
import { RuleForm } from '../../interfaces';

const FormSearchCriteria = () => {
  const dispatch  = useDispatch()
  const rules     = getRules('formSearchCriteria')

  const [errorMessage, setErrorMessage]     = useState<string | null>(null)
  const [dialogOpen, setDialogOpen]         = useState<boolean>(false)
  const [currentQuery, setCurrentQuery]     = useState<string>('')
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [dragCounter, setDragCounter]       = useState(0)

  const queryClient: QueryClient  = useQueryClient()
  const { getList, message }      = useServiceFixedParams()

  const timeInMemory = 1000 * 60 * 60

  const { data: fieldMap, isLoading } = useQuery({
    queryKey: ['fieldOptions'],
    queryFn: () => getList(),
    select: (data) => mapFieldConfigs(data),
    staleTime: timeInMemory,
    gcTime: timeInMemory,
    retry: 3
  }, queryClient)

  const defaultValues = {
    field: null,
    operator: null,
    value: ''
  }

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isValid }
  } = useForm<RuleForm>({
    defaultValues,
    mode: 'onChange'
  })

  const watchedField    = watch('field');
  const dynamicOptions  = fieldMap && watchedField ? fieldMap[watchedField.value] : null;
  const isAutocomplete  = Boolean(dynamicOptions && dynamicOptions.length > 0);

  const handleAddRule = (data: RuleForm) => {
    const grammarValidation = validateRuleAddition(currentQuery)

    if (!grammarValidation.isValid) {
      setErrorMessage(grammarValidation.error!)
      toast.error(grammarValidation.error!)
      setTimeout(() => setErrorMessage(null), 10000)

      return
    }

    const integrityValidation = validateDataIntegrity(data.field, data.operator, data.value)

    if (!integrityValidation.isValid) {
      setErrorMessage(integrityValidation.error!)
      toast.error(integrityValidation.error!)
      setTimeout(() => setErrorMessage(null), 10000)

      return
    }

    const fieldToFormat = data.field!.sendAs || data.field!.value

    const ruleString = formatRuleToString(
      fieldToFormat,
      data.operator!.value,
      typeof data.value === 'object' ? data.value.value : data.value
    )

    setCurrentQuery((prev) => prev ? `${prev} ${ruleString}` : ruleString)

    reset(defaultValues)
  }

  const handleAddOperator = (operator: 'AND' | 'OR' | '(' | ')') => {
    const validation = validateOperatorAddition(currentQuery, operator)

    if (!validation.isValid) {
      setErrorMessage(validation.error!)
      toast.error(validation.error!)
      setTimeout(() => setErrorMessage(null), 10000)

      return
    }

    setCurrentQuery((prev) => `${prev} ${operator}`.trim())
  }

  const handleRemoveLast = () => {
    setCurrentQuery((prev) => {
      if (!prev) return prev

      const words = prev.trim().split(' ')
      words.pop()

      return words.join(' ')
    })
  }

  const onDragStartOperator = (event: React.DragEvent, operator: string) => {
    event.dataTransfer.setData('operator', operator)
    event.dataTransfer.effectAllowed = "copy"
  }

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = "copy"
  }

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDraggingOver(true)
    setDragCounter(prev => prev + 1)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDraggingOver(false)
    setDragCounter(prev => Math.max(0, prev - 1))
  }

  const onDropOperator = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDraggingOver(false)
    setDragCounter(0)

    const operator = event.dataTransfer.getData("operator") as any

    if (operator) {
      handleAddOperator(operator)
    }

    console.log('Operador soltado:', dragCounter)
  }

  const sanitizeQuery = (query: string) => {
    return query
      .replace(/\s+/g, ' ')
      .trim()
  }

  const handleSearch = () => {
    const sanitizedQuery  = sanitizeQuery(currentQuery)
    const finalCheck      = validateFinalQuery(sanitizedQuery)

    if (!finalCheck.isValid) {
      setErrorMessage(finalCheck.error!)
      toast.error(finalCheck.error!)
      setDialogOpen(false)

      return
    }

    dispatch(setCustomQuery(sanitizedQuery))
    dispatch(setIsOpenSearchCriteriaDialog(false))
  }

  const handleClearQuery = () => {
    setCurrentQuery('')
    dispatch(setCustomQuery(''))
  }

  const handleClose = () => {
    dispatch(setIsOpenSearchCriteriaDialog(false))
  }

  const handleOpenDialog = () => {
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  return (
    <>
      {
        errorMessage && (
          <Alert
            severity="error"
            onClose={() => setErrorMessage(null)}
            sx={{ mb: 2 }}
          >
            {errorMessage}
          </Alert>
        )
      }

      {
        isLoading
          ? (<Spinner sx={{ height: '100%' }} />)
          : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <form onSubmit={handleSubmit(handleAddRule)} noValidate>
                  <Grid container spacing={3} alignItems="flex-start">
                    <Grid item sm={3} xs={12}>
                      <Controller
                        name="field"
                        control={control}
                        rules={rules.field}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <Autocomplete
                            options={FIELD_OPTIONS}
                            value={value}
                            getOptionLabel={(option) => option.label}
                            isOptionEqualToValue={(option, value) => option.value === value?.value}
                            onChange={(_, newValue) => {
                              onChange(newValue);
                              setValue('value', '');
                            }}
                            renderInput={(params) => (
                              <TextField {...params} label="Item" error={!!error} helperText={error?.message} />
                            )}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item sm={3} xs={12}>
                      <Controller
                        name="operator"
                        control={control}
                        rules={rules.operator}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <Autocomplete
                            options={OPERATOR_OPTIONS}
                            value={value}
                            getOptionLabel={(option) => option.label}
                            isOptionEqualToValue={(option, value) => option.value === value?.value}
                            onChange={(_, newValue) => onChange(newValue)}
                            renderInput={(params) => (
                              <TextField {...params} label="Condición" error={!!error} helperText={error?.message} />
                            )}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <Controller
                        name="value"
                        control={control}
                        rules={rules.value}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          isAutocomplete ? (
                            <Autocomplete
                              key={`auto-${watchedField?.value}`}
                              options={dynamicOptions!}
                              getOptionLabel={(option) => option.label}
                              value={dynamicOptions?.find(element => element.value === value) || null}
                              onChange={(_, newValue) => onChange(newValue?.value || '')}
                              renderInput={(params) => (
                                <TextField {...params} label="Seleccione valor" error={!!error} helperText={error?.message} />
                              )}
                            />
                          ) : (
                            <TextField
                              fullWidth
                              label="Ingrese valor"
                              value={value}
                              onChange={onChange}
                              error={!!error}
                              helperText={error?.message}
                            />
                          )
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <Button
                          title='Agregar regla al criterio de búsqueda'
                          type="submit"
                          variant="contained"
                          size="small"
                          sx={{ textTransform: 'none', px: 3 }}
                          disabled={!isValid}
                        >
                          + AGREGAR
                        </Button>

                        <Button
                          title='Operador Y'
                          type="button"
                          variant='outlined'
                          size="small"
                          draggable
                          onDragStart={(e) => onDragStartOperator(e, 'AND')}
                          onClick={() => handleAddOperator('AND')}
                          sx={(theme) => operatorButtonStyle(theme)}
                        >
                          <DragIndicatorIcon
                            className="drag-icon"
                            sx={{
                              fontSize: '1.2rem',
                              opacity: 0.4,
                              transition: '0.2s',
                              color: 'inherit'
                            }}
                          />
                          { 'AND' }
                        </Button>
                        <Button
                          title='Operador O'
                          type="button"
                          variant='outlined'
                          size="small"
                          draggable
                          onDragStart={(e) => onDragStartOperator(e, 'OR')}
                          onClick={() => handleAddOperator('OR')}
                          sx={(theme) => operatorButtonStyle(theme)}
                        >
                          <DragIndicatorIcon
                            className="drag-icon"
                            sx={{
                              fontSize: '1.2rem',
                              opacity: 0.4,
                              transition: '0.2s',
                              color: 'inherit'
                            }}
                          />
                          { 'OR' }
                        </Button>
                        <Button
                          title='Paréntesis de apertura'
                          type="button"
                          variant='outlined'
                          size="small"
                          draggable
                          onDragStart={(e) => onDragStartOperator(e, '(')}
                          onClick={() => handleAddOperator('(')}
                          sx={(theme) => operatorButtonStyle(theme)}
                        >
                          <DragIndicatorIcon
                            className="drag-icon"
                            sx={{
                              fontSize: '1.2rem',
                              opacity: 0.4,
                              transition: '0.2s',
                              color: 'inherit'
                            }}
                          />
                          {'(' }
                        </Button>
                        <Button
                          title='Paréntesis de cierre'
                          type="button"
                          variant='outlined'
                          size="small"
                          draggable
                          onDragStart={(e) => onDragStartOperator(e, ')')}
                          onClick={() => handleAddOperator(')')}
                          sx={(theme) => operatorButtonStyle(theme)}
                        >
                          <DragIndicatorIcon
                            className="drag-icon"
                            sx={{
                              fontSize: '1.2rem',
                              opacity: 0.4,
                              transition: '0.2s',
                              color: 'inherit'
                            }}
                          />
                          { ')' }
                        </Button>

                        <Button
                          title='Borrar la última adición al criterio de búsqueda'
                          type="button"
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={handleRemoveLast}
                          disabled={!currentQuery}
                          sx={{
                            textTransform: 'none',
                            ml: 'auto',
                            minWidth: '120px'
                          }}
                        >
                          <BackspaceIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
                          Borrar último
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </Grid>

              <Grid item sm={12} xs={12}>
                <TextField
                  value={currentQuery}
                  aria-readonly
                  multiline
                  rows={8}
                  label="Consultas"
                  fullWidth
                  InputProps={{ readOnly: true }}
                  onDragOver={onDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={onDropOperator}
                  sx={(theme) => boxQueryStyle(theme, isDraggingOver)}
                />
              </Grid>

              <Grid item container sm={12} xs={12} spacing={3}>
                <Box sx={{ ml: 3, mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    title='Ejecutar búsqueda con el criterio establecido'
                    variant='contained'
                    color='primary'
                    size='small'
                    disabled={!currentQuery}
                    onClick={handleOpenDialog}
                  >
                    { 'Aceptar' }
                  </Button>

                  <Button
                    title='Limpiar criterio de búsqueda'
                    color='primary'
                    size='small'
                    disabled={!currentQuery}
                    onClick={handleClearQuery}
                  >
                    <CleaningServices /> Limpiar
                  </Button>

                  <Button
                    title='Cancelar y cerrar el diálogo de criterio de búsqueda'
                    variant='contained'
                    color='primary'
                    size='small'
                    onClick={handleClose}
                  >
                    { 'Cancelar' }
                  </Button>
                </Box>
              </Grid>

              <DialogConfirmation
                open={dialogOpen}
                onClose={handleCloseDialog}
                onConfirm={handleSearch}
                loading={isLoading}
                title="Confirmar búsqueda"
                content="¿Desea continuar con la búsqueda?"
              />
            </Grid>
          )
      }

      <AlertMessage
        message={message?.text ?? ''}
        severity={message?.isValid ? 'success' : 'error'}
        duration={8000}
        show={message?.text ? true : false}
      />
    </>
  )
}

export default FormSearchCriteria;
import { UseFormSetValue } from 'react-hook-form';
import { RuleForm } from '../interfaces';
import { FIELD_RESTRICTIONS, OPERATOR_OPTIONS } from '../constants';

export const applyFieldConstraints = (
  newValue: any,
  setValue: UseFormSetValue<RuleForm>
) => {
  setValue('value', '')
  const fieldName = newValue?.value
  const restriction = fieldName ? FIELD_RESTRICTIONS[fieldName] : null

  if (restriction?.forcedOperator) {
    const forcedOp = OPERATOR_OPTIONS.find(option => option.value === restriction.forcedOperator)
    setValue('operator', forcedOp || null)
  } else {
    setValue('operator', null)
  }
}
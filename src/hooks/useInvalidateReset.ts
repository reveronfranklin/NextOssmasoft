import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import {
  setIsOpenDialogConfirmButtons,
  setIsOpenDialogDocumentosEdit,
} from 'src/store/apps/ordenPago'

const useInvalidateReset = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return ({
    tables = [],
    resetForm,
    delay = 10000,
    closeDialogs = true
  }: {
    tables?: string[];
    resetForm?: () => void;
    delay?: number;
    closeDialogs?: boolean;
  }) => {
    tables.forEach(table => {
      queryClient.invalidateQueries({ queryKey: [table] });
    });

    resetForm?.();

    if (closeDialogs) {
      dispatch(setIsOpenDialogConfirmButtons(false));
      setTimeout(() => {
        dispatch(setIsOpenDialogDocumentosEdit(false));
      }, delay);
    }
  };
};

export default useInvalidateReset;
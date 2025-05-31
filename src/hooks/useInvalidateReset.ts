import { useQueryClient } from '@tanstack/react-query';

type InvalidateResetOptions = {
  tables?: string[];
  resetForm?: () => void;
  delay?: number;
  closeActions?: (() => void) | (() => void)[];
};

const useInvalidateReset = () => {
  const queryClient = useQueryClient();

  return (options: InvalidateResetOptions = {}) => {
    const {
      tables = [],
      resetForm,
      delay = 10000,
      closeActions
    } = options

    tables.forEach(table => {
      queryClient.invalidateQueries({ queryKey: [table] });
    });

    resetForm?.();

    if (closeActions) {
      if (Array.isArray(closeActions)) {
        if (delay > 0) {
          setTimeout(() => {
            closeActions.forEach(action => action());
          }, delay);
        } else {
          closeActions.forEach(action => action());
        }
      } else {
        if (delay > 0) {
          setTimeout(() => closeActions(), delay);
        } else {
          closeActions();
        }
      }
    }
  };
};

export default useInvalidateReset
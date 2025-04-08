export interface DialogConfirmationProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    content?: string | React.ReactNode;
    confirmButtonText?: string;
    cancelButtonText?: string;
    onConfirm: () => void;
    loading?: boolean;
    loadingText?: string;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
}
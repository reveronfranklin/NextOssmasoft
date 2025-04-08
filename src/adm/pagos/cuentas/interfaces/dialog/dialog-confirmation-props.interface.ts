export interface DialogConfirmationProps {
    // Control del diálogo
    open: boolean;
    onClose: () => void;

    // Textos personalizables
    title?: string;
    content?: string | React.ReactNode;
    confirmButtonText?: string;
    cancelButtonText?: string;

    // Función a ejecutar al confirmar
    onConfirm: () => void;

    // Estado de carga y textos
    loading?: boolean;
    loadingText?: string;

    // Estilos opcionales
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
}
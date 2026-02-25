import toast, { Toaster, ToastOptions } from 'react-hot-toast'

const toastOnTop = {
  position: 'top-right' as const,
  containerStyle: { zIndex: 9999 },
  toastOptions: { duration: 4000 }
}

export const LocalToastProvider = () => <Toaster {...toastOnTop} />

export const localToast = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, { ...toastOnTop.toastOptions, ...options }),
  error: (message: string, options?: ToastOptions) =>
    toast.error(message, { ...toastOnTop.toastOptions, ...options })
}

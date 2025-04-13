import { toast as sonnerToast, type ToastT } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
} & Omit<ToastT, "title" | "description">;

// Enhanced toast function that accepts both a string message and object config
function toast(
  messageOrProps: string | ToastProps,
  options?: ToastProps
) {
  // If first argument is a string, handle it as the message/title
  if (typeof messageOrProps === "string") {
    const title = messageOrProps;
    const { description, variant, ...restOptions } = options || {};
    
    if (variant === "destructive") {
      return sonnerToast.error(title, { description, ...restOptions });
    }
    
    return sonnerToast(title, { description, ...restOptions });
  }
  
  // Otherwise, first argument is an object with props
  const { title, description, variant, ...restProps } = messageOrProps;
  
  if (variant === "destructive") {
    return sonnerToast.error(title || "", { description, ...restProps });
  }
  
  return sonnerToast(title || "", { description, ...restProps });
}

// Add all sonnerToast methods
toast.success = sonnerToast.success;
toast.error = sonnerToast.error;
toast.info = sonnerToast.info;
toast.warning = sonnerToast.warning;
toast.promise = sonnerToast.promise;
toast.dismiss = sonnerToast.dismiss;
toast.custom = sonnerToast.custom;

export { toast };

export const useToast = () => {
  return {
    toast
  };
};

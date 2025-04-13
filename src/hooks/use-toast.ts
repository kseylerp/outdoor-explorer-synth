import { toast as sonnerToast, type ToastT } from "sonner";
import { v4 as uuidv4 } from "uuid";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  id?: string;
} & Omit<ToastT, "title" | "description" | "id">;

function toast(
  messageOrProps: string | ToastProps,
  options?: ToastProps
) {
  const generateId = () => uuidv4();
  
  if (typeof messageOrProps === "string") {
    const title = messageOrProps;
    const { description, variant, id = generateId(), ...restOptions } = options || {};
    
    if (variant === "destructive") {
      return sonnerToast.error(title, { description, id, ...restOptions });
    }
    
    return sonnerToast(title, { description, id, ...restOptions });
  }
  
  const { title, description, variant, id = generateId(), ...restProps } = messageOrProps;
  
  if (variant === "destructive") {
    return sonnerToast.error(title || "", { description, id, ...restProps });
  }
  
  return sonnerToast(title || "", { description, id, ...restProps });
}

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

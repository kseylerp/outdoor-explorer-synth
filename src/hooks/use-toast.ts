
import { toast as sonnerToast, type ToastT } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
} & Omit<Parameters<typeof sonnerToast>[1], "title" | "description">;

// Enhanced toast function that accepts both a string message and object config
function toast(message: string | ToastProps, options?: Omit<Parameters<typeof sonnerToast>[1], "title" | "description">) {
  if (typeof message === "string") {
    return sonnerToast(message, options);
  }
  
  const { title, description, variant, ...restProps } = message;
  
  // Handle variant if provided
  if (variant === "destructive") {
    return sonnerToast.error(description || title || "", restProps);
  }
  
  return sonnerToast(title || "", {
    description,
    ...restProps,
  });
}

// Add all sonnerToast methods to our toast function
Object.assign(toast, sonnerToast);

export { toast };

export const useToast = () => {
  return {
    toast
  };
};

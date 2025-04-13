
import { toast as sonnerToast, type ToastT } from "sonner";

type ToastProps = Parameters<typeof sonnerToast>[1] & {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

// Enhanced toast function that accepts both title-description style and direct message style
const toast = Object.assign(
  // Main toast function
  (props: ToastProps | string) => {
    if (typeof props === "string") {
      return sonnerToast(props);
    }
    
    const { title, description, variant, ...restProps } = props;
    
    // Handle variant if provided
    if (variant === "destructive") {
      return sonnerToast.error(description || title, {
        ...restProps,
      });
    }
    
    return sonnerToast(title, {
      description,
      ...restProps,
    });
  },
  // Add all the other toast methods
  {
    ...sonnerToast,
  }
);

export { toast };

export const useToast = () => {
  return {
    toast
  };
};

import { useToast } from "@ui/hooks/use-toast";
import { useCallback } from "react";

interface ToastOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useCustomToast = () => {
  const { toast } = useToast();

  const showToast = useCallback(
    (
      type: "success" | "error" | "warning" | "info",
      title: string,
      description?: string,
      options?: ToastOptions
    ) => {
      const baseToastConfig = {
        title,
        description,
        duration: options?.duration || 3000,
        action: options?.action,
      };

      switch (type) {
        case "success":
          toast({
            ...baseToastConfig,
            variant: "default",
            className: "bg-green-500 text-white",
          });
          break;
        case "error":
          toast({
            ...baseToastConfig,
            variant: "destructive",
          });
          break;
        case "warning":
          toast({
            ...baseToastConfig,
            variant: "default",
            className: "bg-yellow-500 text-white",
          });
          break;
        case "info":
          toast({
            ...baseToastConfig,
            variant: "default",
            className: "bg-blue-500 text-white",
          });
          break;
      }
    },
    [toast]
  );

  return {
    success: (title: string, description?: string, options?: ToastOptions) =>
      showToast("success", title, description, options),
    error: (title: string, description?: string, options?: ToastOptions) =>
      showToast("error", title, description, options),
    warning: (title: string, description?: string, options?: ToastOptions) =>
      showToast("warning", title, description, options),
    info: (title: string, description?: string, options?: ToastOptions) =>
      showToast("info", title, description, options),
  };
};
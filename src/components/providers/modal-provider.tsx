"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ModalType = "session-expired" | "confirm" | "alert" | null;

interface ModalOptions {
  title?: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface ModalContextType {
  showModal: (type: ModalType, options?: ModalOptions) => void;
  hideModal: () => void;
  showSessionExpired: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

// Singleton pour accès hors React (interceptors Axios)
let modalInstance: ModalContextType | null = null;

export function getModalInstance() {
  return modalInstance;
}

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [options, setOptions] = useState<ModalOptions>({});

  const showModal = useCallback((type: ModalType, opts: ModalOptions = {}) => {
    setModalType(type);
    setOptions(opts);
  }, []);

  const hideModal = useCallback(() => {
    setModalType(null);
    setOptions({});
  }, []);

  const showSessionExpired = useCallback(() => {
    showModal("session-expired", {
      title: "Session Expired",
      description: "Your session has expired. Please sign in again to continue.",
      confirmText: "Sign In",
      onConfirm: () => {
        hideModal();
        // Redirect to sign-in or handle sign in
        window.location.href = "/sign-in";
      },
    });
  }, [showModal, hideModal]);

  const contextValue: ModalContextType = useMemo(
    () => ({
      showModal,
      hideModal,
      showSessionExpired,
    }),
    [showModal, hideModal, showSessionExpired],
  );

  // Expose instance for non-React access (in useEffect to avoid side effects during render)
  useEffect(() => {
    modalInstance = contextValue;
  }, [contextValue]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      options.onCancel?.();
      hideModal();
    }
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}

      {/* Session Expired Modal */}
      <Dialog open={modalType === "session-expired"} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {options.title || "Session Expired"}
            </DialogTitle>
            <DialogDescription>
              {options.description || "Your session has expired. Please sign in again."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={options.onConfirm} className="w-full sm:w-auto">
              {options.confirmText || "Sign In"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generic Confirm Modal */}
      <Dialog open={modalType === "confirm"} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{options.title || "Confirm"}</DialogTitle>
            <DialogDescription>
              {options.description || "Are you sure you want to proceed?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              {options.cancelText || "Cancel"}
            </Button>
            <Button onClick={options.onConfirm}>{options.confirmText || "Confirm"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generic Alert Modal */}
      <Dialog open={modalType === "alert"} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{options.title || "Alert"}</DialogTitle>
            <DialogDescription>{options.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => handleOpenChange(false)}>{options.confirmText || "OK"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ModalContext.Provider>
  );
}

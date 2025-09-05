"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DeleteConfirmationDialogProps {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
  variant?: "destructive" | "default";
}

export function DeleteConfirmationDialog({
  trigger,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  isLoading = false,
  variant = "destructive",
}: DeleteConfirmationDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            variant={variant}
            asChild
          >
            <AlertDialogAction>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {confirmText}
            </AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

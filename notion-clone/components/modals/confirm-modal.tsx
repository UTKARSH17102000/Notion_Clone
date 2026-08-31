"use client";

import React from "react";

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
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  children: React.ReactNode;
  onConfirm: () => void;
  /** Name the thing being destroyed. "Are you absolutely sure?" says nothing. */
  title?: string;
  description?: string;
  confirmLabel?: string;
}

export function ConfirmModal({
  children,
  onConfirm,
  title = "Delete this note forever?",
  description = "This note and everything nested inside it will be permanently removed. This cannot be undone.",
  confirmLabel = "Delete forever",
}: ConfirmModalProps) {
  const handleConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onConfirm();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger onClick={(event) => event.stopPropagation()} asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(event) => event.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

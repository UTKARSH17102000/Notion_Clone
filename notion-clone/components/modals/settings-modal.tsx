"use client";

import { useTheme } from "next-themes";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSettings } from "@/hooks/use-settings";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import { useShortcutKey } from "@/hooks/use-shortcut-key";

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-x-6 py-4">
      <div className="flex flex-col gap-y-1">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-[0.8rem] text-muted-foreground">{hint}</span>
      </div>
      {children}
    </div>
  );
}

export function SettingsModal() {
  const settings = useSettings();
  const { theme } = useTheme();
  const shortcutKey = useShortcutKey();

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="border-b pb-3">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Preferences for this device. They are stored in your browser.
          </DialogDescription>
        </DialogHeader>

        <div className="divide-y">
          <Row
            label="Appearance"
            hint="Customize how Strata looks on your device."
          >
            <ModeToggle />
          </Row>

          <Row
            label="Theme source"
            hint={
              theme === "system"
                ? "Following your operating system."
                : "Set manually to " + (theme ?? "system") + "."
            }
          >
            <span className="text-sm capitalize text-muted-foreground">
              {theme ?? "system"}
            </span>
          </Row>

          <Row label="Search" hint="Jump to any page by title.">
            <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded-sm border bg-muted px-2 font-mono text-[11px] font-medium text-muted-foreground">
              {shortcutKey}K
            </kbd>
          </Row>
        </div>
      </DialogContent>
    </Dialog>
  );
}

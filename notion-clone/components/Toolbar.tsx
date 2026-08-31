"use client";

import React, { ElementRef, useRef, useState } from "react";
import { ImageIcon, Smile, X } from "lucide-react";
import { useMutation } from "convex/react";
import TextAreaAutoSize from "react-textarea-autosize";

import { useConverImage } from "@/hooks/use-cover-image";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";

import { IconPicker } from "./icon-picker";

interface ToolbarProps {
  initialData: Doc<"documents">;
  preview?: boolean;
}

export function Toolbar({ initialData, preview }: ToolbarProps) {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);

  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);

  const coverImage = useConverImage();

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onInput = (value: string) => {
    setValue(value);
    update({
      id: initialData._id,
      title: value || "Untitled",
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
    if (event.key === "Escape") {
      disableInput();
    }
  };

  const onIconSelect = (icon: string) => {
    update({ id: initialData._id, icon });
  };

  const onRemoveIcon = () => {
    removeIcon({ id: initialData._id });
  };

  return (
    <div className="group relative px-[54px]">
      {!!initialData.icon && !preview && (
        <div className="group/icon flex items-center gap-x-2 pt-6">
          <IconPicker onChange={onIconSelect}>
            <button
              type="button"
              aria-label="Change page icon"
              className="rounded-md text-6xl leading-none transition hover:opacity-75"
            >
              {initialData.icon}
            </button>
          </IconPicker>
          <Button
            className="rounded-md text-xs text-muted-foreground opacity-0 transition group-hover/icon:opacity-100 focus-visible:opacity-100"
            variant="outline"
            size="icon"
            onClick={onRemoveIcon}
            aria-label="Remove page icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!!initialData.icon && preview && (
        <p className="pt-6 text-6xl leading-none">{initialData.icon}</p>
      )}

      {/* Hover-revealed, but always reachable by keyboard. */}
      <div className="flex items-center gap-x-1 py-4 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-xs text-muted-foreground"
              variant="outline"
              size="sm"
            >
              <Smile className="mr-2 h-4 w-4" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm"
            onClick={coverImage.onOpen}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Add cover
          </Button>
        )}
      </div>

      {isEditing && !preview ? (
        <TextAreaAutoSize
          className="w-full resize-none break-words bg-transparent font-serif text-[2.75rem] font-semibold leading-tight text-foreground outline-none"
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          aria-label="Page title"
        />
      ) : preview ? (
        <h1 className="break-words pb-[11.5px] font-serif text-[2.75rem] font-semibold leading-tight text-foreground">
          {initialData.title}
        </h1>
      ) : (
        <button
          type="button"
          onClick={enableInput}
          className="w-full break-words rounded-sm pb-[11.5px] text-left font-serif text-[2.75rem] font-semibold leading-tight text-foreground"
          aria-label={"Rename page. Current title: " + initialData.title}
        >
          {initialData.title}
        </button>
      )}
    </div>
  );
}

"use client";

import React, { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useMutation } from "convex/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";

import { DocumentList } from "./document-list";
import { Item } from "./Item";
import { UserItem } from "./user-item";
import { TrashBox } from "./trash-box";
import { Navbar } from "./Navbar";

const Navigation = () => {
  const search = useSearch();
  const settings = useSettings();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const create = useMutation(api.documents.create);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = e.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.removeProperty("width");
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const handleCreate = () => {
    const promise = create({ title: "Untitled" }).then((documentId) =>
      router.push(`/documents/${documentId}`)
    );

    toast.promise(promise, {
      loading: "Creating a new note....",
      success: "New note created.",
      error: "Failed to create a note.",
    });
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        aria-label="Workspace navigation"
        className={cn(
          "group/sidebar relative z-[300] flex h-full w-60 flex-col overflow-y-auto border-r bg-secondary",
          isResetting && "transition-all duration-300 ease-in-out",
          isMobile && "w-0"
        )}
      >
        <button
          type="button"
          onClick={collapse}
          aria-label="Collapse sidebar"
          className={cn(
            "absolute right-2 top-3 rounded-sm p-0.5 text-muted-foreground opacity-0 transition hover:bg-accent hover:text-foreground focus-visible:opacity-100 group-hover/sidebar:opacity-100",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-5 w-5" />
        </button>

        <UserItem />

        <nav aria-label="Workspace actions" className="mt-1">
          <Item label="Search" icon={Search} isSearch onClick={search.onOpen} />
          <Item label="Settings" icon={Settings} onClick={settings.onOpen} />
          <Item onClick={handleCreate} label="New page" icon={PlusCircle} />
        </nav>

        <div className="mt-6 flex min-h-0 flex-1 flex-col">
          <h2 className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
            Pages
          </h2>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <DocumentList />
            <Item onClick={handleCreate} icon={Plus} label="Add a page" />
          </div>

          <div className="mt-2 border-t pt-1">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="group flex min-h-[27px] w-full items-center gap-x-2 py-1 pl-3 pr-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Trash className="h-[18px] w-[18px] shrink-0" />
                  <span className="truncate">Trash</span>
                </button>
              </PopoverTrigger>
              <PopoverContent
                side={isMobile ? "bottom" : "right"}
                align="end"
                collisionPadding={12}
                className="w-80 p-0"
              >
                <TrashBox />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize sidebar"
          className="absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-primary/20 opacity-0 transition group-hover/sidebar:opacity-100"
        />
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          "absolute left-60 top-0 z-[300] w-[calc(100%-240px)]",
          isResetting && "transition-all duration-300 ease-in-out",
          isMobile && "left-0 w-full"
        )}
      >
        {!!params.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav
            className={cn(
              "w-full bg-transparent px-3 py-2",
              !isCollapsed && "p-0"
            )}
          >
            {isCollapsed && (
              <button
                type="button"
                onClick={resetWidth}
                aria-label="Open sidebar"
                className="rounded-sm p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <MenuIcon className="h-6 w-6" />
              </button>
            )}
          </nav>
        )}
      </div>
    </>
  );
};

export default Navigation;

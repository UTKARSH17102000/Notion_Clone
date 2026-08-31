import Image from "next/image";

import { cn } from "@/lib/utils";

interface ShotProps {
  name: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

/**
 * A real screenshot of the running product, captured in both themes so the
 * page never shows a light UI on a dark ground. Not a mock, not a div drawing.
 */
export function Shot({
  name,
  alt,
  width,
  height,
  priority,
  className,
  sizes,
}: ShotProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border bg-card shadow-sm",
        className
      )}
    >
      <Image
        src={"/shots/" + name + "-light.jpg"}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className="block h-auto w-full dark:hidden"
      />
      <Image
        src={"/shots/" + name + "-dark.jpg"}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className="hidden h-auto w-full dark:block"
      />
    </div>
  );
}

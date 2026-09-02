import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function ContainerScroll({
  children,
  className,
  titleComponent,
}: {
  children: ReactNode;
  className?: string;
  titleComponent: ReactNode;
}) {
  return (
    <div className={cn("static-container-scroll", className)}>
      <div className="static-container-scroll-header">{titleComponent}</div>
      <div className="static-container-scroll-card">
        <div className="static-container-scroll-screen">{children}</div>
      </div>
    </div>
  );
}

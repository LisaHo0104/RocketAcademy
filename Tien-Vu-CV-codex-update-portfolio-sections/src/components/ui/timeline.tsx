"use client";

import { motion, useScroll, useTransform } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export function Timeline({
  className,
  data,
  header,
}: {
  className?: string;
  data: TimelineEntry[];
  header?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      const nextHeight = ref.current?.getBoundingClientRect().height ?? 0;
      setHeight((currentHeight) =>
        currentHeight === nextHeight ? currentHeight : nextHeight,
      );
    };

    updateHeight();

    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(element);
    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 12%", "end 55%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.12], [0, 1]);

  return (
    <div
      className={cn("relative w-full overflow-clip md:px-10", className)}
      ref={containerRef}
    >
      {header ? (
        <div className="mx-auto max-w-7xl px-4 pb-2 pt-20 md:px-8 md:pt-24 lg:px-10">
          {header}
        </div>
      ) : null}

      <div ref={ref} className="relative mx-auto max-w-7xl pb-24">
        {data.map((item) => (
          <div
            className="flex justify-start pt-12 md:gap-6 md:pt-28"
            key={item.title}
          >
            <div className="sticky top-28 z-40 flex max-w-xs self-start md:w-56 md:max-w-56 lg:w-64 lg:max-w-64">
              <div className="absolute left-8 flex h-10 w-10 items-center justify-center rounded-full bg-[#fff7e8] shadow-[0_0_0_8px_rgba(255,247,232,0.82)]">
                <div className="h-4 w-4 rounded-full border border-[#c77f91] bg-[#d8aaa3]" />
              </div>
              <h3 className="hidden pl-24 font-display text-5xl font-semibold leading-none text-[#735a4e] md:block lg:text-6xl">
                {item.title}
              </h3>
            </div>

            <div className="relative min-w-0 w-full pl-20 pr-4 md:pl-0">
              <h3 className="mb-5 block font-display text-5xl font-semibold leading-none text-[#735a4e] md:hidden">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        <div
          className="absolute left-8 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-[#d8aaa3]/55 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_88%,transparent_100%)]"
          style={{ height }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-[#d8aaa3] via-[#8f9680] to-transparent from-[0%] via-[18%]"
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
          />
        </div>
      </div>
    </div>
  );
}

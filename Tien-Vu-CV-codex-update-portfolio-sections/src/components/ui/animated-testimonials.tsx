"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type AnimatedTestimonial = {
  ctaLabel?: string;
  designation: string;
  href?: string;
  imageHeight: number;
  imageFit?: "contain" | "cover";
  imagePosition?: string;
  imageWidth: number;
  name: string;
  quote: string;
  src: string;
};

export function AnimatedTestimonials({
  autoplay = false,
  className,
  testimonials,
}: {
  autoplay?: boolean;
  className?: string;
  testimonials: AnimatedTestimonial[];
}) {
  const [active, setActive] = useState(0);
  const total = testimonials.length;

  const handleNext = useCallback(() => {
    if (total === 0) {
      return;
    }

    setActive((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total === 0) {
      return;
    }

    setActive((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!autoplay || total <= 1) {
      return;
    }

    const interval = window.setInterval(handleNext, 5000);

    return () => window.clearInterval(interval);
  }, [autoplay, handleNext, total]);

  if (total === 0) {
    return null;
  }

  const activeIndex = active % total;
  const activeTestimonial = testimonials[activeIndex] ?? testimonials[0];
  const isActive = (index: number) => index === activeIndex;
  const rotateY = (index: number) => ((index * 17 + 7) % 21) - 10;

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-6xl px-0 py-10 font-sans antialiased",
        className,
      )}
    >
      <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.98fr)_minmax(320px,0.86fr)] lg:items-center lg:gap-16">
        <div className="min-w-0">
          <div className="relative h-[24rem] w-full sm:h-[30rem] lg:h-[34rem]">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  animate={{
                    opacity: isActive(index) ? 1 : 0.58,
                    rotate: isActive(index) ? 0 : rotateY(index),
                    scale: isActive(index) ? 1 : 0.94,
                    y: isActive(index) ? [0, -42, 0] : 0,
                    z: isActive(index) ? 0 : -100,
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                  }}
                  className="absolute inset-0 flex origin-bottom items-center justify-center"
                  exit={{
                    opacity: 0,
                    rotate: rotateY(index),
                    scale: 0.9,
                    z: 100,
                  }}
                  initial={{
                    opacity: 0,
                    rotate: rotateY(index),
                    scale: 0.9,
                    z: -100,
                  }}
                  key={testimonial.src}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                >
                  <div
                    className="max-h-full max-w-full overflow-hidden rounded-lg border border-[#fff7e8]/30 bg-[#2f1c18] shadow-2xl shadow-black/25"
                    style={{
                      aspectRatio: `${testimonial.imageWidth} / ${testimonial.imageHeight}`,
                      width: `min(100%, calc(var(--academic-project-image-height) * ${testimonial.imageWidth / testimonial.imageHeight}))`,
                    }}
                  >
                    <Image
                      alt={testimonial.name}
                      className={cn(
                        "h-full w-full",
                        testimonial.imageFit === "cover"
                          ? "object-cover"
                          : "object-contain",
                      )}
                      draggable={false}
                      height={testimonial.imageHeight}
                      priority={index === 0}
                      sizes="(max-width: 768px) 92vw, 48vw"
                      src={testimonial.src}
                      style={{ objectPosition: testimonial.imagePosition }}
                      width={testimonial.imageWidth}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-between py-2 text-[#fff7e8] lg:min-h-[29rem]">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              initial={{ opacity: 0, y: 20 }}
              key={activeIndex}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#d8aaa3]">
                {activeTestimonial.designation}
              </p>
              <h3 className="mt-4 font-display text-4xl font-semibold leading-[0.92] text-[#fff7e8] sm:text-5xl lg:text-6xl">
                {activeTestimonial.name}
              </h3>
              <motion.p className="mt-8 max-w-xl text-base font-light leading-8 text-[#eadcc5] sm:text-lg">
                {activeTestimonial.quote.split(" ").map((word, index) => (
                  <motion.span
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    className="inline-block"
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 5,
                    }}
                    key={`${word}-${index}`}
                    transition={{
                      delay: 0.018 * index,
                      duration: 0.2,
                      ease: "easeInOut",
                    }}
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>

              {activeTestimonial.href ? (
                <a
                  className="mt-8 inline-flex w-fit items-center gap-2 border-b border-[#d8aaa3]/50 pb-1 font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#fff7e8] transition hover:border-[#fff7e8]"
                  href={activeTestimonial.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {activeTestimonial.ctaLabel ?? "View Project"}
                  <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex gap-4 lg:mt-0">
            <button
              aria-label="Previous academic project"
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-[#fff7e8] text-[#4d3028] transition hover:bg-[#eadcc5]"
              onClick={handlePrev}
              type="button"
            >
              <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover/button:-translate-x-0.5" />
            </button>
            <button
              aria-label="Next academic project"
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-[#fff7e8] text-[#4d3028] transition hover:bg-[#eadcc5]"
              onClick={handleNext}
              type="button"
            >
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/button:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

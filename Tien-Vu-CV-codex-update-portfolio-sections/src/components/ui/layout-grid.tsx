"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type LayoutGridCard = {
  alt: string;
  className?: string;
  description: string;
  details?: string;
  eyebrow: string;
  id: number;
  imageClassName?: string;
  metric?: string;
  thumbnail: string;
  title: string;
  videoSrc?: string;
};

export function LayoutGrid({
  cards,
  className,
}: {
  cards: LayoutGridCard[];
  className?: string;
}) {
  const [selected, setSelected] = useState<LayoutGridCard | null>(null);

  useEffect(() => {
    if (!selected) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected]);

  return (
    <div className={cn("career-layout-grid-wrap", className)}>
      <div className="career-layout-grid">
        {cards.map((card, index) =>
          card.videoSrc ? (
            <figure
              className={cn("career-layout-card", card.className)}
              key={card.id}
            >
              <video
                aria-label={card.alt}
                className="career-layout-card-video-media"
                controls
                muted
                playsInline
                poster={card.thumbnail}
                preload="metadata"
                src={card.videoSrc}
              />
              <figcaption className="sr-only">{card.title}</figcaption>
            </figure>
          ) : (
            <motion.button
              aria-label={`Open ${card.title}`}
              className={cn("career-layout-card", card.className)}
              key={card.id}
              onClick={() => setSelected(card)}
              type="button"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Image
                alt={card.alt}
                className={cn("career-layout-card-image", card.imageClassName)}
                fill
                priority={index === 0}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 24vw"
                src={card.thumbnail}
              />
              <span className="career-layout-card-shade" aria-hidden="true" />
              <span className="career-layout-card-copy">
                <span>{card.eyebrow}</span>
                <strong>{card.title}</strong>
              </span>
            </motion.button>
          ),
        )}
      </div>

      <AnimatePresence>
        {selected ? (
          <>
            <motion.button
              aria-label="Close selected career journey media"
              className="career-layout-backdrop"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSelected(null)}
              type="button"
            />
            <motion.article
              aria-label={selected.title}
              className="career-layout-expanded"
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="career-layout-expanded-image">
                <Image
                  alt={selected.alt}
                  className={cn(
                    "career-layout-card-image",
                    selected.imageClassName,
                  )}
                  fill
                  sizes="(max-width: 768px) 94vw, 980px"
                  src={selected.thumbnail}
                />
              </div>
              <div className="career-layout-expanded-copy">
                <p>{selected.eyebrow}</p>
                <h3>{selected.title}</h3>
                <span>{selected.description}</span>
                {selected.details ? <small>{selected.details}</small> : null}
                {selected.metric ? <strong>{selected.metric}</strong> : null}
              </div>
              <button
                aria-label="Close selected career journey media"
                className="career-layout-close"
                onClick={() => setSelected(null)}
                type="button"
              >
                <X aria-hidden="true" />
              </button>
            </motion.article>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

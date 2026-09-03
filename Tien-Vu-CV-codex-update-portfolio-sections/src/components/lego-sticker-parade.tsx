import Image, { type StaticImageData } from "next/image";

import cameraSticker from "../../public/assets/portfolio/decor/cute-brick-camera.png";
import clapperSticker from "../../public/assets/portfolio/decor/cute-brick-clapper.png";
import ideaSticker from "../../public/assets/portfolio/decor/cute-brick-idea.png";

const stickers: Record<StickerVariant, StaticImageData> = {
  camera: cameraSticker,
  clapper: clapperSticker,
  idea: ideaSticker,
};

type StickerVariant = "camera" | "clapper" | "idea";

export function LegoSticker({
  className,
  variant,
}: {
  className: string;
  variant: StickerVariant;
}) {
  return (
    <span
      aria-hidden="true"
      className={`lego-sticker lego-sticker-${variant} lego-sticker-ornament ${className}`}
    >
      <Image
        alt=""
        className="lego-sticker-image"
        placeholder="blur"
        sizes="(max-width: 640px) 96px, 150px"
        src={stickers[variant]}
      />
    </span>
  );
}

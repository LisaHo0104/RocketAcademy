import Image from "next/image";

const conceptImages = [
  {
    alt: "Mood board A for creative concept development",
    className: "creative-planning-shot-mood-a",
    src: "/assets/canva/ae229187c3e295743b44821536823b7b.png",
  },
  {
    alt: "Mood board B for creative concept development",
    className: "creative-planning-shot-mood-b",
    src: "/assets/canva/8f6ce656467ac56e53b8495f9463b20f.png",
  },
  {
    alt: "Element board for spatial planning and event styling",
    className: "creative-planning-shot-element",
    src: "/assets/canva/9142a6b5e287ebbb6db47c0b26a4166d.png",
  },
  {
    alt: "Font style board for visual communication",
    className: "creative-planning-shot-font",
    src: "/assets/canva/4b5da71e75710431efd19ff6cc388562.png",
  },
  {
    alt: "Event setup flow with venue photos and spatial map",
    className: "creative-planning-shot-flow",
    src: "/assets/canva/d75878706b5e33b58f541ecc829bffbe.png",
  },
  {
    alt: "Black floor plan showing event setup areas",
    className: "creative-planning-shot-plan",
    src: "/assets/canva/c3724de0d24960305eaa56b9a594d915.png",
  },
  {
    alt: "Logistic setup timeline spreadsheet",
    className: "creative-planning-shot-timeline",
    src: "/assets/creative-planning/logistic-setup-timeline.png",
  },
  {
    alt: "Room one event styling and setup checklist",
    className: "creative-planning-shot-room",
    src: "/assets/creative-planning/room-one-checklist.png",
  },
  {
    alt: "Floor-by-floor logistics checklist for event areas",
    className: "creative-planning-shot-checklist",
    src: "/assets/creative-planning/floor-logistics-checklist.png",
  },
  {
    alt: "Print production and visual asset checklist",
    className: "creative-planning-shot-print",
    src: "/assets/creative-planning/print-production-checklist.png",
  },
];

const labels = [
  {
    className: "creative-planning-label-concept",
    text: "Creative concept development",
  },
  {
    className: "creative-planning-label-spatial",
    text: "Spatial planning and event layout",
  },
  {
    className: "creative-planning-label-flow",
    text: "Understanding setup flow",
  },
  {
    className: "creative-planning-label-execution",
    text: "Translating creative concepts into execution",
  },
  {
    className: "creative-planning-label-print",
    text: "Print production and visual assets",
  },
];

export function CreativePlanning() {
  return (
    <section
      aria-labelledby="creative-planning-heading"
      className="creative-planning-section"
      id="creative-planning"
    >
      <div className="creative-planning-title-band">
        <h2 id="creative-planning-heading">
          Creative Planning &amp; Visual Communication
        </h2>
      </div>

      <div
        aria-label="Creative planning and visual communication collage"
        className="creative-planning-board"
      >
        {labels.map((label, index) => (
          <p
            className={`creative-planning-label ${label.className}`}
            key={label.text}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {label.text}
          </p>
        ))}

        {conceptImages.map((image, index) => (
          <figure
            className={`creative-planning-shot ${image.className}`}
            key={image.src}
            style={{ animationDelay: `${240 + index * 75}ms` }}
          >
            <Image
              alt={image.alt}
              className="creative-planning-image"
              fill
              sizes="(max-width: 760px) 94vw, (max-width: 1100px) 76vw, 34vw"
              src={image.src}
            />
          </figure>
        ))}
      </div>
    </section>
  );
}

import Image from "next/image";

import { AcademicJourney } from "@/components/academic-journey";
import { AcademicProjects } from "@/components/academic-projects";
import { CareerJourney } from "@/components/career-journey";
import { ContactSection } from "@/components/contact-section";
import { IntroGate } from "@/components/intro-gate";
import { PreparedVideoWork } from "@/components/prepared-video-work";
import { CometCard } from "@/components/ui/comet-card";

const valueWords = [
  {
    className: "value-word-creative",
    description: "turning ideas into stories people remember.",
    text: "creative",
  },
  {
    className: "value-word-curious",
    description: "always asking questions to understand deeper.",
    text: "curious",
  },
  {
    className: "value-word-empathetic",
    description: "listening closely before creating anything.",
    text: "empathetic",
  },
  {
    className: "value-word-authentic",
    description: "keeping the message honest and human.",
    text: "authentic",
  },
  {
    className: "value-word-strategic",
    description: "connecting every creative choice to purpose.",
    text: "strategic",
  },
  {
    className: "value-word-purpose",
    description: "building work with direction and meaning.",
    text: "purpose-driven",
  },
  {
    className: "value-word-visual",
    description: "shaping ideas through image, rhythm, and mood.",
    text: "visual",
  },
  {
    className: "value-word-passionate",
    description: "bringing care and energy into every project.",
    text: "passionate",
  },
];

const heroPhotos = [
  {
    className: "lego-hero-photo-camera-setup",
    height: 683,
    src: "/assets/portfolio/hero-photo-camera-setup.png",
    width: 384,
  },
  {
    className: "lego-hero-photo-camera-portrait",
    height: 1138,
    src: "/assets/portfolio/hero-photo-laptop-study.png",
    width: 640,
  },
  {
    className: "lego-hero-photo-swinburne-award",
    height: 262,
    src: "/assets/portfolio/hero-photo-swinburne-award.png",
    width: 384,
  },
  {
    className: "lego-hero-photo-tet-am-team",
    height: 288,
    src: "/assets/portfolio/hero-photo-tet-am-team.png",
    width: 384,
  },
];

export default function Home() {
  return (
    <>
      <IntroGate />
      <main className="portfolio-shell overflow-hidden">
        <section className="landing-poster-hero" aria-labelledby="hero-heading">
          <div className="hero-canvas" id="top">
            <Image
              alt=""
              className="lego-hero-art"
              fill
              fetchPriority="high"
              loading="eager"
              sizes="100vw"
              src="/assets/portfolio/lego-hero-tien-vu-v2.png"
              unoptimized
            />

            <h1 className="sr-only" id="hero-heading">
              Tien Vu — Video Editing, Content Creation and Visual Storytelling
            </h1>
            <p className="sr-only">
              I turn ideas into stories people want to be part of.
            </p>

            <div aria-hidden="true" className="lego-hero-photo-strip">
              {heroPhotos.map((photo) => (
                <div
                  className={`lego-hero-photo ${photo.className}`}
                  key={photo.src}
                >
                  <Image
                    alt=""
                    height={photo.height}
                    sizes="11vw"
                    src={photo.src}
                    width={photo.width}
                  />
                </div>
              ))}
            </div>

            <nav className="lego-hero-nav" aria-label="Portfolio navigation">
              <a
                aria-label="Tien Vu — back to top"
                className="lego-hero-wordmark-link"
                href="#top"
              />
              <div className="lego-hero-nav-links">
                <a aria-label="About" href="#about-me" />
                <a aria-label="Work" href="#projects" />
                <a aria-label="Journey" href="#career-journey" />
                <a aria-label="Contact" href="#contact" />
              </div>
            </nav>

            <a
              aria-label="Explore selected work"
              className="lego-hero-cta-link"
              href="#prepared-video-work"
            />
          </div>
        </section>

        <section className="about-section" id="about-me" aria-labelledby="about-heading">
          <div className="about-inner">
            <div className="about-copy">
              <p className="about-kicker">About Me</p>
              <h2 className="about-heading" id="about-heading">
                Hello! I&apos;m Tien.
              </h2>
              <div className="about-body">
                <p>
                  I&apos;m a Melbourne-based content creator and video editor
                  passionate about turning ideas and everyday moments into
                  engaging visual stories. I enjoy creating playful,
                  human-centred content across education, social media and
                  community projects.
                </p>
              </div>
              <div className="about-tags" aria-label="Tien Vu focus areas">
                <span className="about-lego-tag about-lego-tag-red">
                  <span className="about-lego-tag-label">Content Creator</span>
                </span>
                <span className="about-lego-tag about-lego-tag-yellow">
                  <span className="about-lego-tag-label">Marketing</span>
                </span>
                <span className="about-lego-tag about-lego-tag-blue">
                  <span className="about-lego-tag-label">Melbourne</span>
                </span>
              </div>
            </div>

            <CometCard
              className="about-comet-card"
              rotateDepth={9}
              translateDepth={12}
            >
              <figure className="about-photo-frame">
                <div className="about-photo">
                  <Image
                    alt="Tien sitting by a window holding a bouquet of flowers"
                    className="h-full w-full object-cover"
                    fill
                    sizes="(max-width: 768px) 88vw, 38vw"
                    src="/assets/portfolio/about-tien-vu.jpeg"
                  />
                </div>
                <figcaption>
                  Authentic stories, thoughtful campaigns, meaningful
                  connections.
                </figcaption>
              </figure>
            </CometCard>
          </div>
        </section>

        <PreparedVideoWork />

        <CareerJourney />

        <AcademicJourney />

        <AcademicProjects />

        <section className="values-section" aria-label="Creative values">
          <div className="values-cloud">
            <p className="values-quote">
              “Creating with
              <br />
              <em>purpose.</em>
              <br />
              Communicating
              <br />
              with <em>impact.</em>”
            </p>
            {valueWords.map((word) => (
              <button
                aria-label={`${word.text}: ${word.description}`}
                className={`values-word ${word.className}`}
                data-description={word.description}
                key={word.text}
                type="button"
              >
                {word.text}
              </button>
            ))}
          </div>
        </section>

        <section
          aria-label="Marketing journey statement"
          className="creative-journey-quote"
          id="creative-journey-quote"
        >
          <blockquote>
            <span>Every project, campaign, and experience represents</span>{" "}
            <span>a step in my journey of becoming a marketing</span>{" "}
            <span>professional who believes the best ideas begin with</span>{" "}
            <span>understanding people.</span>
          </blockquote>
        </section>

        <ContactSection />
      </main>
    </>
  );
}

import Image from "next/image";

import { AcademicJourney } from "@/components/academic-journey";
import { AcademicProjects } from "@/components/academic-projects";
import { CareerJourney } from "@/components/career-journey";
import { CommunicationEngagement } from "@/components/communication-engagement";
import { CreativePlanning } from "@/components/creative-planning";
import { IntroGate } from "@/components/intro-gate";
import { PlanningCoordinationExecution } from "@/components/planning-coordination-execution";
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

export default function Home() {
  return (
    <>
      <IntroGate />
      <main className="portfolio-shell overflow-hidden">
        <section className="landing-poster-hero" aria-labelledby="hero-heading">
          <nav className="hero-nav" aria-label="Portfolio navigation">
            <a className="hero-wordmark" href="#top" aria-label="Tien Vu — back to top">
              TIEN VU
            </a>
            <div className="hero-nav-links">
              <a href="#about-me">About</a>
              <a href="#projects">Work</a>
              <a href="#career-journey">Journey</a>
              <a href="#contact">Contact</a>
            </div>
          </nav>

          <div className="hero-canvas" id="top">
            <h1 className="hero-name" id="hero-heading" aria-label="Tien Vu">
              <span className="hero-name-tien">TIEN</span>
              <span className="hero-name-vu">VU</span>
            </h1>

            <div className="hero-portrait" aria-hidden="true">
              <Image
                alt=""
                fill
                priority
                sizes="(max-width: 760px) 72vw, 42vw"
                src="/assets/portfolio/01-3f13db76583904558f599e31d592f75d.png"
              />
            </div>

            <div className="hero-intro">
              <p className="hero-disciplines">Marketing · Public Relations · Content</p>
              <p className="hero-statement">
                I turn ideas into stories<br />people want to be part of.
              </p>
              <a className="hero-cta" href="#projects">
                <span>Explore selected work</span>
                <svg aria-hidden="true" viewBox="0 0 48 18">
                  <path d="M1 9h43M36 2l8 7-8 7" />
                </svg>
              </a>
            </div>

            <p className="hero-note">
              curious by nature,<br />thoughtful by design.
            </p>

            <div className="hero-contact-sheet" aria-hidden="true">
              <span className="hero-tape" />
              {[
                ["/assets/portfolio/communication-camera-setup.jpg", "A camera setup"],
                ["/assets/portfolio/02-b359602793bc1f8ac986f2fd920b5133.png", "Tien taking a photo"],
                ["/assets/portfolio/05-c962811ebeb9a1addf8088e950abb909.png", "Tien holding a Swinburne certificate"],
                ["/assets/portfolio/hero-contact-tet-am-team-v2.png", "Tien with the Tết Ấm volunteer team"],
              ].map(([src, alt]) => (
                <div className="hero-contact-frame" key={src}>
                  <Image alt={alt} fill sizes="12vw" src={src} />
                </div>
              ))}
            </div>

            <p className="hero-edition">Portfolio 2026</p>
          </div>
        </section>

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

        <section className="about-section" id="about-me" aria-labelledby="about-heading">
          <div className="about-inner">
            <div className="about-copy">
              <p className="about-kicker">About Me</p>
              <h2 className="about-heading" id="about-heading">
                Hello! I&apos;m Tien.
              </h2>
              <div className="about-body">
                <p>
                  I&apos;m a content creator and aspiring marketing professional
                  based in Melbourne.
                </p>
                <p>
                  I believe effective marketing starts with understanding
                  people. That&apos;s why I&apos;m passionate about creating
                  authentic stories, engaging digital experiences, and campaigns
                  that build meaningful connections.
                </p>
                <p>
                  I love finding simple ideas that make a real impact. I&apos;m
                  always eager to learn, collaborate, and create work that is
                  both creative and purposeful.
                </p>
              </div>
              <div className="about-tags" aria-label="Tien Vu focus areas">
                <span>Content Creator</span>
                <span>Marketing</span>
                <span>Melbourne</span>
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

        <AcademicJourney />

        <AcademicProjects />

        <CareerJourney />

        <CommunicationEngagement />

        <PlanningCoordinationExecution />

        <CreativePlanning />

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

        <section aria-label="Contact Tien Vu" id="contact">
          <Image
            alt="Let's create meaningful communication together — contact Jocasta Vu Tien by email or phone"
            className="block h-auto w-full"
            height={1138}
            sizes="100vw"
            src="/assets/portfolio/contact-lets-create-v2.png"
            width={1898}
          />
        </section>
      </main>
    </>
  );
}

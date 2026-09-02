import Image from "next/image";
import { ExternalLink, HeartHandshake } from "lucide-react";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { LayoutGrid } from "@/components/ui/layout-grid";
import {
  careerJourneyProjects,
  type CareerJourneyMedia,
  type CareerJourneyProject,
} from "@/lib/portfolio-data";

function CareerJourneyCopy({
  index,
  project,
}: {
  index: number;
  project: CareerJourneyProject;
}) {
  return (
    <div className="career-journey-copy">
      <p className="career-journey-index">
        <HeartHandshake aria-hidden="true" />
        Project {String(index + 1).padStart(2, "0")}
      </p>
      <div className="career-journey-title-row">
        <a
          className="career-journey-title-link"
          href={project.href}
          rel="noreferrer"
          target="_blank"
        >
          {project.title}
          <ExternalLink aria-hidden="true" />
        </a>
        {project.projectHref && project.projectTitle ? (
          <>
            <span className="career-journey-title-separator" aria-hidden="true">
              –
            </span>
            <a
              className="career-journey-title-link career-journey-project-link"
              href={project.projectHref}
              rel="noreferrer"
              target="_blank"
            >
              {project.projectTitle}
              <ExternalLink aria-hidden="true" />
            </a>
          </>
        ) : null}
      </div>
      <p className="career-journey-role">
        {project.role}
        <span>{project.period}</span>
      </p>

      <div className="career-journey-body">
        {project.summary.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <dl className="career-journey-highlights">
        {project.highlights.map((highlight) => (
          <div key={highlight.value}>
            <dt>{highlight.value}</dt>
            <dd>{highlight.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function SwinburneImageTile({
  className,
  item,
  priority = false,
  sizes,
}: {
  className: string;
  item: CareerJourneyMedia;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <figure className={`career-swinburne-media-tile ${className}`}>
      <Image
        alt={item.alt}
        className="career-swinburne-media-image"
        fill
        priority={priority}
        sizes={sizes}
        src={item.thumbnail}
      />
      <figcaption className="sr-only">{item.title}</figcaption>
    </figure>
  );
}

function SwinburneMediaBoard({
  media,
  video,
}: {
  media: CareerJourneyMedia[];
  video: NonNullable<CareerJourneyProject["video"]>;
}) {
  const [profile, experienceDay, gordonPost, team] = media;

  if (!profile || !experienceDay || !gordonPost || !team) {
    return null;
  }

  return (
    <div
      className="career-swinburne-board"
      aria-label="Swinburne Vietnam selected work"
    >
      <SwinburneImageTile
        className="career-swinburne-profile"
        item={profile}
        priority
        sizes="(max-width: 1020px) 88vw, 52vw"
      />
      <SwinburneImageTile
        className="career-swinburne-post"
        item={experienceDay}
        sizes="(max-width: 640px) 42vw, (max-width: 1020px) 38vw, 22vw"
      />
      <figure className="career-swinburne-video-frame">
        <div className="career-swinburne-phone">
          <video
            aria-label={video.alt}
            className="career-swinburne-video"
            controls
            muted
            playsInline
            poster={video.poster}
            preload="metadata"
          >
            <source src={video.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <figcaption className="sr-only">{video.title}</figcaption>
      </figure>
      <SwinburneImageTile
        className="career-swinburne-post"
        item={gordonPost}
        sizes="(max-width: 640px) 42vw, (max-width: 1020px) 38vw, 22vw"
      />
      <SwinburneImageTile
        className="career-swinburne-team"
        item={team}
        sizes="(max-width: 1020px) 88vw, 52vw"
      />
    </div>
  );
}

export function CareerJourney() {
  return (
    <section
      aria-labelledby="career-journey-heading"
      className="career-journey-section"
      id="career-journey"
    >
      <div className="career-journey-inner">
        <div className="career-journey-heading">
          <p>My Career Journey</p>
          <h2 id="career-journey-heading">My Career Journey</h2>
          <span>
            A journey through child-focused storytelling, video production,
            social content, and creative work that connects with people.
          </span>
        </div>

        {careerJourneyProjects.map((project, index) => (
          <article
            className={`career-journey-project ${
              project.video && project.media?.length === 4
                ? "career-journey-project-swinburne"
                : ""
            }`}
            key={project.title}
          >
            {project.video && project.media?.length === 4 ? (
              <>
                <SwinburneMediaBoard
                  media={project.media}
                  video={project.video}
                />
                <CareerJourneyCopy index={index} project={project} />
              </>
            ) : (
              <>
                <CareerJourneyCopy index={index} project={project} />
                {project.video || project.media ? (
                  <div className="career-journey-showcase">
                    {project.media ? (
                      <LayoutGrid
                        cards={project.media}
                        className="career-journey-media"
                        variant={project.mediaVariant}
                      />
                    ) : null}
                    {project.video ? (
                      <ContainerScroll
                        className="career-journey-video"
                        titleComponent={
                          <div className="career-video-heading">
                            <p>{project.video.title}</p>
                            <span>{project.video.caption}</span>
                          </div>
                        }
                      >
                        <video
                          aria-label={project.video.alt}
                          className="career-video"
                          controls
                          muted
                          playsInline
                          poster={project.video.poster}
                          preload="metadata"
                          src={project.video.src}
                        />
                      </ContainerScroll>
                    ) : null}
                  </div>
                ) : null}
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

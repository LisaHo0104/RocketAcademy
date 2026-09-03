import { ExternalLink, HeartHandshake, MoveRight } from "lucide-react";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { LayoutGrid } from "@/components/ui/layout-grid";
import { DecorativeStars } from "@/components/decorative-stars";
import { LegoSticker } from "@/components/lego-sticker-parade";
import {
  careerJourneyProjects,
  type CareerJourneyMedia,
  type CareerJourneyProject,
} from "@/lib/portfolio-data";

function CareerJourneyCopy({
  index,
  project,
  showVideoCallout,
}: {
  index: number;
  project: CareerJourneyProject;
  showVideoCallout?: boolean;
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

      {showVideoCallout ? (
        <aside className="career-video-watch-callout">
          <p>Click to watch the videos</p>
          <MoveRight aria-hidden="true" className="career-video-watch-arrow" />
        </aside>
      ) : null}
    </div>
  );
}

function WhizKidVideo({ item }: { item: CareerJourneyMedia }) {
  if (!item.videoSrc) {
    return null;
  }

  return (
    <figure className="career-whizkid-video-frame">
      <video
        aria-label={item.alt}
        className="career-whizkid-video"
        controls
        playsInline
        poster={item.thumbnail}
        preload="metadata"
        src={item.videoSrc}
      />
      <figcaption className="sr-only">{item.title}</figcaption>
    </figure>
  );
}

function CareerVideoGallery({
  videos,
}: {
  videos: NonNullable<CareerJourneyProject["videoGallery"]>;
}) {
  return (
    <div
      aria-label="More video work from Swinburne Vietnam HCMC"
      className="career-video-gallery"
    >
      {videos.map((video) => (
        <figure className="career-video-gallery-card" key={video.src}>
          <video
            aria-label={video.alt}
            controls
            playsInline
            poster={video.poster}
            preload="metadata"
            src={video.src}
          />
          <figcaption>{video.title}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function CareerFeaturedVideo({
  video,
}: {
  video: NonNullable<CareerJourneyProject["video"]>;
}) {
  return (
    <figure className="career-featured-video">
      <video
        aria-label={video.alt}
        controls
        muted={video.muted}
        playsInline
        poster={video.poster}
        preload="metadata"
        src={video.src}
      />
      <figcaption>
        <p>{video.title}</p>
        <span>{video.caption}</span>
      </figcaption>
    </figure>
  );
}

export function CareerJourney() {
  return (
    <section
      aria-labelledby="career-journey-heading"
      className="career-journey-section"
      id="career-journey"
    >
      <DecorativeStars className="decorative-stars-career" />
      <LegoSticker className="lego-sticker-placement-career" variant="clapper" />
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
              project.mediaVariant === "portrait-grid"
                ? "career-journey-project-whizkid"
                : ""
            } ${
              "videoGallery" in project
                ? "career-journey-project-swinburne-videos"
                : ""
            }`}
            key={project.title}
          >
            {"videoGallery" in project &&
            project.videoGallery &&
            project.video ? (
              <>
                <CareerJourneyCopy index={index} project={project} />
                <CareerFeaturedVideo video={project.video} />
                <CareerVideoGallery videos={project.videoGallery} />
              </>
            ) : project.mediaVariant === "portrait-grid" && project.media ? (
              <>
                <CareerJourneyCopy index={index} project={project} />
                <WhizKidVideo
                  item={
                    project.media.find((item) => item.videoSrc) ??
                    project.media[project.media.length - 1]
                  }
                />
                <LayoutGrid
                  cards={project.media.filter((item) => !item.videoSrc)}
                  className="career-whizkid-gallery"
                  variant="portrait-grid"
                />
              </>
            ) : (
              <>
                <CareerJourneyCopy
                  index={index}
                  project={project}
                  showVideoCallout={
                    (project.media?.filter((item) => item.videoSrc).length ??
                      0) > 1
                  }
                />
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
                          muted={project.video.muted}
                          playsInline
                          poster={project.video.poster}
                          preload="metadata"
                          src={project.video.src}
                        />
                      </ContainerScroll>
                    ) : null}
                    {"videoGallery" in project && project.videoGallery ? (
                      <CareerVideoGallery videos={project.videoGallery} />
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

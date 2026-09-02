import Image from "next/image";

import { Timeline, type TimelineEntry } from "@/components/ui/timeline";
import {
  academicEntries,
  type AcademicEntry,
  type AcademicImageEntry,
} from "@/lib/portfolio-data";

function hasImageArtifact(entry: AcademicEntry): entry is AcademicImageEntry {
  return "image" in entry;
}

function AcademicEntryCard({ entry }: { entry: AcademicEntry }) {
  return (
    <article className="academic-entry-card">
      <div className="academic-entry-copy">
        <p className="academic-entry-context">{entry.context}</p>
        <h3>{entry.title}</h3>
        <p className="academic-entry-highlight">{entry.highlight}</p>
        <p className="academic-entry-body">{entry.body}</p>
      </div>

      {hasImageArtifact(entry) ? (
        <figure
          className={`academic-artifact academic-artifact-${entry.artifact}`}
        >
          <span className="academic-artifact-tape" aria-hidden="true" />
          <div className="academic-artifact-image">
            <Image
              alt={entry.alt}
              className={
                entry.artifact === "photo" ? "object-cover" : "object-contain"
              }
              fill
              sizes="(max-width: 768px) 76vw, (max-width: 1200px) 38vw, 460px"
              src={entry.image}
            />
          </div>
        </figure>
      ) : (
        <div className="academic-gpa-note paper-grain">
          <span>{entry.note.headline}</span>
          <small>{entry.note.caption}</small>
        </div>
      )}
    </article>
  );
}

const timelineData: TimelineEntry[] = academicEntries.map((entry) => ({
  content: <AcademicEntryCard entry={entry} />,
  title: entry.year,
}));

export function AcademicJourney() {
  return (
    <section
      aria-labelledby="academic-heading"
      className="academic-section"
      id="academic"
    >
      <Timeline
        className="academic-timeline"
        data={timelineData}
        header={
          <div className="academic-timeline-header">
            <p>Academic Journey</p>
            <h2 id="academic-heading">My academic Journey</h2>
            <span>
              A scroll-through record of scholarships, public relations unit
              awards, and final-year momentum at Swinburne.
            </span>
          </div>
        }
      />
    </section>
  );
}

import Image from "next/image";

const communicationPillars = [
  "In-depth interviewing and active listening",
  "Meeting recap, follow-up, and action alignment",
  "Audience-focused communication",
];

const communicationImages = [
  {
    alt: "Audio editing screen used for interview and listening work",
    className: "communication-shot-audio",
    src: "/assets/portfolio/communication-audio-editing.png",
  },
  {
    alt: "Tien studying with a laptop while listening to interview material",
    className: "communication-shot-study",
    src: "/assets/portfolio/communication-study-interview.jpg",
  },
  {
    alt: "Google Doc review with highlighted notes and comments",
    className: "communication-shot-doc",
    src: "/assets/portfolio/communication-google-doc-review.png",
  },
  {
    alt: "Audience seated during a professional presentation",
    className: "communication-shot-recap",
    src: "/assets/portfolio/communication-event-recap.png",
  },
  {
    alt: "Tien wearing headphones during an active listening activity",
    className: "communication-shot-listening",
    src: "/assets/portfolio/communication-active-listening.jpg",
  },
  {
    alt: "Debate and stakeholder engagement group photo",
    className: "communication-shot-debate",
    src: "/assets/portfolio/communication-debate-group.jpg",
  },
  {
    alt: "Feedback on a communication project submission",
    className: "communication-shot-feedback",
    src: "/assets/portfolio/communication-feedback-love-shield.png",
  },
  {
    alt: "Tien presenting during a communication training session",
    className: "communication-shot-training",
    src: "/assets/portfolio/communication-training-presentation.png",
  },
  {
    alt: "Swinburne event venue with guests and registration setup",
    className: "communication-shot-event",
    src: "/assets/portfolio/communication-swinburne-event.png",
  },
  {
    alt: "Tien engaging with a young community audience member",
    className: "communication-shot-community",
    src: "/assets/portfolio/communication-community-audience.jpg",
  },
  {
    alt: "Tien setting up a camera for audience-focused content",
    className: "communication-shot-camera",
    src: "/assets/portfolio/communication-camera-setup.jpg",
  },
  {
    alt: "Community team group photo after an engagement activity",
    className: "communication-shot-team",
    src: "/assets/portfolio/communication-team-community.jpg",
  },
  {
    alt: "Tien smiling in a stakeholder conversation",
    className: "communication-shot-conversation",
    src: "/assets/portfolio/communication-stakeholder-conversation.jpg",
  },
];

export function CommunicationEngagement() {
  return (
    <section
      aria-labelledby="communication-engagement-heading"
      className="communication-engagement-section"
      id="communication-engagement"
    >
      <div className="communication-title-band">
        <h2 id="communication-engagement-heading">
          Communication &amp; Stakeholder Engagement
        </h2>
      </div>

      <div className="communication-inner">
        <div className="communication-pillars" aria-label="Communication skills">
          {communicationPillars.map((pillar) => (
            <p key={pillar}>{pillar}</p>
          ))}
        </div>

        <div
          aria-label="Communication and stakeholder engagement collage"
          className="communication-collage"
        >
          <div className="communication-gpa-strip" aria-label="Academic GPA note">
            <span>
              GPA Study Period HED - GPA (Period) for Semester 1 (2026) of 4.00
              (Last calculated 03-Jul-2026)
            </span>
            <span>
              GPA Year HED - GPA (Year) for 2026 of 4.00 (Last calculated
              03-Jul-2026)
            </span>
          </div>

          {communicationImages.map((image, index) => (
            <figure
              className={`communication-shot ${image.className}`}
              key={image.src}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <Image
                alt={image.alt}
                className="communication-shot-image"
                fill
                sizes="(max-width: 760px) 46vw, (max-width: 1100px) 30vw, 20vw"
                src={image.src}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

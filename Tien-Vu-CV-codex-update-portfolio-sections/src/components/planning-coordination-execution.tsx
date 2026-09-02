import Image from "next/image";

export function PlanningCoordinationExecution() {
  return (
    <section
      aria-labelledby="planning-coordination-heading"
      className="planning-coordination-section planning-coordination-image-section"
      id="planning-coordination-execution"
      style={{ lineHeight: 0, padding: 0 }}
    >
      <h2 className="sr-only" id="planning-coordination-heading">
        Planning, Coordination &amp; Execution
      </h2>
      <Image
        alt="Planning, Coordination and Execution portfolio board showing project timelines, event schedules, vendor coordination, logistics, and problem-solving"
        className="planning-coordination-image"
        height={1354}
        sizes="100vw"
        src="/assets/portfolio/planning-coordination-execution.png"
        width={2516}
      />
    </section>
  );
}

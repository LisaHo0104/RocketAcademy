import { DecorativeStars } from "@/components/decorative-stars";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { academicProjects } from "@/lib/portfolio-data";

export function AcademicProjects() {
  return (
    <section
      aria-labelledby="academic-projects-heading"
      className="academic-projects-section"
      id="projects"
    >
      <DecorativeStars className="decorative-stars-academic-projects" />
      <div className="academic-projects-inner">
        <div className="academic-projects-heading">
          <p>Academic Projects</p>
          <h2 id="academic-projects-heading">Academic Projects</h2>
          <span>
            Five campaign proposals exploring public relations, integrated
            marketing communications, digital strategy, and social change.
          </span>
        </div>

        <AnimatedTestimonials
          autoplay
          className="academic-projects-carousel"
          testimonials={academicProjects}
        />
      </div>
    </section>
  );
}

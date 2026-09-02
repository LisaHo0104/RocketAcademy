import Image from "next/image";
import { ArrowUpRight, Mail, Phone } from "lucide-react";

export function ContactSection() {
  return (
    <section
      aria-labelledby="contact-heading"
      className="contact-section"
      id="contact"
    >
      <div aria-hidden="true" className="contact-floating-brick contact-floating-brick-red" />
      <div aria-hidden="true" className="contact-floating-brick contact-floating-brick-blue" />

      <div className="contact-inner">
        <div className="contact-copy">
          <p className="contact-kicker">
            <span aria-hidden="true" />
            Let&apos;s build something great
          </p>

          <h2 className="contact-heading" id="contact-heading">
            <span>Let&apos;s create</span>
            <strong>meaningful</strong>
            <span>communication</span>
            <em>together.</em>
          </h2>

          <p className="contact-intro">
            Have an idea, a campaign or a story to tell? I&apos;d love to hear
            about it.
          </p>

          <address className="contact-actions">
            <a className="contact-action contact-action-email" href="mailto:jocastavutien@gmail.com">
              <span className="contact-action-icon" aria-hidden="true">
                <Mail strokeWidth={2.5} />
              </span>
              <span>
                <small>Email me</small>
                jocastavutien@gmail.com
              </span>
              <ArrowUpRight aria-hidden="true" className="contact-action-arrow" />
            </a>

            <a className="contact-action contact-action-phone" href="tel:+61404715735">
              <span className="contact-action-icon" aria-hidden="true">
                <Phone strokeWidth={2.5} />
              </span>
              <span>
                <small>Call me</small>
                +61 404 715 735
              </span>
              <ArrowUpRight aria-hidden="true" className="contact-action-arrow" />
            </a>
          </address>
        </div>

        <div className="contact-portrait-wrap">
          <div aria-hidden="true" className="contact-portrait-studs">
            {Array.from({ length: 8 }, (_, index) => (
              <span key={index} />
            ))}
          </div>
          <figure className="contact-portrait-card">
            <div className="contact-portrait-image">
              <Image
                alt="Tien Vu"
                height={735}
                sizes="(max-width: 760px) 82vw, 38vw"
                src="/assets/portfolio/contact-tien-portrait.jpg"
                width={560}
              />
            </div>
            <figcaption>
              <span className="contact-status-dot" aria-hidden="true" />
              Open to creative collaborations
            </figcaption>
          </figure>
          <div aria-hidden="true" className="contact-mini-bricks">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <div className="contact-footer">
        <span>Tien Vu · Portfolio 2026</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </section>
  );
}

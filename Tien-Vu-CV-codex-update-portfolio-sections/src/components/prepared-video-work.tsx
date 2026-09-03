import { DecorativeStars } from "@/components/decorative-stars";

import styles from "./prepared-video-work.module.css";

const videos = [
  {
    label: "Prepared video work sample 1",
    poster: "/assets/prepared-video-work/prepared-video-01-poster.jpg",
    src: "/assets/prepared-video-work/prepared-video-01.mp4",
  },
  {
    label: "Prepared video work sample 2",
    poster: "/assets/prepared-video-work/prepared-video-02-poster.jpg",
    src: "/assets/prepared-video-work/prepared-video-02.mp4",
  },
  {
    label: "Prepared video work sample 3",
    poster: "/assets/prepared-video-work/prepared-video-03-poster.jpg",
    src: "/assets/prepared-video-work/prepared-video-03.mp4",
  },
];

export function PreparedVideoWork() {
  return (
    <section
      aria-labelledby="prepared-video-work-heading"
      className={styles.section}
      id="prepared-video-work"
    >
      <DecorativeStars className="decorative-stars-prepared" />
      <div className={styles.inner}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>Selected vertical content</p>
          <h2 className={styles.title} id="prepared-video-work-heading">
            Prepared Video Work
          </h2>
          <p className={styles.intro}>
            Short-form stories prepared for social platforms, presented in the
            format they were made to be watched in.
          </p>
        </header>

        <div className={styles.phones}>
          {videos.map((video) => (
            <div className={styles.phone} key={video.src}>
              <div className={styles.screen}>
                <video
                  aria-label={video.label}
                  className={styles.video}
                  controls
                  playsInline
                  poster={video.poster}
                  preload="metadata"
                >
                  <source src={video.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

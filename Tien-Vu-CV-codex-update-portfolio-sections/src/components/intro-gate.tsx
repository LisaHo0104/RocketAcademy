"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";

const LegoIntroScene = dynamic(
  () => import("@/components/lego-intro-scene").then((mod) => mod.LegoIntroScene),
  {
    loading: () => <div className="lego-intro-loading" />,
    ssr: false,
  },
);

type WindowWithAudio = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

function playMouseClick(delay = 0) {
  window.setTimeout(() => {
    const AudioContextClass =
      window.AudioContext || (window as WindowWithAudio).webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    const audio = new AudioContextClass();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(320, audio.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(118, audio.currentTime + 0.07);
    gain.gain.setValueAtTime(0.0001, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, audio.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.055);

    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.08);
    window.setTimeout(() => void audio.close(), 120);
  }, delay);
}

export function IntroGate() {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [rotationTurns, setRotationTurns] = useState(3);
  const sectionLabels = ["Skills", "Contacts", "Work Projects", "Work Experience"];
  const activeSection = ((rotationTurns % sectionLabels.length) + sectionLabels.length) % sectionLabels.length;
  const previousSection = (activeSection + 1) % sectionLabels.length;
  const nextSection = (activeSection - 1 + sectionLabels.length) % sectionLabels.length;

  function rotateScene(direction: 1 | -1) {
    if (started) return;
    playMouseClick();
    setRotationTurns((turns) => turns + direction);
  }

  function startIntro() {
    if (started) {
      return;
    }

    setStarted(true);
    playMouseClick();
    playMouseClick(120);

    window.setTimeout(() => {
      setFinished(true);
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 1050);
  }

  return (
    <AnimatePresence>
      {!finished ? (
        <motion.div
          className="lego-intro-overlay fixed inset-0 z-50 overflow-hidden"
          data-testid="intro-gate"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        >
          <LegoIntroScene rotationTurns={rotationTurns} started={started} />

          <button
            aria-label={`Previous scene: ${sectionLabels[previousSection]}`}
            className="lego-intro-side lego-intro-side-left"
            disabled={started}
            onClick={() => rotateScene(1)}
            type="button"
          >
            <span className="lego-intro-arrow">
              <svg aria-hidden="true" viewBox="0 0 20 28">
                <path
                  d="M15.5 3.5 5 14l10.5 10.5"
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  strokeWidth="3.5"
                />
              </svg>
            </span>
            <span>{sectionLabels[previousSection]}</span>
          </button>
          <button
            aria-label={`Next scene: ${sectionLabels[nextSection]}`}
            className="lego-intro-side lego-intro-side-right"
            disabled={started}
            onClick={() => rotateScene(-1)}
            type="button"
          >
            <span>{sectionLabels[nextSection]}</span>
            <span className="lego-intro-arrow">
              <svg aria-hidden="true" viewBox="0 0 20 28">
                <path
                  d="m4.5 3.5 10.5 10.5L4.5 24.5"
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  strokeWidth="3.5"
                />
              </svg>
            </span>
          </button>

          <motion.button
            animate={started ? { opacity: 0, y: 14, scale: 0.94 } : { opacity: 1, y: 0, scale: 1 }}
            aria-label="Enter Tien Vu portfolio"
            className="lego-intro-action"
            data-testid="enter-portfolio"
            onClick={startIntro}
            style={{ pointerEvents: started ? "none" : "auto" }}
            tabIndex={started ? -1 : 0}
            type="button"
          >
            <span>{started ? "Building..." : "Enter Portfolio"}</span>
            <svg aria-hidden="true" viewBox="0 0 28 28">
              <path d="M6 14h15M15 8l6 6-6 6" />
            </svg>
          </motion.button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

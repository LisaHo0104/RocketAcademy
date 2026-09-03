type DecorativeStarsProps = {
  className: string;
};

const starPath =
  "M50 8 61.8 35.6 91.8 38.4 69 58.2 75.8 87.2 50 72 24.2 87.2 31 58.2 8.2 38.4 38.2 35.6Z";

export function DecorativeStars({ className }: DecorativeStarsProps) {
  return (
    <div aria-hidden="true" className={`decorative-stars ${className}`}>
      {Array.from({ length: 3 }, (_, index) => (
        <span className={`decorative-star decorative-star-${index + 1}`} key={index}>
          <svg viewBox="0 0 100 100">
            <path
              d={starPath}
              fill="currentColor"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="12"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}

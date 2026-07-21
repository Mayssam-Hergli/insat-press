"use client";

import { useState } from "react";
import MediaImage from "./MediaImage";

export type MediaCarouselImage = {
  id: string;
  src: string | null;
  alt: string | null;
  label: string;
  caption: string | null;
};

type MediaCarouselProps = {
  images: MediaCarouselImage[];
};

export default function MediaCarousel({ images }: MediaCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  if (images.length === 0) {
    return null;
  }

  const safeIndex = Math.min(activeIndex, images.length - 1);
  const activeImage = images[safeIndex];

  const goPrevious = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const goNext = () => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  const handleTouchEnd = (x: number) => {
    if (touchStart === null) return;
    const distance = touchStart - x;
    if (distance > 50) goNext();
    if (distance < -50) goPrevious();
    setTouchStart(null);
  };

  return (
    <section className="mt-12 rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)] p-5 md:p-7">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-hand text-5xl font-bold leading-none text-[var(--press-red)]">
            Gallery
          </p>

          <p className="mt-2 text-base font-semibold text-[var(--ink)]">
            {safeIndex + 1} / {images.length}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={goPrevious}
            className="btn-editorial btn-editorial-sm"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={goNext}
            className="btn-editorial btn-editorial-sm"
          >
            Next
          </button>
        </div>
      </div>

      <div
        onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
        onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0].clientX)}
      >
        <MediaImage
          path={activeImage.src}
          alt={activeImage.alt ?? activeImage.label}
          label={activeImage.label}
          sizes="(min-width: 768px) 60vw, 100vw"
          className="h-[22rem] w-full rounded-[1.2rem] md:h-[30rem]"
        />
      </div>

      {activeImage.caption && (
        <p className="mt-3 text-base font-semibold text-[var(--ink)]">
          {activeImage.caption}
        </p>
      )}

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-16 min-w-24 rounded-xl border px-3 text-sm font-black transition ${
              safeIndex === index
                ? "border-[var(--press-red)] bg-[rgba(130,27,22,0.08)] text-[var(--press-red)]"
                : "border-[var(--line)] bg-[rgba(255,248,243,0.28)] text-[var(--muted)]"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  );
}

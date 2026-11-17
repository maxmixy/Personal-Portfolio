"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export interface SlideshowImage {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

interface ImageSlideshowProps {
  images: SlideshowImage[];
  label: string;
  aspectRatio?: string;
  fit?: "cover" | "contain";
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export default function ImageSlideshow({
  images,
  label,
  aspectRatio = "3 / 2",
  fit = "contain",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  className = "",
}: ImageSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (images.length < 2 || paused || isHovering || isFocused || reducedMotion) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [images.length, isFocused, isHovering, paused, reducedMotion]);

  if (images.length === 0) return null;

  const activeImage = images[activeIndex];
  const moveTo = (index: number) => {
    setPaused(true);
    setActiveIndex((index + images.length) % images.length);
  };

  return (
    <div
      className={`image-slideshow ${className}`.trim()}
      role="region"
      aria-label={label}
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsFocused(false);
        }
      }}
    >
      <div className="image-slideshow-frame" style={{ aspectRatio }}>
        <Image
          key={activeImage.src}
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          priority={priority && activeIndex === 0}
          sizes={sizes}
          className={fit === "cover" ? "image-slideshow-image object-cover" : "image-slideshow-image object-contain"}
        />
      </div>

      <div className="image-slideshow-caption" aria-live={paused || reducedMotion ? "polite" : "off"}>
        <span>{activeImage.caption}</span>
        <span className="image-slideshow-count" aria-hidden="true">
          {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
      </div>

      {images.length > 1 && (
        <div className="image-slideshow-controls">
          <div className="image-slideshow-navigation">
            <button type="button" onClick={() => moveTo(activeIndex - 1)} aria-label="Previous image">
              Previous
            </button>
            <button type="button" onClick={() => moveTo(activeIndex + 1)} aria-label="Next image">
              Next
            </button>
          </div>
          <div className="image-slideshow-dots" role="group" aria-label="Choose an image">
            {images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                className={index === activeIndex ? "is-active" : ""}
                onClick={() => moveTo(index)}
                aria-label={`Show image ${index + 1}: ${image.caption}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            className="image-slideshow-play"
            onClick={() => setPaused((value) => !value)}
            disabled={reducedMotion}
            aria-label={reducedMotion ? "Automatic slideshow disabled by reduced motion setting" : paused ? "Play slideshow" : "Pause slideshow"}
          >
            {reducedMotion ? "Manual" : paused ? "Play" : "Pause"}
          </button>
        </div>
      )}
    </div>
  );
}

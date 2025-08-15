import { useState, useEffect, useRef } from "react";

interface ImageWithFallbackProps {
  readonly src: string;
  readonly alt?: string; // alt devient optionnel
  readonly className?: string;
  readonly fallback?: string;
}

export function ImageWithFallback({
  src,
  alt = "",
  className = "",
  fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e5e7eb'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z'/%3E%3C/svg%3E",
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(fallback);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const img = new Image();
    img.src = src;
    img.onload = () => setImgSrc(src);
    img.onerror = () => setImgSrc(fallback);
  }, [src, fallback, isVisible]);

  return <img ref={imgRef} src={imgSrc} alt={alt} className={className} />;
}

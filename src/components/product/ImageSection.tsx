import { useState, useRef } from "react";
import type { Product } from "@/types/product";

export function ImageSection({ card }: { card: Product }) {
  const { print_url_large, images, name } = card;
  const allImages = print_url_large
    ? [{ image_url: print_url_large }, ...(images ?? [])]
    : (images ?? []);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = allImages[selectedIndex]?.image_url;
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
  };

  const handleMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    if (innerRef.current) {
      innerRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  };

  const handleLeave = () => {
    if (innerRef.current) {
      innerRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
  };

  if (allImages.length === 0) {
    return (
      <div
        className="w-full aspect-2.5/3.5 rounded-lg flex items-center justify-center
          glass-card text-on-surface-variant/60 text-sm"
      >
        <span className="material-symbols-outlined text-[32px]">
          image_not_supported
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-2 relative rounded-lg">
      <div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="bg-gray-100 relative w-full cursor-pointer overflow-hidden rounded-2xl"
        style={{
          perspective: "800px",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          ref={innerRef}
          className="relative w-full transition-transform duration-200 ease-out will-change-transform px-5 py-6"
          style={{ transformStyle: "preserve-3d" }}
        >
          <img
            src={selectedImage ?? ""}
            alt={name}
            className="block w-full aspect-2.5/3.5 object-contain"
          />
        </div>
      </div>
      {allImages.length > 1 && (
        <div className="bg-gray-100 rounded-lg flex flex-wrap gap-2 p-2">
          {allImages.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(index)}
              className={
                "h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors " +
                (index === selectedIndex
                  ? "border-gray-400 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300")
              }
            >
              <img
                src={img.image_url}
                alt={`${name} - ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

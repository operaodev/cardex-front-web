import { useState } from "react";
import type { RelatedCardDTO } from "@/types/product";
import { RelatedCard } from "./RelatedCard";

export function RelatedLangFilter({ cards }: { cards: RelatedCardDTO[] }) {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const langs = Array.from(
    new Set(cards.map((c) => c.lang).filter(Boolean)),
  ).sort();

  const filtered =
    selectedLang != null ? cards.filter((c) => c.lang === selectedLang) : cards;

  const handleToggle = (lang: string) => {
    setSelectedLang(selectedLang === lang ? null : lang);
    setShowAll(false);
  };

  const visible =
    selectedLang == null && filtered.length > 5 && !showAll
      ? filtered.slice(0, 4)
      : filtered;

  return (
    <div className="space-y-3">
      <h2 className="font-display text-xl font-bold text-gray-800">
        Otros idiomas
      </h2>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setSelectedLang(null);
            setShowAll(false);
          }}
          className={
            "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold border transition-colors " +
            (selectedLang == null
              ? "bg-gray-800 text-white border-gray-800"
              : "bg-transparent text-gray-500 border-gray-300 hover:border-gray-400")
          }
        >
          All
        </button>
        {langs.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => handleToggle(lang)}
            className={
              "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold border transition-colors " +
              (selectedLang === lang
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-transparent text-gray-500 border-gray-300 hover:border-gray-400")
            }
          >
            {lang}
          </button>
        ))}
      </div>
      <div className="space-y-1">
        {visible.map((card) => (
          <RelatedCard key={card.id} card={card} />
        ))}
        {selectedLang == null &&
          filtered.length > 4 &&
          (!showAll ? (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="w-full py-2 text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              {filtered.length - 4} resultados más
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className="w-full py-2 text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Mostrar menos
            </button>
          ))}
      </div>
    </div>
  );
}

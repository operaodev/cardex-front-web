import type { RelatedCardDTO } from "@/types/product";
import { Link } from "react-router-dom";

export function RelatedCard({ card }: { card: RelatedCardDTO }) {
  return (
    <Link
      type="button"
      to={`/product/${card.id}`}
      className="w-full flex items-center gap-3 px-4 py-3 text-left
        border border-gray-200 rounded-lg
        hover:bg-gray-50 transition-colors"
    >
      {card.image ? (
        <img
          src={card.image}
          alt={card.name}
          className="h-14 object-contain rounded shrink-0 bg-gray-50"
        />
      ) : (
        <div className="w-10 h-14 rounded bg-gray-100 shrink-0" />
      )}
      <div className="flex flex-col min-w-0 gap-0.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-gray-800 truncate">
            {card.name}
          </span>
        </div>
        {card.code && (
          <span className="text-xs text-gray-400">({card.code})</span>
        )}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          {card.rarity && <span>{card.rarity}</span>}
          {card.lang && <span>({card.lang})</span>}
        </div>
        {card.set_name && (
          <span className="text-[0.7rem] text-gray-400">{card.set_name}</span>
        )}
      </div>
    </Link>
  );
}

import { useState, forwardRef, useImperativeHandle } from "react";
import { Icon } from "@iconify-icon/react";
import type { Product } from "@/types/product";

interface CardListProps {
  cards: Product[];
  multiplier: number;
  setExternalId: string;
  lang: string;
}

export interface CardListItemQty {
  product: {
    id: number;
    name: string;
    set_external_id: string;
    lang: string;
    code?: string;
  };
  quantity: number;
}

export interface CardListRef {
  getQuantities: () => CardListItemQty[];
}

function displayRarity(card: Product): string {
  const parts = [card.rarity, card.rarity_code ? `(${card.rarity_code})` : null]
    .filter(Boolean)
    .join(" ");
  return parts || "-";
}

export const CardList = forwardRef<CardListRef, CardListProps>(
  ({ cards, multiplier, setExternalId, lang }, ref) => {
    const [quantities, setQuantities] = useState<Record<number, number>>({});

    useImperativeHandle(ref, () => ({
      getQuantities: () => {
        return cards
          .map((card) => {
            const qty =
              quantities[card.id] ?? card.quantity_per_set * multiplier;
            if (qty === 0) return null;
            return {
              product: {
                id: card.id,
                name: card.name,
                set_external_id: setExternalId,
                lang: lang,
                code: card.code,
              },
              quantity: qty,
            } as CardListItemQty;
          })
          .filter(Boolean) as CardListItemQty[];
      },
    }));

    if (cards.length === 0) {
      return <p className="text-xs text-gray-400 italic">Sin cartas</p>;
    }

    const getQty = (card: Product): number => {
      if (quantities[card.id] !== undefined) {
        return quantities[card.id];
      }
      return card.quantity_per_set * multiplier;
    };

    const isBonus = (card: Product) => card.quantity_per_set === 0;

    const maxQty = (card: Product): number => {
      if (isBonus(card)) return Infinity;
      return card.quantity_per_set * multiplier;
    };

    const canDecrease = (card: Product) => {
      if (isBonus(card)) return getQty(card) > 0;
      return getQty(card) > 0;
    };

    const canIncrease = (card: Product) => {
      return getQty(card) < maxQty(card);
    };

    const changeQty = (card: Product, delta: number) => {
      const current = getQty(card);
      const next = current + delta;
      if (next < 0) return;
      if (!isBonus(card) && next > maxQty(card)) return;

      const defaultValue = card.quantity_per_set * multiplier;
      if (next === defaultValue) {
        setQuantities((prev) => {
          const next = { ...prev };
          delete next[card.id];
          return next;
        });
      } else {
        setQuantities((prev) => ({ ...prev, [card.id]: next }));
      }
    };

    return (
      <ul className="space-y-1">
        {cards.map((card) => {
          const qty = getQty(card);
          const edited = quantities[card.id] !== undefined;

          return (
            <li
              key={card.id}
              className={`flex items-center justify-between px-3 py-1.5 text-xs
              rounded-md hover:bg-gray-50 transition-colors
              ${edited ? "bg-blue-50/50" : ""}`}
            >
              <div className="flex-1 min-w-0 mr-2">
                <span className="font-medium text-gray-700 truncate block">
                  {card.name}
                </span>
                <span className="text-gray-400">
                  {card.code} · {displayRarity(card)}
                </span>
              </div>

              {/* Cantidad */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => changeQty(card, -1)}
                  disabled={!canDecrease(card)}
                  className="w-5 h-5 flex items-center justify-center text-xs
                  text-gray-500 bg-gray-100 rounded
                  hover:bg-gray-200 disabled:opacity-20 disabled:cursor-not-allowed
                  transition-colors"
                >
                  <Icon icon="mdi:minus" className="text-xs" />
                </button>

                <span
                  className={`text-xs font-semibold min-w-[2ch] text-center tabular-nums
                  ${edited ? "text-blue-600" : "text-gray-500"}`}
                  title={edited ? "Modificado" : undefined}
                >
                  {qty}
                </span>

                <button
                  type="button"
                  onClick={() => changeQty(card, 1)}
                  disabled={!canIncrease(card)}
                  className="w-5 h-5 flex items-center justify-center text-xs
                  text-gray-500 bg-gray-100 rounded
                  hover:bg-gray-200 disabled:opacity-20 disabled:cursor-not-allowed
                  transition-colors"
                >
                  <Icon icon="mdi:plus" className="text-xs" />
                </button>

                {/* Reset button */}
                {edited && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuantities((prev) => {
                        const next = { ...prev };
                        delete next[card.id];
                        return next;
                      });
                    }}
                    className="w-5 h-5 flex items-center justify-center text-[10px]
                    text-blue-500 hover:text-blue-700 transition-colors"
                    title="Restaurar cantidad por defecto"
                  >
                    <Icon icon="mdi:restore" className="text-xs" />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  },
);

import { useEffect, useRef, useState } from "react";
import type { Stock as StockItem } from "@/types/stock";
import { Icon } from "@iconify-icon/react";
import { StockLogsModal } from "@/components/modal/StockLogsModal";
import { StockEditModal } from "@/components/modal/StockEditModal";
import { useCardsBySet } from "@/hooks/useProduct";
import { useOpenBox } from "@/hooks/useStock";
import type { Product } from "@/types/product";
import { CardList, type CardListRef } from "@/components/inventory/CardList";

interface StockProps {
  item: StockItem;
}

export function StockRow({ item }: StockProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const { product } = item;
  const code =
    product.type === "card"
      ? product.code
      : `${product.set_code} | ${product.set_region_code}`;

  const imageUrl =
    product.print_url_large ??
    product.images?.[0]?.image_url ??
    product.set_image_large;

  const displayRarity = [
    product.rarity,
    product.rarity_code ? `(${product.rarity_code})` : null,
    product.edition ? `- ${product.edition}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  // decimal.Decimal de Go viene como string
  const price =
    typeof item.price === "number" ? item.price : Number(item.price);
  const discountPrice =
    typeof item.discount_price === "number"
      ? item.discount_price
      : Number(item.discount_price);
  const hasDiscount = discountPrice > 0 && discountPrice < price;

  return (
    <div className="shadow-md shadow-gray-300 flex flex-col justify-between bg-gray-50 rounded-lg w-full p-5 space-y-3 relative">
      <button
        type="button"
        onClick={() => setShowEdit(true)}
        className="absolute top-1 right-1 p-2 text-2xl text-gray-400 hover:text-gray-800"
        title="Editar"
      >
        <Icon icon="ic-round-edit" />
      </button>
      <img src={imageUrl} alt={product.name} className="h-50 mx-auto mb-5" />

      <h1 className="font-semibold">{product.name}</h1>

      <div className="space-y-0.5">
        <p className="text-gray-600 text-sm">{code}</p>

        {product.type === "card" && (
          <>
            <p className="text-gray-600 text-sm">{displayRarity}</p>
            <p className="text-gray-600 text-sm">{product.set_name}</p>
          </>
        )}

        <p className="text-gray-600 text-sm">
          {product.lang} - {item.condition}
        </p>
      </div>

      {/* Sale / Trade badges */}
      <div className="flex flex-wrap gap-1.5">
        <span
          className="inline-flex items-center px-3 py-1 rounded-full
            text-xs font-semibold bg-gray-700 text-gray-100"
        >
          {item.is_for_sale ? "Venta" : "No venta"}
        </span>
        <span
          className="inline-flex items-center px-3 py-1 rounded-full
            text-xs font-semibold bg-gray-200 text-gray-600"
        >
          {item.is_for_trade ? "Intercambio" : "No intercambio"}
        </span>
      </div>

      {/* Price + quantity */}
      <div className="flex items-end justify-between">
        {price > 0 ? (
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-gray-800">
              {(hasDiscount ? discountPrice : price).toFixed(2)} PEN
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {price.toFixed(2)} PEN
              </span>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-400">Sin precio</span>
        )}
        <span className=" text-gray-500 font-semibold">x{item.quantity}</span>
      </div>
      <button
        className="text-sm font-bold py-2 text-gray-400 hover:text-gray-600"
        onClick={() => setShowLogs(true)}
      >
        Ver historial
      </button>

      {product.type === "set" && (
        <OpenSetButton
          product={product}
          stockId={item.id}
          stockQuantity={item.quantity}
        />
      )}

      <StockEditModal
        open={showEdit}
        stock={item}
        onClose={() => setShowEdit(false)}
      />

      <StockLogsModal
        open={showLogs}
        stock={item}
        onClose={() => setShowLogs(false)}
      />
    </div>
  );
}

/* ── Open Set Modal ────────────────────────────────────────────────────── */

function OpenSetButton({
  product,
  stockId,
  stockQuantity,
}: {
  product: Product;
  stockId: number;
  stockQuantity: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm
          font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700
          transition-colors shadow-sm shadow-green-700/20"
        onClick={() => setOpen(true)}
      >
        <Icon icon="mdi:package-open" className="text-lg" />
        Abrir set
      </button>

      {open && (
        <OpenSetModal
          product={product}
          stockId={stockId}
          stockQuantity={stockQuantity}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function OpenSetModal({
  product,
  stockQuantity,
  stockId,
  onClose,
}: {
  product: Product;
  stockQuantity: number;
  stockId: number;
  onClose: () => void;
}) {
  const { data: cards, isLoading } = useCardsBySet({
    set_external_id: product.set_external_id,
    lang: product.lang,
  });
  const openBox = useOpenBox();

  const defaultRef = useRef<CardListRef>(null);
  const bonusRef = useRef<CardListRef>(null);

  const handleOpenBox = () => {
    const defaultItems = defaultRef.current?.getQuantities() ?? [];
    const bonusItems = bonusRef.current?.getQuantities() ?? [];
    const allItems = [...defaultItems, ...bonusItems];

    openBox.mutate(
      {
        stock_id: stockId,
        quantity: multiplier,
        items: allItems,
      },
      {
        onSuccess: () => onClose(),
      },
    );
  };

  const [multiplier, setMultiplier] = useState(1);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const defaultCards = cards?.filter((c) => c.quantity_per_set >= 1) ?? [];
  const bonusCards = cards?.filter((c) => c.quantity_per_set === 0) ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] flex flex-col
          rounded-2xl border border-gray-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <h2 className="font-display text-lg font-semibold text-gray-800">
            Abrir set
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-800
              hover:bg-gray-100 transition-colors"
          >
            <Icon icon="clarity:close-line" className="text-xl" />
          </button>
        </div>

        {/* Set info + multiplier */}
        <div className="px-6 py-4 border-b border-gray-100 shrink-0">
          <p className="font-semibold text-sm text-gray-800">{product.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {product.lang} · {product.set_code}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">
              {defaultCards.length} cartas · {bonusCards.length} bonus
            </span>

            {/* Multiplier control */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMultiplier((m) => Math.max(1, m - 1))}
                disabled={multiplier <= 1}
                className="w-6 h-6 flex items-center justify-center text-xs
                  font-semibold text-gray-500 bg-gray-100 rounded
                  hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed
                  transition-colors"
              >
                −
              </button>
              <span className="text-xs font-semibold text-gray-700 w-5 text-center tabular-nums">
                {multiplier}
              </span>
              <button
                type="button"
                onClick={() =>
                  setMultiplier((m) => Math.min(stockQuantity, m + 1))
                }
                disabled={multiplier >= stockQuantity}
                className="w-6 h-6 flex items-center justify-center text-xs
                  font-semibold text-gray-500 bg-gray-100 rounded
                  hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed
                  transition-colors"
              >
                +
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Stock: {stockQuantity} uds · Mostrando: {multiplier}{" "}
            {multiplier === 1 ? "set" : "sets"}
          </p>
        </div>

        {/* Lists */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
          {isLoading && (
            <div className="flex items-center justify-center py-12 text-gray-400 text-sm gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              Cargando cartas...
            </div>
          )}

          {!isLoading && (
            <>
              {/* Bonus cards */}
              <details className="group" open>
                <summary
                  className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-2 cursor-pointer list-none
                  flex items-center gap-1.5 select-none"
                >
                  <Icon
                    icon="mdi:chevron-right"
                    className="text-base text-gray-400 transition-transform group-open:rotate-90"
                  />
                  Cartas Aleatorias ({bonusCards.length})
                </summary>
                <CardList
                  ref={bonusRef}
                  key={`bonus-${multiplier}`}
                  cards={bonusCards}
                  multiplier={multiplier}
                  setExternalId={product.set_external_id}
                  lang={product.lang}
                />
              </details>
              {/* Default cards */}
              <details className="mb-4 group">
                <summary
                  className="text-xs font-semibold text-gray-800 uppercase tracking-wider mb-2 cursor-pointer list-none
                  flex items-center gap-1.5 select-none"
                >
                  <Icon
                    icon="mdi:chevron-right"
                    className="text-base text-gray-400 transition-transform group-open:rotate-90"
                  />
                  Cartas por defecto ({defaultCards.length})
                </summary>
                <CardList
                  ref={defaultRef}
                  key={`default-${multiplier}`}
                  cards={defaultCards}
                  multiplier={multiplier}
                  setExternalId={product.set_external_id}
                  lang={product.lang}
                />
              </details>
            </>
          )}

          {/* Confirm button */}
          {!isLoading && (
            <div className="border-t border-gray-200 px-6 py-4 shrink-0">
              <button
                type="button"
                onClick={handleOpenBox}
                disabled={openBox.isPending}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm
                  font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors"
              >
                {openBox.isPending && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {openBox.isPending ? "Abriendo..." : "Confirmar apertura"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

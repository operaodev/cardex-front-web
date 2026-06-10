import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import type { Stock } from "@/types/stock";
import {
  useAdjustStock,
  useRestock,
  useSale,
  useTrade,
  useGift,
  useLost,
  useDamage,
  useReturnStock,
  useStockLogs,
  useUpdatePrice,
  useToggleForSale,
  useToggleForTrade,
} from "@/hooks/useStock";

interface StockEditModalProps {
  open: boolean;
  stock: Stock | null;
  onClose: () => void;
}

const LOG_TYPE_LABELS: Record<string, string> = {
  open_box: "Apertura de caja",
  add: "Alta inicial",
  restock: "Restock",
  sale: "Venta",
  trade: "Intercambio",
  return: "Devolución",
  gift: "Donación",
  lost: "Pérdida",
  damage: "Daño",
  adjustment: "Ajuste",
  rollback: "Rollback",
  price_change: "Cambio de precio",
  discount_change: "Cambio de descuento",
};

export function StockEditModal({ open, stock, onClose }: StockEditModalProps) {
  return open && stock ? (
    <StockEditModalContent stock={stock} onClose={onClose} />
  ) : null;
}

function StockEditModalContent({
  stock,
  onClose,
}: {
  stock: Stock;
  onClose: () => void;
}) {
  const { data: logs } = useStockLogs(stock.id);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[85vh] flex flex-col
          rounded-2xl border border-gray-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-display text-lg font-semibold text-gray-800">
            Editar stock
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-800
              hover:bg-gray-100 transition-colors"
          >
            <Icon icon="clarity-close-line" className="text-xl" />
          </button>
        </div>

        {/* Body: left + right split */}
        <div className="flex-1 flex overflow-hidden divide-x divide-gray-200">
          {/* Left: info + controls */}
          <LeftPanel key={stock.id} stock={stock} />

          {/* Right: logs */}
          <RightPanel logs={logs} />
        </div>
      </div>
    </div>
  );
}

/* ── Left panel ──────────────────────────────────────────────────────── */

function LeftPanel({ stock }: { stock: Stock }) {
  const { product } = stock;
  const adjust = useAdjustStock();
  const restock = useRestock();
  const sale = useSale();
  const trade = useTrade();
  const gift = useGift();
  const lost = useLost();
  const damage = useDamage();
  const returnStock = useReturnStock();
  const updatePrice = useUpdatePrice();
  const toggleForSale = useToggleForSale();
  const toggleForTrade = useToggleForTrade();

  const [multiplier, setMultiplier] = useState(1);
  const [price, setPrice] = useState(stock.price);
  const [discountPrice, setDiscountPrice] = useState(stock.discount_price || 0);
  const [showPriceInputs, setShowPriceInputs] = useState(false);

  const displayPrice =
    typeof stock.price === "number" ? stock.price : Number(stock.price);
  const displayDiscountPrice =
    typeof stock.discount_price === "number"
      ? stock.discount_price
      : Number(stock.discount_price);

  const isMutating =
    adjust.isPending ||
    restock.isPending ||
    sale.isPending ||
    trade.isPending ||
    gift.isPending ||
    lost.isPending ||
    damage.isPending ||
    returnStock.isPending ||
    updatePrice.isPending ||
    toggleForSale.isPending ||
    toggleForTrade.isPending;

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

  const canDecrease = stock.quantity >= multiplier;

  return (
    <div className="w-1/2 overflow-y-auto custom-scrollbar p-6 space-y-5">
      {/* Product info */}
      <div className="flex gap-4">
        <Link
          to={`/product/${product.id}`}
          className="w-24 h-32 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Icon icon="clarity-image-line" className="text-xl" />
            </div>
          )}
        </Link>

        <div className="min-w-0 space-y-1">
          <Link
            to={`/product/${product.id}`}
            className="font-semibold text-sm text-gray-800 hover:text-black block"
          >
            {product.name}
          </Link>
          <p className="text-xs text-gray-500">
            {product.code} · {stock.condition.replace(/_/g, " ")}
          </p>
          {product.type === "card" && (
            <>
              <p className="text-xs text-gray-400">{displayRarity}</p>
            </>
          )}
          <p className="text-xs text-gray-400">{product.set_name}</p>
          <p className="text-xs text-gray-400">
            {product.lang} · {product.type === "card" ? "Carta" : "Set"}
          </p>
        </div>
      </div>

      {/* Current state */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <InfoField label="Precio" value={`S/. ${displayPrice.toFixed(2)}`} />
        {displayDiscountPrice > 0 && (
          <InfoField
            label="Descuento"
            value={`S/. ${displayDiscountPrice.toFixed(2)}`}
          />
        )}
        <InfoField label="Cantidad actual" value={`${stock.quantity}`} />
        <InfoField label="Venta" value={stock.is_for_sale ? "Sí" : "No"} />
        <InfoField
          label="Intercambio"
          value={stock.is_for_trade ? "Sí" : "No"}
        />
      </div>

      {/* Price editing section */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
            Precio
          </h3>
          {!showPriceInputs && (
            <button
              type="button"
              onClick={() => setShowPriceInputs(true)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Editar
            </button>
          )}
        </div>

        {showPriceInputs && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Precio base
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg
                  focus:outline-none focus:border-gray-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Precio con descuento
              </label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={discountPrice}
                onChange={(e) => setDiscountPrice(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg
                  focus:outline-none focus:border-gray-500 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  updatePrice.mutate({
                    stock_id: stock.id,
                    price,
                    discount_price:
                      discountPrice > 0 ? discountPrice : undefined,
                  });
                  setShowPriceInputs(false);
                }}
                disabled={
                  updatePrice.isPending ||
                  (price === stock.price &&
                    discountPrice === stock.discount_price)
                }
                className="flex-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg
                  hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed
                  transition-colors"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrice(stock.price);
                  setDiscountPrice(stock.discount_price || 0);
                  setShowPriceInputs(false);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg
                  hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toggle switches */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
          Estados
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Disponible para venta</span>
          <button
            type="button"
            onClick={() =>
              toggleForSale.mutate({
                stock_id: stock.id,
                is_for_sale: !stock.is_for_sale,
              })
            }
            disabled={toggleForSale.isPending}
            className={`relative w-12 h-6 rounded-full transition-colors
              ${stock.is_for_sale ? "bg-green-600" : "bg-gray-300"}
              disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform
                ${stock.is_for_sale ? "translate-x-6" : "translate-x-0"}`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">
            Disponible para intercambio
          </span>
          <button
            type="button"
            onClick={() =>
              toggleForTrade.mutate({
                stock_id: stock.id,
                is_for_trade: !stock.is_for_trade,
              })
            }
            disabled={toggleForTrade.isPending}
            className={`relative w-12 h-6 rounded-full transition-colors
              ${stock.is_for_trade ? "bg-purple-600" : "bg-gray-300"}
              disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform
                ${stock.is_for_trade ? "translate-x-6" : "translate-x-0"}`}
            />
          </button>
        </div>
      </div>

      {isMutating && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          Actualizando...
        </div>
      )}

      {/* Quick actions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
            Acciones rápidas
          </h3>

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
              onClick={() => setMultiplier((m) => Math.min(99, m + 1))}
              className="w-6 h-6 flex items-center justify-center text-xs
                font-semibold text-gray-500 bg-gray-100 rounded
                hover:bg-gray-200 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <ActionBtn
            label={`+${multiplier} Restock`}
            color="bg-green-600 hover:bg-green-700"
            disabled={isMutating}
            onClick={() =>
              restock.mutate({ stock_id: stock.id, amount: multiplier })
            }
          />
          <ActionBtn
            label={`-${multiplier} Venta`}
            color="bg-blue-600 hover:bg-blue-700"
            disabled={isMutating || !canDecrease}
            onClick={() =>
              sale.mutate({ stock_id: stock.id, amount: multiplier })
            }
          />
          <ActionBtn
            label={`-${multiplier} Intercambio`}
            color="bg-purple-600 hover:bg-purple-700"
            disabled={isMutating || !canDecrease}
            onClick={() =>
              trade.mutate({ stock_id: stock.id, amount: multiplier })
            }
          />
          <ActionBtn
            label={`-${multiplier} Donación`}
            color="bg-pink-600 hover:bg-pink-700"
            disabled={isMutating || !canDecrease}
            onClick={() =>
              gift.mutate({ stock_id: stock.id, amount: multiplier })
            }
          />
          <ActionBtn
            label={`-${multiplier} Pérdida`}
            color="bg-yellow-600 hover:bg-yellow-700"
            disabled={isMutating || !canDecrease}
            onClick={() =>
              lost.mutate({ stock_id: stock.id, amount: multiplier })
            }
          />
          <ActionBtn
            label={`-${multiplier} Daño`}
            color="bg-red-600 hover:bg-red-700"
            disabled={isMutating || !canDecrease}
            onClick={() =>
              damage.mutate({ stock_id: stock.id, amount: multiplier })
            }
          />
          <ActionBtn
            label={`+${multiplier} Devolución`}
            color="bg-teal-600 hover:bg-teal-700"
            disabled={isMutating}
            onClick={() =>
              returnStock.mutate({ stock_id: stock.id, amount: multiplier })
            }
            className="col-span-2"
          />
        </div>

        {/* Manual adjust */}
        <QuantityAdjust stock={stock} disabled={isMutating} />
      </div>
    </div>
  );
}

/* ── Right panel: logs ───────────────────────────────────────────────── */

function RightPanel({ logs }: { logs?: import("@/types/stock").Log[] }) {
  return (
    <div className="w-1/2 flex flex-col overflow-hidden">
      <div className="px-6 py-3 border-b border-gray-200">
        <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wider">
          Historial
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
        {!logs && (
          <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2" />
            Cargando historial...
          </div>
        )}

        {logs && logs.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Sin historial disponible
          </div>
        )}

        {logs && logs.length > 0 && (
          <ul className="relative">
            {/* Timeline line */}
            <div className="absolute left-2.75 top-2 bottom-2 w-px bg-gray-200" />

            {logs.map((log) => (
              <LogItem key={log.id} log={log} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function LogItem({ log }: { log: import("@/types/stock").Log }) {
  const isNegative = log.delta < 0;
  const dotKind = (() => {
    switch (log.log_type) {
      case "add":
      case "restock":
      case "return":
        return "bg-green-400";
      case "sale":
      case "trade":
      case "gift":
      case "lost":
      case "damage":
        return "bg-red-400";
      case "adjustment":
        return "bg-yellow-400";
      case "rollback":
        return "bg-orange-400";
      case "price_change":
      case "discount_change":
        return "bg-blue-400";
      default:
        return "bg-gray-400";
    }
  })();

  const date = new Date(log.created_at).toLocaleString("es-PE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <li className="relative pl-8 pb-3">
      {/* Dot */}
      <div
        className={`absolute left-0.75 top-1.5 w-4.25 h-4.25 rounded-full
          border-2 border-white ${dotKind}`}
      />

      <div className="text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-gray-700">
            {LOG_TYPE_LABELS[log.log_type] ?? log.log_type}
          </span>
          <span className="text-gray-400">{date}</span>
        </div>

        {log.delta !== 0 && (
          <p className="text-gray-500 mt-0.5">
            {isNegative ? "-" : "+"}
            {Math.abs(log.delta)} ({log.previous_stock} → {log.new_stock})
          </p>
        )}

        {log.note && <p className="text-gray-400 mt-0.5 italic">{log.note}</p>}

        {/* Rollback target */}
        {log.parent_log_id && (
          <p className="text-gray-400 mt-0.5">
            Rollback del log #{log.parent_log_id}
          </p>
        )}
      </div>
    </li>
  );
}

/* ── Helpers ──────────────────────────────────────────────────────────── */

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-gray-400">{label}</span>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}

function ActionBtn({
  label,
  color,
  disabled,
  onClick,
  className,
}: {
  label: string;
  color: string;
  disabled: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 text-xs font-semibold text-white rounded-lg
        disabled:opacity-40 disabled:cursor-not-allowed transition-colors
        ${color} ${className ?? ""}`}
    >
      {label}
    </button>
  );
}

function QuantityAdjust({
  stock,
  disabled,
}: {
  stock: Stock;
  disabled: boolean;
}) {
  const [qty, setQty] = useState(stock.quantity);
  const adjust = useAdjustStock();

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <label className="block text-xs text-gray-400 mb-1">
          Ajustar cantidad
        </label>
        <input
          type="number"
          min={0}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg
            focus:outline-none focus:border-gray-500 transition-colors"
        />
      </div>
      <button
        type="button"
        disabled={disabled || qty === stock.quantity}
        onClick={() =>
          adjust.mutate({
            stock_id: stock.id,
            new_quantity: qty,
          })
        }
        className="px-4 py-1.5 text-xs font-semibold text-white bg-gray-700 rounded-lg
          hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors"
      >
        Guardar
      </button>
    </div>
  );
}

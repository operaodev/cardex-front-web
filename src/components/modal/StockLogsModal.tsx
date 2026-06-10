import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import type { Stock, Log } from "@/types/stock";
import { useStockLogs, useRollback } from "@/hooks/useStock";

interface StockLogsModalProps {
  open: boolean;
  stock: Stock;
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

export function StockLogsModal({ open, stock, onClose }: StockLogsModalProps) {
  if (!open) return null;
  return <StockLogsModalContent stock={stock} onClose={onClose} />;
}

function StockLogsModalContent({
  stock,
  onClose,
}: {
  stock: Stock;
  onClose: () => void;
}) {
  const { data: logs, isLoading } = useStockLogs(stock.id);
  const { product } = stock;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const imageUrl =
    product.print_url_large ??
    product.images?.[0]?.image_url ??
    product.set_image_large;

  const price =
    typeof stock.price === "number" ? stock.price : Number(stock.price);
  const discountPrice =
    typeof stock.discount_price === "number"
      ? stock.discount_price
      : Number(stock.discount_price);

  const displayRarity = [
    product.rarity,
    product.rarity_code ? `(${product.rarity_code})` : null,
    product.edition ? `- ${product.edition}` : null,
  ]
    .filter(Boolean)
    .join(" ");

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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <h2 className="font-display text-lg font-semibold text-gray-800">
            Historial de stock
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

        {/* Product + stock info */}
        <div className="px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex gap-4">
            <Link
              to={`/product/${product.id}`}
              className="w-20 h-28 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
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

            <div className="min-w-0 flex-1 space-y-1">
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
                <p className="text-xs text-gray-400">{displayRarity}</p>
              )}
              <p className="text-xs text-gray-400">{product.set_name}</p>
              <p className="text-xs text-gray-400">
                {product.lang} · {product.type === "card" ? "Carta" : "Set"}
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <span className="text-xs text-gray-500">
                  Cantidad: <strong>{stock.quantity}</strong>
                </span>
                <span className="text-xs text-gray-500">
                  Precio:{" "}
                  <strong>{price > 0 ? `S/. ${price}` : "Sin precio"}</strong>
                </span>
                {discountPrice > 0 && (
                  <span className="text-xs text-gray-500">
                    Descuento: <strong>S/. {discountPrice.toFixed(2)}</strong>
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  {stock.is_for_sale ? "✅ En venta" : "❌ No venta"}
                </span>
                <span className="text-xs text-gray-500">
                  {stock.is_for_trade ? "🔄 Intercambio" : "❌ No intercambio"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading && (
            <div className="flex items-center justify-center py-12 text-gray-400 text-sm gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              Cargando historial...
            </div>
          )}

          {!isLoading && logs && logs.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              Sin historial disponible
            </div>
          )}

          {!isLoading && logs && logs.length > 0 && (
            <LogList logs={logs} stock={stock} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Log list ─────────────────────────────────────────────────────────── */

function LogList({ logs, stock }: { logs: Log[]; stock: Stock }) {
  const rollback = useRollback();
  const [rollbackLog, setRollbackLog] = useState<Log | null>(null);
  const [note, setNote] = useState("");

  const handleRollback = () => {
    if (rollbackLog) {
      rollback.mutate(
        {
          stock_id: stock.id,
          log_id: rollbackLog.id,
          note: note || undefined,
        },
        {
          onSuccess: () => {
            setRollbackLog(null);
            setNote("");
          },
        },
      );
    }
  };

  return (
    <>
      <div className="px-6 py-4">
        <ul className="relative">
          {/* Timeline line */}
          <div className="absolute left-2.75 top-2 bottom-2 w-px bg-gray-200" />

          {logs.map((log) => (
            <LogItem key={log.id} log={log} onRollback={setRollbackLog} />
          ))}
        </ul>
      </div>

      {/* Rollback confirmation modal */}
      {rollbackLog && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
          onClick={() => {
            setRollbackLog(null);
            setNote("");
          }}
        >
          <div
            className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Icon
                  icon="mdi:alert-circle"
                  className="text-xl text-red-600"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Confirmar rollback
              </h3>
            </div>

            <div className="mb-4 text-sm text-gray-600">
              <p>¿Estás seguro de revertir este log?</p>

              {rollbackLog.log_type === "price_change" ||
              rollbackLog.log_type === "discount_change" ? (
                <>
                  {rollbackLog.log_type === "price_change" && (
                    <p className="mt-2">
                      Se restaurará el precio de{" "}
                      <strong>S/. {rollbackLog.previous_price}</strong> (actual:
                      S/. {rollbackLog.new_price})
                    </p>
                  )}
                  {rollbackLog.log_type === "discount_change" && (
                    <p className="mt-2">
                      Se restaurará el descuento de{" "}
                      <strong>S/. {rollbackLog.previous_discount}</strong>{" "}
                      (actual: S/. {rollbackLog.new_discount})
                    </p>
                  )}
                </>
              ) : (
                <p className="mt-2">
                  Se restaurará la cantidad de{" "}
                  <strong>{rollbackLog.previous_stock}</strong> unidades{" "}
                  (actual: {rollbackLog.new_stock})
                </p>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Log #{rollbackLog.id}: {LOG_TYPE_LABELS[rollbackLog.log_type]} (
                {new Date(rollbackLog.created_at).toLocaleString("es-PE", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                )
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1">
                Nota (opcional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Motivo del rollback..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                  focus:outline-none focus:border-gray-500 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setRollbackLog(null);
                  setNote("");
                }}
                disabled={rollback.isPending}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100
                  rounded-lg hover:bg-gray-200 disabled:opacity-40
                  transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRollback}
                disabled={rollback.isPending}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600
                  rounded-lg hover:bg-red-700 disabled:opacity-40
                  transition-colors flex items-center justify-center gap-2"
              >
                {rollback.isPending && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {rollback.isPending ? "Revirtiendo..." : "Revertir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LogItem({
  log,
  onRollback,
}: {
  log: Log;
  onRollback: (log: Log) => void;
}) {
  const isNegative = log.delta < 0;

  const canRollback = [
    "add",
    "restock",
    "return",
    "sale",
    "trade",
    "gift",
    "lost",
    "damage",
    "adjustment",
    "price_change",
    "discount_change",
  ].includes(log.log_type);

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
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <li className="relative pl-8 pb-4">
      {/* Dot */}
      <div
        className={`absolute left-0.75 top-1.5 w-4.25 h-4.25 rounded-full
          border-2 border-white ${dotKind}`}
      />

      <div className="text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="font-semibold text-gray-700">
            {LOG_TYPE_LABELS[log.log_type] ?? log.log_type}
          </span>
          <span className="text-xs text-gray-400 shrink-0">{date}</span>
        </div>

        {log.delta !== 0 && (
          <p className="text-gray-500 mt-1">
            <span className={isNegative ? "text-red-500" : "text-green-600"}>
              {isNegative ? "-" : "+"}
              {Math.abs(log.delta)}
            </span>{" "}
            <span className="text-gray-400">
              ({log.previous_stock} → {log.new_stock})
            </span>
          </p>
        )}

        {log.previous_price > 0 && (
          <p className="text-gray-500 mt-1">
            Precio: S/. {log.previous_price} → S/. {log.new_price}
          </p>
        )}

        {log.previous_discount > 0 && (
          <p className="text-gray-500 mt-1">
            Descuento: S/. {log.previous_discount} → S/. {log.new_discount}
          </p>
        )}

        {log.note && (
          <p className="text-gray-400 mt-1 italic text-xs">{log.note}</p>
        )}

        {/* Rollback target */}
        {log.parent_log_id && (
          <p className="text-gray-400 mt-1 text-xs">
            Rollback del log #{log.parent_log_id}
          </p>
        )}

        {/* Rollback button */}
        {canRollback && (
          <button
            type="button"
            onClick={() => onRollback(log)}
            className="mt-2 flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium
              text-red-600 bg-red-50 rounded-md hover:bg-red-100
              transition-colors"
          >
            <Icon icon="mdi:undo" className="text-sm" />
            Revertir
          </button>
        )}
      </div>
    </li>
  );
}

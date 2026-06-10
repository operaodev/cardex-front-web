import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify-icon/react";
import { useCreateStock } from "@/hooks/useStock";
import { useSuggestions } from "@/hooks/useSuggestions";
import type { Condition } from "@/types/stock";
import type { SuggestionDTO } from "@/types/suggestion";
import type { LangCode } from "@/types/product";

interface StockCreateModalProps {
  open: boolean;
  onClose: () => void;
}

const CONDITIONS: { value: Condition; label: string }[] = [
  { value: "mint", label: "Mint" },
  { value: "near_mint", label: "Near Mint" },
  { value: "light_played", label: "Light Played" },
  { value: "mod_played", label: "Moderately Played" },
  { value: "heavy_played", label: "Heavily Played" },
  { value: "damaged", label: "Damaged" },
];

const LANGS: { code: LangCode; label: string }[] = [
  { code: "EN", label: "EN" },
  { code: "SP", label: "ES" },
  { code: "JP", label: "JP" },
  { code: "FR", label: "FR" },
  { code: "DE", label: "DE" },
  { code: "IT", label: "IT" },
  { code: "PT", label: "PT" },
  { code: "KR", label: "KR" },
  { code: "TC", label: "TC" },
  { code: "SC", label: "SC" },
  { code: "AE", label: "AE" },
];

export function StockCreateModal({ open, onClose }: StockCreateModalProps) {
  if (!open) return null;
  return <StockCreateModalContent onClose={onClose} />;
}

function StockCreateModalContent({ onClose }: { onClose: () => void }) {
  const createStock = useCreateStock();

  // Search
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LangCode | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<SuggestionDTO | null>(
    null,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: suggestions, isFetching } = useSuggestions(
    {
      tcg: "ygo",
      lang: selectedLang ?? undefined,
      input: debouncedQuery,
    },
    true,
  );

  const showDropdown =
    isFocused &&
    !selectedProduct &&
    suggestions != null &&
    suggestions.length > 0 &&
    debouncedQuery.length > 2;

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Form state
  const [condition, setCondition] = useState<Condition>("near_mint");
  const [isForSale, setIsForSale] = useState(true);
  const [isForTrade, setIsForTrade] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");

  const canSubmit =
    selectedProduct != null && quantity > 0 && !createStock.isPending;

  const handleSubmit = () => {
    if (!canSubmit || !selectedProduct) return;
    createStock.mutate(
      {
        product_id: selectedProduct.id,
        condition,
        is_for_sale: isForSale,
        is_for_trade: isForTrade,
        quantity,
        price: price ? Number(price) : 0,
        note: note || undefined,
      },
      {
        onSuccess: () => onClose(),
      },
    );
  };

  const selectProduct = (product: SuggestionDTO) => {
    setSelectedProduct(product);
    setQuery(product.name);
    setIsFocused(false);
  };

  const imageUrl = selectedProduct?.image;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-display text-lg font-semibold text-gray-800">
            Agregar al inventario
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

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Product search */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-semibold text-gray-800 uppercase tracking-wider mb-1.5">
              Producto
            </label>

            {/* Language toggle */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {LANGS.map((lang) => {
                const active = selectedLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setSelectedLang(active ? null : lang.code)}
                    className={`px-2 py-0.5 text-xs font-medium rounded-md
                      border transition-colors
                      ${
                        active
                          ? "bg-gray-800 text-white border-gray-800"
                          : "bg-white text-gray-500 border-gray-300 hover:border-gray-400 hover:text-gray-700"
                      }`}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (selectedProduct) setSelectedProduct(null);
                }}
                onFocus={() => setIsFocused(true)}
                placeholder="Buscar producto por nombre..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                  focus:outline-none focus:border-gray-500 transition-colors
                  pr-10"
              />
              {isFetching && (
                <div className="absolute right-3 top-2.5">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                </div>
              )}
              {!isFetching && query.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSelectedProduct(null);
                    inputRef.current?.focus();
                  }}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <Icon icon="clarity-close-line" className="text-sm" />
                </button>
              )}
            </div>

            {/* Dropdown */}
            {showDropdown && suggestions && suggestions.length > 0 && (
              <div
                className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto
                bg-white border border-gray-200 rounded-lg shadow-lg"
              >
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectProduct(s)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left
                      hover:bg-gray-50 transition-colors text-sm"
                  >
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={s.name}
                        className="w-8 h-11 shrink-0 rounded object-cover bg-gray-100"
                      />
                    ) : (
                      <div className="w-8 h-11 shrink-0 rounded bg-gray-100 flex items-center justify-center">
                        <Icon
                          icon="clarity-image-line"
                          className="text-xs text-gray-400"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {s.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {s.rarity}
                        {s.rarity_code && ` (${s.rarity_code})`}
                      </p>
                      <p className="text-xs text-gray-400">
                        {s.set_name}
                        {s.code && ` · ${s.code}`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected product preview */}
          {selectedProduct && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={selectedProduct.name}
                  className="w-12 h-16 shrink-0 rounded object-cover bg-gray-100"
                />
              ) : (
                <div className="w-12 h-16 shrink-0 rounded bg-gray-100 flex items-center justify-center">
                  <Icon
                    icon="clarity-image-line"
                    className="text-sm text-gray-400"
                  />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-medium text-sm text-gray-800 truncate">
                  {selectedProduct.name}
                </p>
                <p className="text-xs text-gray-400">
                  {selectedProduct.set_name}
                  {selectedProduct.code ? ` · ${selectedProduct.code}` : ""}
                </p>
                {selectedProduct.rarity && (
                  <p className="text-xs text-gray-400">
                    {selectedProduct.rarity}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Condition */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 uppercase tracking-wider mb-1.5">
              Condición
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as Condition)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                focus:outline-none focus:border-gray-500 transition-colors
                bg-white"
            >
              {CONDITIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sale / Trade toggles */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isForSale}
                onChange={(e) => setIsForSale(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-gray-800
                  focus:ring-gray-500"
              />
              <span className="text-sm text-gray-700">En venta</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isForTrade}
                onChange={(e) => setIsForTrade(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-gray-800
                  focus:ring-gray-500"
              />
              <span className="text-sm text-gray-700">Intercambio</span>
            </label>
          </div>

          {/* Quantity & Price row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-800 uppercase tracking-wider mb-1.5">
                Cantidad
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                  focus:outline-none focus:border-gray-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-800 uppercase tracking-wider mb-1.5">
                Precio (S/.){" "}
                <span className="font-normal text-gray-400">(opcional)</span>
              </label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                  focus:outline-none focus:border-gray-500 transition-colors"
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 uppercase tracking-wider mb-1.5">
              Nota <span className="font-normal text-gray-400">(opcional)</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej: Comprado en tienda X"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                focus:outline-none focus:border-gray-500 transition-colors"
            />
          </div>

          {/* Error / success */}
          {createStock.isError && (
            <div className="text-sm text-red-500">
              Error al crear el stock. Intenta de nuevo.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600
              hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-5 py-2 text-sm font-semibold text-white bg-gray-800
              rounded-lg hover:bg-gray-700
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-colors flex items-center gap-2"
          >
            {createStock.isPending && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

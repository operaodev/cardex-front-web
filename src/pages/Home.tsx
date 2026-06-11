import { Link, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import { useMarketCards } from "@/hooks/useMarketplace";
import type { ProductResume } from "@/types/marketplace";
import type { LangCode, TCG } from "@/types/product";

/* ───────── Filter option constants ───────── */

const TCG_OPTIONS: { value: TCG; label: string }[] = [
  { value: "ygo", label: "Yu-Gi-Oh!" },
];

const LANG_OPTIONS: { value: LangCode; label: string }[] = [
  { value: "SP", label: "Español" },
  { value: "EN", label: "English" },
  { value: "FR", label: "French" },
  { value: "DE", label: "Deutsch" },
  { value: "IT", label: "Italiano" },
  { value: "JP", label: "Japanese" },
  { value: "KR", label: "Korean" },
  { value: "AE", label: "Asian-English" },
  { value: "SC", label: "Chinese-Simplified" },
  { value: "TC", label: "Chinese-Traditional" },
];

const PRODUCT_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "card", label: "Cartas" },
  { value: "set", label: "Sets" },
];

/* ───────── Main page ───────── */

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("input") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const selectedLang = searchParams.get("lang") || "";
  const selectedTcg = searchParams.get("tcg") || "";
  const selectedProductType = searchParams.get("product_Type") || "";

  const { data, isLoading } = useMarketCards({
    input: query,
    page: currentPage,
    limit: 30,
    product_Type: selectedProductType || undefined,
    ...(selectedLang ? { langs: [selectedLang] } : {}),
    ...(selectedTcg ? { tcgs: [selectedTcg] } : {}),
  });

  const setParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      // Reset page when any filter changes
      if (key !== "page") {
        next.delete("page");
      }
      return next;
    });
  };

  const hasFilters = !!(
    query ||
    selectedLang ||
    selectedTcg ||
    selectedProductType
  );

  return (
    <main className="mx-auto w-10/12 py-10">
      {query && (
        <h1 className="font-display text-2xl font-bold text-gray-800 mb-6">
          Resultados para &quot;{query}&quot;
        </h1>
      )}
      {!query && data && (
        <h1 className="font-display text-2xl font-bold text-gray-800 mb-6">
          Todas las cartas
        </h1>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* TCG */}
        <select
          value={selectedTcg}
          onChange={(e) => setParam("tcg", e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg
            focus:outline-none focus:border-gray-500 transition-colors cursor-pointer bg-white"
        >
          <option value="">Todos los juegos</option>
          {TCG_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Language */}
        <select
          value={selectedLang}
          onChange={(e) => setParam("lang", e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg
            focus:outline-none focus:border-gray-500 transition-colors cursor-pointer bg-white"
        >
          <option value="">Todos los idiomas</option>
          {LANG_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Product type */}
        <select
          value={selectedProductType}
          onChange={(e) => setParam("product_Type", e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg
            focus:outline-none focus:border-gray-500 transition-colors cursor-pointer bg-white"
        >
          <option value="">Todos los tipos</option>
          {PRODUCT_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Loading skeleton ── */}
      {isLoading && (
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col bg-white border border-gray-200
                rounded-xl overflow-hidden animate-pulse"
            >
              <div className="w-full aspect-2.5/3.5 bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-3 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
                <div className="h-3 w-1/3 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Product grid ── */}
      {!isLoading && data && data.items.length > 0 && (
        <div className="grid grid-cols-5 gap-4">
          {data.items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!isLoading && data && data.items.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">
            {hasFilters
              ? "Sin resultados para los filtros seleccionados"
              : "No hay productos disponibles"}
          </p>
        </div>
      )}

      {/* ── Pagination ── */}
      {data && data.total_pages > 1 && (
        <Pagination
          page={data.page}
          totalPages={data.total_pages}
          onPageChange={(p) => setParam("page", String(p))}
        />
      )}
    </main>
  );
}

/* ───────── Pagination ───────── */

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const btnClass =
    "px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={btnClass}
      >
        <Icon icon="mdi:chevron-left" className="text-lg" />
        <span className="hidden sm:inline ml-1">Anterior</span>
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="px-2 text-gray-400 select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors
              ${
                p === page
                  ? "bg-gray-800 text-white border-gray-800 cursor-default"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={btnClass}
      >
        <span className="hidden sm:inline mr-1">Siguiente</span>
        <Icon icon="mdi:chevron-right" className="text-lg" />
      </button>
    </div>
  );
}

/* ───────── Product card ───────── */

function ProductCard({ item }: { item: ProductResume }) {
  const rarity = [
    item.rarity,
    item.rarity_code ? `(${item.rarity_code})` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      to={`/product/${item.id}`}
      className="flex h-56 bg-white border border-gray-200 p-4
        rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Imagen a la izquierda - altura completa */}
      <img src={item.image} alt={item.name} className="h-full py-3" />

      {/* Información a la derecha en columna */}
      <div className="flex-1 p-4 space-y-1.5">
        <p className="font-semibold text-sm text-gray-800 leading-tight line-clamp-2">
          {item.name}
        </p>
        {item.code && <p className="text-xs text-gray-500">{item.code}</p>}
        {item.set_name && (
          <p className="text-xs text-gray-400 truncate text-wrap">
            {item.set_name}
          </p>
        )}
        {rarity && <p className="text-xs text-gray-400 truncate">{rarity}</p>}
        <div className="flex flex-wrap gap-x-3 gap-y-1 pt-2">
          {item.global_stock > 0 && (
            <span className="text-xs text-green-600">
              {item.global_stock} en stock
            </span>
          )}
          {item.average_price > 0 && (
            <span className="text-xs text-gray-500">
              S/. {item.average_price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

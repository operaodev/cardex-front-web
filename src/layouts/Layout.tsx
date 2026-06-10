import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { randomNames } from "@/hooks/useProduct";
import { useSuggestions } from "@/hooks/useSuggestions";
import { useUserStore } from "@/store/useUserStore";
import { AuthModal } from "@/components/modal/AuthModal";
import { WishlistModal } from "@/components/modal/WishlistModal";
import { Link } from "react-router-dom";
import type { LangCode, TCG } from "@/types/product";
import type { SuggestionDTO, SuggestionInput } from "@/types/suggestion";
import { Icon } from "@iconify-icon/react";

const TCG_OPTIONS: { value: TCG; label: string }[] = [
  { value: "ygo", label: "Yu-Gi-Oh!" },
];

const LANGUAGE_OPTIONS: { value: LangCode; label: string }[] = [
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

export function Layout() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedTcg, setSelectedTcg] = useState<TCG | undefined>(undefined);
  const [selectedLang, setSelectedLang] = useState<LangCode | undefined>(
    undefined,
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user, logout } = useUserStore();

  const query: SuggestionInput = {
    input: searchInput,
    tcg: "ygo",
    lang: selectedLang,
  };

  const { data: suggestions, isFetching } = useSuggestions(query, !isAuthenticated);

  // Close dropdown on outside click (ignores clicks on selects or search area)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (wrapperRef.current && wrapperRef.current.contains(target)) return;
      setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const hasResults = (suggestions?.length ?? 0) > 0;
  const shouldShow = showSuggestions && searchInput.length > 2;

  return (
    <>
      <header
        className="
        sticky top-0 z-10
        flex justify-between items-center
        py-2 px-8 border-b border-gray-300 bg-white/80 backdrop-blur-sm
      "
      >
        <Link
          to="/"
          className="font-display text-3xl font-bold tracking-tighter text-gray-800"
        >
          Cardex
        </Link>

        {/* Center controls */}
        <div
          ref={wrapperRef}
          className="relative flex items-center w-1/2 gap-2"
        >
          <NavSelect
            title="Juegos"
            options={TCG_OPTIONS}
            value={selectedTcg}
            onChange={(v) => setSelectedTcg(v)}
          />
          <NavSelect
            title="Lenguajes"
            options={LANGUAGE_OPTIONS}
            value={selectedLang}
            onChange={(v) => setSelectedLang(v)}
          />

          {/* Search bar — rounded-full glass style */}
          <NavSearch
            value={searchInput}
            onChange={(v) => setSearchInput(v)}
            setShowSuggestions={(show) => setShowSuggestions(show)}
          />

          {/* Suggestions dropdown */}
          {shouldShow && (
            <div
              className="absolute top-full left-0 mt-2 w-full z-50 overflow-hidden
                rounded-xl border border-gray-200 bg-white shadow-lg"
            >
              {isFetching ? (
                <div className="px-5 py-6 flex flex-col items-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  <span className="text-sm text-gray-400">Buscando...</span>
                </div>
              ) : hasResults && suggestions ? (
                <div className="max-h-72 overflow-y-auto custom-scrollbar">
                  {suggestions.map((s) => (
                    <SuggestionRow key={s.id} suggestion={s} />
                  ))}
                </div>
              ) : (
                <div className="px-5 py-6 text-center text-sm text-gray-400">
                  No se encontraron resultados
                </div>
              )}
            </div>
          )}
        </div>
        <AuthArea
          isAuthenticated={isAuthenticated}
          user={user}
          onLoginClick={() => setShowAuthModal(true)}
          onWishlistClick={() => setShowWishlistModal(true)}
          onLogout={logout}
        />
        {/* Right side: user actions */}
      </header>

      <Outlet />

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <WishlistModal
        open={showWishlistModal}
        onClose={() => setShowWishlistModal(false)}
      />
    </>
  );
}

/* ---------- Sub-components ---------- */
const AuthArea = ({
  isAuthenticated,
  user,
  onLoginClick,
  onWishlistClick,
  onLogout,
}: {
  isAuthenticated: boolean;
  user: { name: string } | null;
  onLoginClick: () => void;
  onWishlistClick: () => void;
  onLogout: () => void;
}) => {
  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onWishlistClick}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-700
            rounded-lg hover:bg-gray-600 transition-colors"
        >
          Lista de deseos
        </button>
        <Link
          to="/inventory"
          className="px-4 py-2 text-sm font-medium text-white bg-gray-700
            rounded-lg hover:bg-gray-600 transition-colors"
        >
          Inventario
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="px-4 py-2 text-sm font-medium text-black border border-gray-300
            rounded-lg hover:bg-gray-100 transition-colors"
        >
          Salir
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onLoginClick}
        className="px-4 py-2 text-sm font-medium text-white bg-black
          rounded-lg hover:bg-gray-800 transition-colors"
      >
        Iniciar sesión
      </button>
    </div>
  );
};

const NavSearch = ({
  value,
  onChange,
  setShowSuggestions,
}: {
  value: string;
  onChange: (v: string) => void;
  setShowSuggestions: (show: boolean) => void;
}) => {
  const [names, setNames] = useState<string[]>([]);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const fetchNames = async () => {
      const data = await randomNames(10);
      setNames(data.names.map((name) => `Buscar "${name}"`));
    };
    fetchNames();
  }, []);

  useEffect(() => {
    if (names.length === 0) return;

    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % names.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [names]);

  return (
    <div
      className="
      flex-2 flex
    "
    >
      <label className="flex-1 relative flex justify-center items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={
            names.length > 0 ? `${names[placeholderIdx]}` : "Buscar..."
          }
          className="
            w-full py-2 px-4
            rounded-lg rounded-r-none border border-r-0 border-gray-300
            focus:outline-none
          "
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
              hover:text-black transition-colors p-2"
          >
            X
          </button>
        )}
      </label>
      <button
        type="submit"
        className="px-4 py-2 text-sm font-medium text-white bg-gray-700
          rounded-lg rounded-l-none hover:bg-gray-600 transition-colors"
      >
        Buscar
      </button>
    </div>
  );
};

const NavSelect = <T extends string | undefined>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: { value: T; label: string }[];
  value?: T;
  onChange?: (v: T) => void;
}) => {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value as T)}
      className="
        flex-1 p-2 text-sm
        rounded-lg text-black border
        focus:outline-none border-gray-300
        transition-colors cursor-pointer
      "
    >
      <option value="">{title}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const SuggestionRow = ({ suggestion }: { suggestion: SuggestionDTO }) => {
  const hasStock = (suggestion.stock ?? 0) > 0;
  const hasWishlist = (suggestion.copies_in_wishlist ?? 0) > 0;

  return (
    <Link
      to={`/product/${suggestion.id}`}
      className="flex items-center gap-4 px-5 py-3
        border-b border-gray-100
        hover:bg-gray-50 transition-colors cursor-pointer"
    >
      {suggestion.image && (
        <img
          src={suggestion.image}
          alt={suggestion.name}
          className="w-12 h-16 object-contain rounded shrink-0
            bg-gray-50"
        />
      )}
      <div className="flex flex-col min-w-0 gap-1 flex-1">
        <span className="font-semibold text-base text-gray-800 truncate">
          {suggestion.name}{" "}
          {suggestion.type === "card" && (
            <span className="font-normal text-sm text-gray-400">
              ({suggestion.code})
            </span>
          )}
        </span>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {suggestion.rarity && <span>{suggestion.rarity}</span>}
        </div>
        <span className="text-xs text-gray-400">{suggestion.set_name}</span>
      </div>

      {/* Badges de stock / wishlist */}
      {(hasStock || hasWishlist) && (
        <div className="flex flex-col gap-2 shrink-0 text-xs font-semibold">
          {hasStock && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5
              text-xs font-semibold rounded-full
              bg-blue-50 text-blue-600 border border-blue-200"
            >
              <Icon icon="mingcute-stock-fill" className="text-sm" />x
              {suggestion.stock}
            </span>
          )}
          {hasWishlist && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5
              rounded-full
              bg-yellow-50 text-yellow-500 border border-yellow-200"
            >
              <Icon icon="clarity-favorite-solid" className="text-sm" />x
              {suggestion.copies_in_wishlist}
            </span>
          )}
        </div>
      )}
    </Link>
  );
};

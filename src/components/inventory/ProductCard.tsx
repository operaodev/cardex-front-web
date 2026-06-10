import { Link } from "react-router-dom";
import type { Stock as StockItem } from "@/types/stock";

const CONDITION_LABELS: Record<string, string> = {
  mint: "Mint",
  near_mint: "Near Mint",
  light_played: "Light Played",
  mod_played: "Moderately Played",
  heavy_played: "Heavily Played",
  damaged: "Damaged",
};

interface ProductCardProps {
  item: StockItem;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

export function ProductCard({
  item,
  isWishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  const { product } = item;
  const isCard = product.type === "card";
  const soldOut = item.quantity === 0;

  const imageUrl = isCard
    ? (product.images?.[0]?.image_url_small ?? product.print_url_small)
    : (product.set_image ?? product.set_image_small);

  const price =
    typeof item.price === "number" ? item.price : Number(item.price);
  const discountPrice =
    typeof item.discount_price === "number"
      ? item.discount_price
      : Number(item.discount_price);
  const hasDiscount = discountPrice > 0 && discountPrice < price;

  return (
    <div
      className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden
        hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <Link
        to={`/product/${product.id}`}
        className="block w-full aspect-[2.5/3.5] overflow-hidden bg-gray-100"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            {isCard ? "Card" : "Set"}
          </div>
        )}
      </Link>

      <div className="flex flex-col px-3 pt-2 pb-3 gap-2.5 flex-1">
        {/* Name */}
        <h3 className="font-semibold text-sm text-gray-800 leading-snug line-clamp-2 min-h-[2.75rem]">
          {product.name}
        </h3>

        {/* Code + wishlist */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">
            {product.code}
          </span>
          <button
            type="button"
            onClick={onToggleWishlist}
            className="text-gray-400 hover:text-yellow-400 transition-colors"
            title={
              isWishlisted ? "Quitar de la wishlist" : "Agregar a la wishlist"
            }
          >
            {isWishlisted ? "❤️" : "🤍"}
          </button>
        </div>

        {/* Rarity + Edition */}
        {isCard && (
          <p className="text-[11px] text-gray-500 leading-snug">
            {[product.rarity, product.edition].filter(Boolean).join(" - ")}
          </p>
        )}

        {/* Language + Condition */}
        <p className="text-[11px] text-gray-500 leading-snug">
          {product.lang} - {CONDITION_LABELS[item.condition] ?? item.condition}
        </p>

        {/* Set name */}
        <p className="text-xs text-gray-400 leading-snug line-clamp-1">
          {product.set_name}
        </p>

        {/* Sold out label */}
        {soldOut && (
          <div
            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold
              uppercase tracking-wider bg-red-100 text-red-600 w-fit"
          >
            AGOTADO
          </div>
        )}
      </div>

      {/* Footer: price + quantity */}
      {!soldOut && (
        <div className="flex items-end justify-between px-3 pb-3">
          <div>
            {hasDiscount && (
              <div className="text-[11px] text-gray-400 line-through">
                S/. {price.toFixed(2)}
              </div>
            )}
            <div className="text-sm font-bold text-gray-800">
              S/. {(hasDiscount ? discountPrice : price).toFixed(2)}
            </div>
          </div>
          <span className="text-xs text-gray-500">
            {item.quantity} {item.quantity === 1 ? "copia" : "copias"}
          </span>
        </div>
      )}

      {/* View more button */}
      <div className="px-3 pb-3 mt-auto">
        <Link
          to={`/product/${product.id}`}
          className="block w-full text-center py-1.5 text-xs font-semibold
            text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          VER MÁS
        </Link>
      </div>
    </div>
  );
}

import { Icon } from "@iconify-icon/react";
import CardboardBoxClosedIcon from "@iconify-react/game-icons/cardboard-box-closed";
import { ProductInfo } from "@/components/product/Fields";
import type { Product } from "@/types/product";

export function TopSection({
  product,
  isWishlisted,
  onToggleWishlist,
}: {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}) {
  return (
    <>
      {/* Name + wishlist */}
      <div className="flex items-center gap-2 font-display text-4xl font-bold text-gray-800">
        <button
          type="button"
          onClick={onToggleWishlist}
          className="cursor-pointer transition-colors"
          title={
            isWishlisted ? "Quitar de la wishlist" : "Agregar a la wishlist"
          }
        >
          <Icon
            icon={
              isWishlisted
                ? "clarity-favorite-solid"
                : "clarity-favorite-line"
            }
            className={
              isWishlisted
                ? "text-yellow-400"
                : "text-gray-400 hover:text-yellow-400"
            }
          />
        </button>
        <h1>{product.name}</h1>
      </div>

      {/* Set info + code badge */}
      <div className="flex justify-start gap-2">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold
          text-white bg-gray-700 rounded-full"
        >
          <CardboardBoxClosedIcon className="text-sm w-8" />
          <p className="text-nowrap">
            {product.set_name} ({product.lang})
          </p>
        </div>
        {product.code && (
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold
            text-gray-500 border border-gray-300 rounded-full"
          >
            {product.code}
            {product.rarity_code && (
              <span className="text-gray-400">({product.rarity_code})</span>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export function ExtraData({ product }: { product: Product }) {
  return (
    <details className="group" open>
      <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-700 transition-colors select-none">
        Más información
      </summary>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        {product.set_code && (
          <ProductInfo label="Set code" value={product.set_code} />
        )}
        <ProductInfo label="Tipo" value={product.type} />
        {product.lang && (
          <ProductInfo label="Idioma" value={product.lang} />
        )}
        {product.serie_code && (
          <ProductInfo label="Serie" value={product.serie_code} />
        )}
        {product.set_region_code && (
          <ProductInfo label="Región" value={product.set_region_code} />
        )}
        {product.set_type && (
          <ProductInfo label="Tipo de set" value={product.set_type} />
        )}
        {product.quantity_per_set > 0 && (
          <ProductInfo
            label="Cartas por set"
            value={
              product.quantity_per_set > 1
                ? `${product.quantity_per_set} cartas`
                : "1 carta"
            }
          />
        )}
        {product.quantity_per_box > 0 && (
          <ProductInfo
            label="Sobres por caja"
            value={`${product.quantity_per_box}`}
          />
        )}
      </div>
    </details>
  );
}

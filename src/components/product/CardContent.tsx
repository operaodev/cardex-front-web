import { Icon } from "@iconify-icon/react";
import { ProductField } from "@/components/product/Fields";
import { TopSection, ExtraData } from "@/components/product/ProductShared";
import type { Product } from "@/types/product";

interface CardContentProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

export function CardContent({
  product,
  isWishlisted,
  onToggleWishlist,
}: CardContentProps) {
  return (
    <div className="space-y-6">
      <TopSection
        product={product}
        isWishlisted={isWishlisted}
        onToggleWishlist={onToggleWishlist}
      />

      {/* Edition & Rarity */}
      <div className="flex gap-6">
        {product.edition && (
          <ProductField label="Edición" value={product.edition} />
        )}
        {product.rarity && (
          <ProductField label="Rareza" value={product.rarity} />
        )}
      </div>

      {/* Tags */}
      {product.tags && <ProductField label="Categorías" value={product.tags} />}

      {/* Archetype */}
      {product.archetype && (
        <ProductField label="Arquetipo" value={product.archetype} />
      )}

      {/* Description */}
      {product.description && (
        <div>
          <h3 className="text-xs font-semibold text-gray-800 mb-2 uppercase tracking-wider">
            Descripción
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      )}

      {/* Wanted */}
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
          glass-aurora text-tertiary"
      >
        <Icon icon="mdi-eye" className="text-blue-500 text-xl" />
        <p className="holo-text">{product.wanted} búsquedas este mes</p>
      </div>

      <hr className="border-gray-400" />

      <ExtraData product={product} />
    </div>
  );
}

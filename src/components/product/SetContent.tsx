import { ProductField } from "@/components/product/Fields";
import { TopSection, ExtraData } from "@/components/product/ProductShared";
import type { Product } from "@/types/product";
import { Icon } from "@iconify-icon/react";

interface SetContentProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

export function SetContent({
  product,
  isWishlisted,
  onToggleWishlist,
}: SetContentProps) {
  return (
    <div className="space-y-6">
      <TopSection
        product={product}
        isWishlisted={isWishlisted}
        onToggleWishlist={onToggleWishlist}
      />

      {/* Set-specific fields */}
      <div className="flex gap-6">
        {product.set_type && (
          <ProductField label="Tipo de set" value={product.set_type} />
        )}
        {product.set_region_code && (
          <ProductField label="Región" value={product.set_region_code} />
        )}
        {product.lang && <ProductField label="Idioma" value={product.lang} />}
      </div>

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

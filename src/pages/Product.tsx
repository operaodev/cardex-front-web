import { useParams } from "react-router-dom";
import { useState } from "react";
import { useProduct, useRelatedCards } from "@/hooks/useProduct";
import { useMarketAnalysis, useOffers } from "@/hooks/useMarketplace";
import {
  useWishlist,
  useUpsertWishlist,
  useDeleteWishlistItem,
} from "@/hooks/useCustomPacks";
import { NotFound } from "./NotFound";
import { ImageSection } from "@/components/product/ImageSection";
import { RelatedCard } from "@/components/product/RelatedCard";
import { RelatedLangFilter } from "@/components/product/RelatedLangFilter";
import { CardContent } from "@/components/product/CardContent";
import { SetContent } from "@/components/product/SetContent";
import { SetImage } from "@/components/product/SetImage";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);

  if (!id || isNaN(numericId)) {
    return (
      <NotFound
        title="ID inválido"
        description="El identificador proporcionado no es válido."
      />
    );
  }

  return <ProductContent id={numericId} />;
}

function ProductContent({ id }: { id: number }) {
  const { data: product, isLoading, isError } = useProduct(id);
  const { data: market } = useMarketAnalysis(id);
  const [sortDesc, setSortDesc] = useState(false);
  const [forSale, setForSale] = useState<boolean | undefined>(true);
  const [forTrade, setForTrade] = useState<boolean | undefined>(undefined);
  const [hasStock, setHasStock] = useState<boolean | undefined>(true);
  const { data: offersPage, isLoading: isOffersLoading } = useOffers({
    productId: id,
    forSale,
    forTrade,
    hasStock,
    sortDesc,
  });
  const { data: relatedCards, isLoading: isRelatedLoading } = useRelatedCards(
    product
      ? {
          id: product.id,
          external_id: product.external_id,
          set_external_id: product.set_external_id,
          tcg: product.tcg,
          lang: product.lang,
        }
      : null,
  );

  const { data: wishlist } = useWishlist();
  const upsertWishlist = useUpsertWishlist();
  const deleteWishlistItem = useDeleteWishlistItem();

  const isWishlisted =
    wishlist?.some((item) => item.product_id === id) ?? false;

  const toggleWishlist = () => {
    if (isWishlisted) {
      deleteWishlistItem.mutate(id);
    } else {
      upsertWishlist.mutate({ product_id: id, delta: 1 });
    }
  };

  /* ---------- Loading ---------- */
  if (isLoading) {
    return (
      <div className="w-9/12 mx-auto px-6 py-8">
        <div className="relative overflow-hidden rounded-2xl bg-white">
          <div className="relative z-10 p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-2/6 shrink-0">
                <div className="w-full aspect-2.5/3.5 rounded-xl animate-pulse bg-gray-200" />
              </div>

              <div className="flex-1 min-w-0 space-y-5">
                <div className="h-8 w-2/3 rounded-lg animate-pulse bg-gray-200" />
                <div className="flex gap-3">
                  <div className="h-6 w-28 rounded-full animate-pulse bg-gray-200" />
                  <div className="h-6 w-20 rounded-full animate-pulse bg-gray-200" />
                </div>
                <div className="flex gap-6">
                  <div className="h-4 w-32 rounded animate-pulse bg-gray-200" />
                  <div className="h-4 w-24 rounded animate-pulse bg-gray-200" />
                  <div className="h-4 w-28 rounded animate-pulse bg-gray-200" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-20 rounded-md animate-pulse bg-gray-200" />
                  <div className="h-6 w-16 rounded-md animate-pulse bg-gray-200" />
                  <div className="h-6 w-24 rounded-md animate-pulse bg-gray-200" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded animate-pulse bg-gray-200" />
                  <div className="h-4 w-5/6 rounded animate-pulse bg-gray-200" />
                  <div className="h-4 w-2/3 rounded animate-pulse bg-gray-200" />
                </div>
                <div className="h-10 w-40 rounded-xl animate-pulse bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Error / Not found ---------- */
  if (isError || !product) {
    return (
      <div className="flex-1 flex flex-col">
        <NotFound
          title="Carta no encontrada"
          description={`No pudimos encontrar el producto con ID ${id}`}
        />
      </div>
    );
  }

  return (
    <main className="mx-auto w-10/12 py-10">
      <div className="flex gap-x-10">
        {product.type === "card" ? (
          <ImageSection card={product} />
        ) : (
          <SetImage set={product} />
        )}
        <div className="flex-2 space-y-6">
          {product.type === "card" ? (
            <CardContent
              product={product}
              isWishlisted={isWishlisted}
              onToggleWishlist={toggleWishlist}
            />
          ) : (
            <SetContent
              product={product}
              isWishlisted={isWishlisted}
              onToggleWishlist={toggleWishlist}
            />
          )}
        </div>

        {/* Related cards */}
        {isRelatedLoading ? (
          <aside className="flex-1 space-y-3">
            {/* Market prices skeleton */}
            <div className="bg-gray-100 py-3 px-4 rounded-lg space-y-2">
              <div className="flex justify-around gap-3">
                {["Low", "Avg", "High"].map((label) => (
                  <div key={label} className="text-center space-y-1">
                    <div className="h-3 w-8 rounded animate-pulse bg-gray-200 mx-auto" />
                    <div className="h-5 w-14 rounded animate-pulse bg-gray-200 mx-auto" />
                  </div>
                ))}
              </div>
              <div className="text-center pt-2 border-t border-gray-200">
                <div className="h-3 w-16 rounded animate-pulse bg-gray-200 mx-auto mb-1" />
                <div className="h-4 w-12 rounded animate-pulse bg-gray-200 mx-auto" />
              </div>
            </div>
            {/* Related cards skeleton */}
            <div className="h-6 w-1/2 rounded animate-pulse bg-gray-200" />
            <div className="space-y-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-gray-50 rounded-lg p-2"
                >
                  <div className="w-10 h-14 rounded animate-pulse bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-3/4 rounded animate-pulse bg-gray-200" />
                    <div className="h-2.5 w-1/2 rounded animate-pulse bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        ) : relatedCards ? (
          <aside className="flex-1 space-y-3">
            <div className="bg-gray-100 py-3 px-4 rounded-lg space-y-2">
              {/* Prices */}
              {market ? (
                <>
                  <div className="flex  justify-around gap-3">
                    {[
                      { label: "Low", value: market.low_price },
                      { label: "Avg", value: market.average_price },
                      { label: "High", value: market.high_price },
                    ].map(({ label, value }) => (
                      <div key={label} className="text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">
                          {label}
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                          {value != null ? `$${value.toFixed(2)}` : "—"}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Stock */}
                  {market.market_stock != null && (
                    <div className="text-center pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        Total stock
                      </p>
                      <p className="text-sm font-semibold text-gray-700">
                        {market.market_stock} copias
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-20 animate-pulse rounded bg-gray-200" />
              )}
            </div>
            {relatedCards.same_lang_different_rarity.length > 0 && (
              <>
                <h1 className="font-display text-xl font-bold text-gray-800">
                  {product.set_name}
                </h1>
                <div className="space-y-1">
                  {relatedCards.same_lang_different_rarity.map((card) => (
                    <RelatedCard key={card.id} card={card} />
                  ))}
                </div>
              </>
            )}
            {relatedCards.different_lang.length > 0 && (
              <RelatedLangFilter cards={relatedCards.different_lang} />
            )}
          </aside>
        ) : null}
      </div>

      {/* Offers */}
      <section className="mt-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-gray-800">
            Ofertas
            {offersPage && ` (${offersPage.total})`}
            {market && (
              <span className="ml-3 text-sm font-normal text-gray-400">
                Low {market.low_price.toFixed(2)} PEN | Avg
                {market.average_price.toFixed(2)} PEN | High
                {market.high_price.toFixed(2)} PEN
              </span>
            )}
          </h2>

          {/* Controls */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={forSale ?? false}
                onChange={() =>
                  setForSale((v) => (v == null ? true : v ? undefined : true))
                }
                className="rounded border-gray-300"
              />
              Venta
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={forTrade ?? false}
                onChange={() =>
                  setForTrade((v) => (v == null ? true : v ? undefined : true))
                }
                className="rounded border-gray-300"
              />
              Intercambio
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasStock ?? false}
                onChange={() =>
                  setHasStock((v) => (v == null ? true : v ? undefined : true))
                }
                className="rounded border-gray-300"
              />
              En stock
            </label>
            <button
              type="button"
              onClick={() => setSortDesc((v) => !v)}
              className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider hover:text-gray-800 transition-colors"
            >
              Price {sortDesc ? "↑" : "↓"}
            </button>
          </div>
        </div>

        {/* Loading */}
        {isOffersLoading && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 px-4 py-3 ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <div className="h-4 w-24 rounded animate-pulse bg-gray-200" />
                <div className="h-3 w-16 rounded animate-pulse bg-gray-200" />
                <div className="flex-1">
                  <div className="h-5 w-20 rounded animate-pulse bg-gray-200" />
                </div>
                <div className="h-4 w-10 rounded animate-pulse bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isOffersLoading && offersPage && offersPage.items.length === 0 && (
          <div className="border border-gray-200 rounded-lg py-8 text-center text-sm text-gray-400">
            No hay ofertas disponibles
          </div>
        )}

        {/* Rows */}
        {!isOffersLoading && offersPage && offersPage.items.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {offersPage.items.map((offer, i) => (
              <div
                key={offer.stock_id}
                className={`flex items-center gap-4 px-4 py-3 ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                {/* Seller */}
                <span className="text-sm font-semibold text-gray-800 w-32 shrink-0">
                  {offer.user.name}
                </span>

                {/* Price */}
                <div className="flex-1 gap-2">
                  {/* Condition */}
                  <p className="text-xs text-gray-500 capitalize w-20 shrink-0">
                    {offer.condition.replace(/_/g, " ")}
                  </p>
                  {offer.discount > 0 ? (
                    <>
                      <span className="text-lg font-bold text-gray-800">
                        {offer.discount_price.toFixed(2)} PEN
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {offer.price.toFixed(2)} PEN
                      </span>
                      <span className="text-xs text-green-600 font-semibold">
                        -{offer.discount}%
                      </span>
                    </>
                  ) : (
                    <p className="text-lg font-bold text-gray-800">
                      {offer.price.toFixed(2)} PEN
                    </p>
                  )}
                </div>

                {/* Qty */}
                <span className="text-sm text-gray-600 w-16 text-right">
                  x{offer.quantity}
                </span>

                {/* Badge */}
                {offer.is_for_trade && (
                  <span className="text-xs text-blue-500 font-semibold w-12 text-right">
                    Trade
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

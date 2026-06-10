import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useWishlist,
  useUpsertWishlist,
  useDeleteWishlistItem,
} from "@/hooks/useCustomPacks";
import { Icon } from "@iconify-icon/react";

interface WishlistModalProps {
  open: boolean;
  onClose: () => void;
}

export function WishlistModal({ open, onClose }: WishlistModalProps) {
  return open ? <WishlistModalContent onClose={onClose} /> : null;
}

function WishlistModalContent({ onClose }: { onClose: () => void }) {
  const { data: wishlist, isLoading, isError, error } = useWishlist();
  const upsertWishlist = useUpsertWishlist();
  const deleteWishlistItem = useDeleteWishlistItem();

  // Close on Escape key
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
        className="w-full max-w-lg max-h-[80vh] flex flex-col
          rounded-2xl border border-gray-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4
          border-b border-gray-200"
        >
          <h2 className="font-display text-xl font-semibold text-gray-800">
            Lista de deseos
            {wishlist && wishlist.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({wishlist.length})
              </span>
            )}
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
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
          {isLoading && (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-xl
                    bg-gray-50 border border-gray-100 p-3"
                >
                  <div className="w-14 h-20 rounded-lg animate-pulse bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded animate-pulse bg-gray-200" />
                    <div className="h-3 w-1/2 rounded animate-pulse bg-gray-200" />
                  </div>
                  <div className="h-8 w-20 rounded-lg animate-pulse bg-gray-200" />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="py-12 text-center">
              <Icon
                icon="clarity-error-line"
                className="text-4xl text-red-400 mb-3 mx-auto"
              />
              <p className="text-red-500 text-sm">
                {error?.message ?? "Error al cargar la wishlist"}
              </p>
            </div>
          )}

          {!isLoading && !isError && (!wishlist || wishlist.length === 0) && (
            <div className="py-12 text-center">
              <Icon
                icon="clarity-favorite-line"
                className="text-4xl text-gray-300 mb-3 mx-auto"
              />
              <p className="text-gray-500 text-sm">
                Tu lista de deseos está vacía
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Agrega cartas desde la página de producto
              </p>
            </div>
          )}

          {!isLoading && !isError && wishlist && wishlist.length > 0 && (
            <ul className="flex flex-col gap-3">
              {wishlist.map((item) => (
                <WishlistRow
                  key={item.id}
                  item={item}
                  onIncrease={() =>
                    upsertWishlist.mutate({
                      product_id: item.product_id,
                      delta: 1,
                    })
                  }
                  onDecrease={() =>
                    upsertWishlist.mutate({
                      product_id: item.product_id,
                      delta: -1,
                    })
                  }
                  onDelete={() => deleteWishlistItem.mutate(item.product_id)}
                  isMutating={
                    upsertWishlist.isPending || deleteWishlistItem.isPending
                  }
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Wishlist row ─────────────────────────────────────────────────────── */

interface WishlistRowProps {
  item: {
    product_id: number;
    quantity: number;
    product: {
      id: number;
      name: string;
      set_name: string;
      images?: { image_url?: string; image_url_small?: string }[];
    };
  };
  onIncrease: () => void;
  onDecrease: () => void;
  onDelete: () => void;
  isMutating: boolean;
}

function WishlistRow({
  item,
  onIncrease,
  onDecrease,
  onDelete,
  isMutating,
}: WishlistRowProps) {
  const imageUrl =
    item.product.images?.[0]?.image_url_small ??
    item.product.images?.[0]?.image_url;

  return (
    <li
      className="relative flex items-center gap-4 rounded-xl
        py-2
        transition-colors"
    >
      {/* Loading overlay */}
      {isMutating && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center
            rounded-xl bg-white/60"
        >
          <div
            className="w-5 h-5 border-2 border-gray-300 border-t-gray-600
            rounded-full animate-spin"
          />
        </div>
      )}
      {/* Image */}
      <Link
        to={`/product/${item.product_id}`}
        onClick={(e) => e.stopPropagation()}
        className="w-14 h-20 shrink-0 rounded-lg overflow-hidden
          bg-gray-100 border border-gray-200
          hover:border-gray-400 transition-colors"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center
            text-gray-400"
          >
            <Icon icon="clarity-image-line" className="text-xl" />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/product/${item.product_id}`}
          className="font-semibold text-sm text-gray-800 truncate block
            hover:text-black transition-colors"
        >
          {item.product.name}
        </Link>
        <p className="text-xs text-gray-400 truncate mt-0.5">
          {item.product.set_name}
        </p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onDecrease}
          disabled={isMutating}
          className="w-8 h-8 flex items-center justify-center rounded-lg
            bg-white border border-gray-300
            text-gray-500 hover:bg-gray-100 hover:text-gray-800
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors"
        >
          <Icon icon="clarity-minus-line" />
        </button>

        <span className="w-8 text-center text-sm font-semibold text-gray-800 tabular-nums">
          {item.quantity}
        </span>

        <button
          type="button"
          onClick={onIncrease}
          disabled={isMutating}
          className="w-8 h-8 flex items-center justify-center rounded-lg
            bg-white border border-gray-300
            text-gray-500 hover:bg-gray-100 hover:text-gray-800
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors"
        >
          <Icon icon="clarity-plus-line" />
        </button>
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={onDelete}
        disabled={isMutating}
        className="p-2 rounded-lg text-gray-400 hover:text-red-500
          hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors shrink-0"
        title="Eliminar"
      >
        <Icon icon="clarity-trash-line" />
      </button>
    </li>
  );
}

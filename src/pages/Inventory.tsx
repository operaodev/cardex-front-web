import { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { useMyStock } from "@/hooks/useStock";
import { StockRow } from "@/components/inventory/Stock";
import { StockCreateModal } from "@/components/modal/StockCreateModal";

export default function InventoryPage() {
  const { data: stocks, isLoading, isError } = useMyStock();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <main className="mx-auto w-10/12 py-10">
      <Header />

      {isLoading && <SkeletonGrid />}

      {isError && (
        <div className="text-center py-12 text-red-500">
          <p>Error al cargar el inventario</p>
        </div>
      )}

      {!isLoading && !isError && stocks && stocks.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">Tu inventario está vacío</p>
        </div>
      )}

      {!isLoading && !isError && stocks && stocks.length > 0 && (
        <>
          <p className="text-sm text-gray-400 mb-4">
            {stocks.length} {stocks.length === 1 ? "item" : "items"}
          </p>
          <div className="grid grid-cols-6 gap-4">
            {stocks.map((stock) => (
              <StockRow key={stock.id} item={stock} />
            ))}
          </div>

          <Icon
            onClick={() => setShowCreate(true)}
            icon="game-icons:card-draw"
            className="
              fixed bottom-10 right-10
              text-5xl font-bold text-gray-100 bg-gray-700
              rounded-full p-3 shadow-lg shadow-gray-400
              hover:bg-gray-600
            "
          />
        </>
      )}

      <StockCreateModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </main>
  );
}

function Header() {
  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl font-bold text-gray-800">
        Mi Inventario
      </h1>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col bg-white border border-gray-200
            rounded-xl overflow-hidden animate-pulse"
        >
          <div className="w-full aspect-2.5/3.5 bg-gray-200" />
          <div className="px-3 pb-3 pt-2 space-y-2">
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-3 w-1/2 rounded bg-gray-200" />
            <div className="h-3 w-1/3 rounded bg-gray-200" />
          </div>
          <div className="flex justify-between px-3 pb-3 pt-1 border-t border-gray-100">
            <div className="h-4 w-14 rounded bg-gray-200" />
            <div className="h-3 w-10 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

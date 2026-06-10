import type { Product } from "@/types/product";

export function SetImage({ set }: { set: Product }) {
  const image = set.set_image_large;

  console.log(image);
  if (!image) {
    return (
      <div
        className="w-full aspect-2.5/3.5 rounded-lg flex items-center justify-center
          bg-gray-100 text-gray-400 text-sm"
      >
        <span>Sin imagen</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-2">
      <div className="bg-gray-100 relative w-full overflow-hidden rounded-2xl">
        <img
          src={image}
          alt={set.name}
          className="block w-full aspect-2.5/3.5 object-contain p-5"
        />
      </div>
    </div>
  );
}

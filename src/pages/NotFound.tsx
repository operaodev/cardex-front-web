import { useNavigate } from "react-router-dom";

export function NotFound({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full min-h-dvh gap-6 px-4">
      <div
        className="flex items-center justify-center w-24 h-24 rounded-full
          border border-gray-300"
      >
        <span className="material-symbols-outlined text-[48px] text-gray-400">
          error
        </span>
      </div>

      <div className="flex flex-col items-center gap-2 text-center max-w-sm">
        <h2 className="font-display text-xl font-bold tracking-tight text-gray-800">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="px-8 py-3 text-sm font-semibold text-white bg-black
          rounded-full hover:bg-gray-800 transition-colors"
      >
        <span className="inline-flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          Regresar a la página anterior
        </span>
      </button>
    </div>
  );
}
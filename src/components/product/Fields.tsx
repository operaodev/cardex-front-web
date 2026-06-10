export const ProductField = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="text-sm">
      <span className="text-gray-500">{label}: </span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );
};

export const ProductInfo = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="bg-gray-100 rounded-lg p-3 space-y-1 font-semibold">
      <p className="text-gray-400 text-xs uppercase tracking-wider">
        {label}
      </p>
      <p className="text-gray-800 truncate capitalize">{value}</p>
    </div>
  );
};
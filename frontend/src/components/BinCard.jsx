const getColor = (status) => {
  switch (status) {
    case "FULL": return "bg-red-500";
    case "MODERATE": return "bg-yellow-400";
    case "EMPTY": return "bg-green-500";
    default: return "bg-gray-400";
  }
};

const getBadge = (status) => {
  switch (status) {
    case "FULL": return "bg-red-500/20 text-red-400";
    case "MODERATE": return "bg-yellow-400/20 text-yellow-300";
    case "EMPTY": return "bg-green-500/20 text-green-400";
    default: return "bg-gray-500/20 text-gray-300";
  }
};

const BinCard = ({ bin }) => {
  return (
    <div className="bg-white/5 p-5 rounded-xl border border-white/10 transition hover:scale-105">

      <div className="flex justify-between mb-3">
        <h2>{bin.binId}</h2>
        <span className={`px-2 py-1 rounded ${getBadge(bin.status)}`}>
          {bin.status}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`w-3 h-3 rounded-full ${getColor(bin.status)}`}></span>
        <span>Status</span>
      </div>

      <p className="text-sm text-gray-400">
        Lat: {bin.location?.lat ?? "N/A"}
      </p>
      <p className="text-sm text-gray-400">
        Lng: {bin.location?.lng ?? "N/A"}
      </p>
    </div>
  );
};

export default BinCard;
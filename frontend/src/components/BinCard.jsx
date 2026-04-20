const getColor = (status) => {
  switch (status) {
    case "FULL":
      return "bg-red-500";
    case "MODERATE":
      return "bg-yellow-400";
    case "EMPTY":
      return "bg-green-500";
    case "HAZARDOUS":
      return "bg-purple-600";
    case "ALERT":
      return "bg-orange-500";
    default:
      return "bg-gray-400";
  }
};

const getBadge = (status) => {
  switch (status) {
    case "FULL":
      return "bg-red-500/20 text-red-400";
    case "MODERATE":
      return "bg-yellow-400/20 text-yellow-300";
    case "EMPTY":
      return "bg-green-500/20 text-green-400";
    case "HAZARDOUS":
      return "bg-purple-500/20 text-purple-400";
    case "ALERT":
      return "bg-orange-500/20 text-orange-400";
    default:
      return "bg-gray-500/20 text-gray-300";
  }
};

const BinCard = ({ bin }) => {
  return (
    <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-5 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.03] transition duration-300">
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{bin.binId}</h2>

        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadge(bin.status)}`}>
          {bin.status}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`w-3 h-3 rounded-full ${getColor(bin.status)}`}></span>
        <p className="text-sm text-gray-300">Status Indicator</p>
      </div>

      <div className="text-sm text-gray-400 space-y-1">
        <p>📍 Lat: {bin.location?.lat}</p>
        <p>📍 Lng: {bin.location?.lng}</p>
      </div>

    </div>
  );
};

export default BinCard;
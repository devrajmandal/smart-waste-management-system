import { useEffect, useState } from "react";
import API from "../services/api";
import BinCard from "../components/BinCard";
import MapView from "../components/MapView";

const Dashboard = () => {
  const [bins, setBins] = useState([]);
  const [prevBins, setPrevBins] = useState([]);

  console.log("BINS:", bins);

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const res = await API.get("/bins");
        setPrevBins(bins);

        setTimeout(() => {
          setBins(res.data);
        }, 200);

      } catch (error) {
        console.error(error);
      }
    };

    fetchBins();

    const interval = setInterval(fetchBins, 2000);
    return () => clearInterval(interval);
  }, [bins]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      
      <h1 className="text-4xl font-bold mb-8 tracking-wide">
        Smart Waste Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {bins.map((bin) => {
          const prevBin = prevBins.find((b) => b._id === bin._id);

          const statusChanged = prevBin && prevBin.status !== bin.status;

          return (
            <div
              key={bin._id}
              className={`transition-all duration-500 ease-in-out ${
                statusChanged
                  ? "scale-105 ring-2 ring-blue-400"
                  : "scale-100"
              }`}
            >
              <BinCard bin={bin} />
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">
          Route Overview
        </h2>

        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg transition-all duration-500">
          <MapView bins={bins} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
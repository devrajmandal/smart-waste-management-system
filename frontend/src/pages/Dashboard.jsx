import { useEffect, useState } from "react";
import API from "../services/api";
import BinCard from "../components/BinCard";
import MapView from "../components/MapView";

const Dashboard = () => {
  const [bins, setBins] = useState([]);
  const [prevBins, setPrevBins] = useState([]);

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const res = await API.get("/bins");

        setPrevBins((prev) => prev.length ? bins : res.data);

        setBins(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBins();

    const interval = setInterval(fetchBins, 3000); // ✅ 3 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      <h1 className="text-4xl font-bold mb-8">
        Smart Waste Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {bins.map((bin) => {
          const prev = prevBins.find((b) => b._id === bin._id);
          const changed = prev && prev.status !== bin.status;

          return (
            <div
              key={bin._id}
              className={`transition-all duration-500 ${
                changed ? "scale-105 ring-2 ring-blue-400" : ""
              }`}
            >
              <BinCard bin={bin} />
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl mb-4">Route Overview</h2>
        <MapView bins={bins} />
      </div>
    </div>
  );
};

export default Dashboard;
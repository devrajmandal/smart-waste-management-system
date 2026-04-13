import { useEffect, useState } from "react";
import API from "../services/api";
import BinCard from "../components/BinCard";
import MapView from "../components/MapView";

const Dashboard = () => {
  const [bins, setBins] = useState([]);

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const res = await API.get("/bins");
        setBins(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBins();

    // 🔁 Auto refresh every 5 sec
    const interval = setInterval(fetchBins, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8 tracking-wide">
        Smart Waste Dashboard
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {bins.map((bin) => (
          <BinCard key={bin._id} bin={bin} />
        ))}
      </div>

      {/* Map Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">
          Route Overview
        </h2>

        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
          <MapView bins={bins} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
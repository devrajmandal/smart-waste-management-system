import Bin from "../models/Bin.js";

// Haversine formula (distance between 2 points)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Simple route optimization
export const getOptimizedRoute = async (req, res) => {
  try {
    const bins = await Bin.find({ status: "FULL" });

    if (bins.length === 0) {
      return res.json({ route: [] });
    }

    let route = [];
    let visited = new Set();

    let current = bins[0];
    route.push(current);
    visited.add(current._id.toString());

    while (route.length < bins.length) {
      let nearest = null;
      let minDist = Infinity;

      for (let bin of bins) {
        if (!visited.has(bin._id.toString())) {
          const dist = getDistance(
            current.location.lat,
            current.location.lng,
            bin.location.lat,
            bin.location.lng
          );

          if (dist < minDist) {
            minDist = dist;
            nearest = bin;
          }
        }
      }

      route.push(nearest);
      visited.add(nearest._id.toString());
      current = nearest;
    }

    res.json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
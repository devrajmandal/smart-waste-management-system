import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

// Fix marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// DEPOT
const DEPOT = { lat: 20.31, lng: 85.8 };

// Truck Icon
const truckIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1995/1995506.png",
  iconSize: [35, 35],
});

// Status Color
const getColor = (status) => {
  switch (status) {
    case "FULL":
      return "red";
    case "MODERATE":
      return "yellow";
    case "EMPTY":
      return "green";
    default:
      return "blue";
  }
};

// Bin Icon
const getIcon = (status) =>
  new L.Icon({
    iconUrl: `https://maps.google.com/mapfiles/ms/icons/${getColor(status)}-dot.png`,
    iconSize: [32, 32],
  });

// Distance
const getDistance = (a, b) => {
  const R = 6371;
  const dLat = (b.lat - a.lat) * (Math.PI / 180);
  const dLng = (b.lng - a.lng) * (Math.PI / 180);

  const lat1 = a.lat * (Math.PI / 180);
  const lat2 = b.lat * (Math.PI / 180);

  const aVal =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return R * 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
};

const MapView = ({ bins }) => {
  const [route, setRoute] = useState([]);
  const [roadRoute, setRoadRoute] = useState([]);

  useEffect(() => {
    if (!bins || bins.length === 0) return;

    const fullBins = bins.filter(
      (bin) => bin.status === "FULL" && bin.location,
    );

    if (fullBins.length === 0) {
      setRoute([]);
      setRoadRoute([]);
      return;
    }

    // Generate all permutations (TSP brute force)
    const permute = (arr) => {
      if (arr.length === 1) return [arr];

      let result = [];

      arr.forEach((item, i) => {
        const rest = arr.slice(0, i).concat(arr.slice(i + 1));
        const perms = permute(rest);

        perms.forEach((p) => {
          result.push([item, ...p]);
        });
      });

      return result;
    };

    const permutations = permute(fullBins);

    let bestRoute = null;
    let minDistance = Infinity;

    permutations.forEach((routeOption) => {
      let totalDist = 0;
      let current = DEPOT;

      routeOption.forEach((bin) => {
        totalDist += getDistance(current, bin.location);
        current = bin.location;
      });

      if (totalDist < minDistance) {
        minDistance = totalDist;
        bestRoute = routeOption;
      }
    });

    setRoute(bestRoute);
  }, [bins]);

  // ROAD ROUTE
  useEffect(() => {
    const fetchRoadRoute = async () => {
      if (route.length === 0) {
        setRoadRoute([]);
        return;
      }

      const coords = [
        `${DEPOT.lng},${DEPOT.lat}`,
        ...route.map((b) => `${b.location.lng},${b.location.lat}`),
      ].join(";");

      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`,
        );
        const data = await res.json();

        if (!data.routes?.length) return;

        const path = data.routes[0].geometry.coordinates.map(([lng, lat]) => [
          lat,
          lng,
        ]);

        setRoadRoute(path);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRoadRoute();
  }, [route]);

  const validBins = bins?.filter((b) => b.location);

  return (
    <MapContainer
      center={[DEPOT.lat, DEPOT.lng]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

      {/*DEPOT */}
      <Marker position={[DEPOT.lat, DEPOT.lng]} icon={truckIcon}>
        <Popup>Truck Depot</Popup>
      </Marker>

      {/* BINS */}
      {validBins.map((bin) => (
        <Marker
          key={bin._id}
          position={[bin.location.lat, bin.location.lng]}
          icon={getIcon(bin.status)}
        >
          <Popup>
            <b>{bin.binId}</b>
            <br />
            {bin.status}
          </Popup>
        </Marker>
      ))}

      {/* ROUTE */}
      {roadRoute.length > 0 && (
        <Polyline
          positions={roadRoute}
          pathOptions={{
            color: "blue",
            weight: 6,
          }}
        />
      )}
    </MapContainer>
  );
};

export default MapView;

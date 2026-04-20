import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import API from "../services/api";

// Fix marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Status color
const getColor = (status) => {
  switch (status) {
    case "FULL":
      return "red";
    case "MODERATE":
      return "yellow";
    case "EMPTY":
      return "green";
    case "HAZARDOUS":
      return "purple";
    case "ALERT":
      return "orange";
    default:
      return "blue";
  }
};

// Marker icon
const getIcon = (status) => {
  return new L.Icon({
    iconUrl: `https://maps.google.com/mapfiles/ms/icons/${getColor(status)}-dot.png`,
    iconSize: [32, 32],
  });
};

const MapView = ({ bins }) => {
  const [route, setRoute] = useState([]);
  const [roadRoute, setRoadRoute] = useState([]);

  // 🔌 Fetch backend route
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await API.get("/route");
        setRoute(res.data);
      } catch (err) {
        console.error("Route fetch error:", err);
      }
    };
    fetchRoute();
  }, []);

  // 🚗 Fetch road-based route
  const fetchRoadRoute = async (route) => {
    try {
      const validRoute = route.filter((bin) => bin.location);

      if (validRoute.length < 2) return [];

      const coords = validRoute
        .map((bin) => `${bin.location.lng},${bin.location.lat}`)
        .join(";");

      const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.routes || data.routes.length === 0) return [];

      return data.routes[0].geometry.coordinates.map(([lng, lat]) => [
        lat,
        lng,
      ]);
    } catch (err) {
      console.error("OSRM error:", err);
      return [];
    }
  };

  // 🔁 Load road route
  useEffect(() => {
    const load = async () => {
      const coords = await fetchRoadRoute(route);
      setRoadRoute(coords);
    };

    if (route.length > 1) load();
  }, [route]);

  // ✅ Filter valid bins (FIXED)
  const validBins = bins?.filter((bin) => bin.location);

  // ✅ Filter valid route bins
  const validRoute = route?.filter((bin) => bin.location);

  return (
    <MapContainer
      center={[20.2961, 85.8245]}
      zoom={13}
      style={{ height: "500px", width: "100%", borderRadius: "12px" }}
    >
      {/* Map style */}
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

      {/* 📍 Markers (SAFE) */}
      {validBins.map((bin) => (
        <Marker
          key={bin._id}
          position={[bin.location.lat, bin.location.lng]}
          icon={getIcon(bin.status)}
        >
          <Popup>
            <b>{bin.binId}</b> <br />
            Status: {bin.status}
          </Popup>
        </Marker>
      ))}

      {/* 🟢 Start */}
      {validRoute.length > 0 && (
        <Marker
          position={[
            validRoute[0].location.lat,
            validRoute[0].location.lng,
          ]}
        >
          <Popup>Start</Popup>
        </Marker>
      )}

      {/* 🔴 End */}
      {validRoute.length > 1 && (
        <Marker
          position={[
            validRoute[validRoute.length - 1].location.lat,
            validRoute[validRoute.length - 1].location.lng,
          ]}
        >
          <Popup>End</Popup>
        </Marker>
      )}

      {/* 🧭 Route */}
      {roadRoute.length > 0 && (
        <Polyline
          positions={roadRoute}
          pathOptions={{
            color: "#2563eb",
            weight: 6,
            opacity: 0.9,
          }}
        />
      )}
    </MapContainer>
  );
};

export default MapView;
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

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

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

const getIcon = (status) =>
  new L.Icon({
    iconUrl: `https://maps.google.com/mapfiles/ms/icons/${getColor(status)}-dot.png`,
    iconSize: [32, 32],
  });

const MapView = ({ bins }) => {
  const [route, setRoute] = useState([]);
  const [roadRoute, setRoadRoute] = useState([]);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await API.get("/route");

        if (Array.isArray(res.data)) {
          setRoute(res.data);
        } else if (res.data?.data) {
          setRoute(res.data.data);
        } else {
          setRoute([]); // fallback
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRoute();
  }, []);

  const fetchRoadRoute = async (route) => {
    const valid = route.filter((b) => b.location);
    if (valid.length < 2) return [];

    const coords = valid
      .map((b) => `${b.location.lng},${b.location.lat}`)
      .join(";");

    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`,
      );
      const data = await res.json();

      if (!data.routes?.length) return [];

      return data.routes[0].geometry.coordinates.map(([lng, lat]) => [
        lat,
        lng,
      ]);
    } catch {
      return [];
    }
  };

  useEffect(() => {
    if (route.length > 1) {
      fetchRoadRoute(route).then(setRoadRoute);
    }
  }, [route]);

  const validBins = bins?.filter((b) => b.location);
  const validRoute = route?.filter((b) => b.location);

  return (
    <MapContainer
      center={[20.2961, 85.8245]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

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

      {validRoute.length > 0 && (
        <Marker
          position={[validRoute[0].location.lat, validRoute[0].location.lng]}
        >
          <Popup>Start</Popup>
        </Marker>
      )}

      {validRoute.length > 1 && (
        <Marker
          position={[
            validRoute.at(-1).location.lat,
            validRoute.at(-1).location.lng,
          ]}
        >
          <Popup>End</Popup>
        </Marker>
      )}

      {roadRoute.length > 0 && (
        <Polyline
          positions={roadRoute}
          pathOptions={{ color: "#2563eb", weight: 6 }}
        />
      )}
    </MapContainer>
  );
};

export default MapView;

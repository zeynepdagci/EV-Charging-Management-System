"use client";  // This is necessary for using hooks like useState and useEffect in a Client Component

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Define the type for the charging station data
interface ChargingStation {
  ID: number;
  AddressInfo: {
    Title: string;
    AddressLine1?: string;
    Town?: string;
    StateOrProvince?: string;
    Postcode?: string;
    Country?: { Title: string };
    Latitude: number;
    Longitude: number;
  };
  Connections?: Array<{
    PowerKW?: number;
    Quantity?: number;
    ConnectionType?: { Title: string };
  }>;
  StatusType?: { IsOperational: boolean };
}

export default function Dashboard() {
  const [chargingStations, setChargingStations] = useState<ChargingStation[]>([]);

  // Create a custom icon using images from the public folder
  const customIcon = new L.Icon({
    iconUrl: "/images/icon/marker-icon.png",  // Use URL from public folder
    shadowUrl: "/images/icon/marker-shadow.png",  // Use URL from public folder
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  useEffect(() => {
    fetch(
      "https://api.openchargemap.io/v3/poi?latitude=51.509865&longitude=-0.118092&distance=10&minpowerkw=50&key=334e438a-617a-45e6-82d9-59b9423c7962"
    )
      .then((response) => response.json())
      .then((data) => setChargingStations(data));
  }, []);

  const handleReserve = (stationId: number) => {
    alert(`Reservation successful for Station ID: ${stationId}`);
  };

  return (
    <div style={{ height: "100vh" }}>
      <h1>EV Charging Station Locator</h1>
      <MapContainer center={[51.509865, -0.118092]} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {chargingStations.map(
          (station) =>
            station.AddressInfo?.Latitude &&
            station.AddressInfo?.Longitude && (
              <Marker
                key={station.ID}
                position={[station.AddressInfo.Latitude, station.AddressInfo.Longitude]}
                icon={customIcon} // Use custom icon here
              >
                <Popup>
                  <strong>{station.AddressInfo.Title}</strong>
                  <br />
                  <em>{station.AddressInfo.AddressLine1 || "N/A"}</em>
                  <br />
                  {station.AddressInfo.Town || "N/A"}, {station.AddressInfo.Postcode || "N/A"}
                  <br />
                  <strong>Power:</strong> {station.Connections?.[0]?.PowerKW || "N/A"} kW
                  <br />
                  <strong>Type:</strong> {station.Connections?.[0]?.ConnectionType?.Title || "N/A"}
                  <br />
                  <strong>Status:</strong> {station.StatusType?.IsOperational ? "Operational" : "Not Operational"}
                  <br />
                  <button
                    onClick={() => handleReserve(station.ID)}
                    style={{
                      marginTop: "10px",
                      padding: "5px 10px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Reserve
                  </button>
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>
    </div>
  );
}

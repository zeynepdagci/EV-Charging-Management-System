// "use client";
// import React from "react";
// // import ChartThree from "../Charts/ChartThree";
// // import ChartTwo from "../Charts/ChartTwo";
// // import ChatCard from "../Chat/ChatCard";
// // import TableOne from "../Tables/TableOne";
// // import MapOne from "../Maps/MapOne";
// // import DataStatsOne from "@/components/DataStats/DataStatsOne";
// // import ChartOne from "@/components/Charts/ChartOne";

// // const OpenChargeMap: React.FC = () => {
// //   return (
// //     <>
// //       {/* <DataStatsOne />

// //       <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
// //         <ChartOne />
// //         <ChartTwo />
// //         <ChartThree />
// //         <MapOne />
// //         <div className="col-span-12 xl:col-span-8">
// //           <TableOne />
// //         </div>
// //         <ChatCard />
// //       </div> */}
// //     </>
// //   );
// // };

// // export default OpenChargeMap;

// import { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';

// // Define the type for the charging station data
// interface ChargingStation {
//   ID: number;
//   AddressInfo: {
//     Title: string;
//     Latitude: number;
//     Longitude: number;
//   };
//   Connections?: Array<{
//     PowerKW?: number;
//   }>;
// }

// export default function Dashboard() {
//   const [chargingStations, setChargingStations] = useState<ChargingStation[]>([]);

//   useEffect(() => {
//     fetch(
//       'https://api.openchargemap.io/v3/poi?latitude=51.509865&longitude=-0.118092&distance=10&minpowerkw=50&key=YOUR_API_KEY'
//     )
//       .then((response) => response.json())
//       .then((data) => setChargingStations(data));
//   }, []);

//   return (
//     <div style={{ height: '100vh' }}>
//       <h1>EV Charging Station Locator</h1>
//       <MapContainer
//         center={[51.509865, -0.118092]} // Updated center prop
//         zoom={13}
//         style={{ height: '500px', width: '100%' }}
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         {chargingStations.map((station) => (
//           station.AddressInfo?.Latitude &&
//           station.AddressInfo?.Longitude && (
//             <Marker
//               key={station.ID}
//               position={[
//                 station.AddressInfo.Latitude,
//                 station.AddressInfo.Longitude,
//               ]}
//             >
//               <Popup>
//                 {station.AddressInfo.Title} <br />
//                 Power: {station.Connections?.[0]?.PowerKW || 'N/A'} kW
//               </Popup>
//             </Marker>
//           )
//         ))}
//       </MapContainer>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Define the type for the charging station data
interface ChargingStation {
  ID: number;
  AddressInfo: {
    Title: string;
    Latitude: number;
    Longitude: number;
  };
  Connections?: Array<{
    PowerKW?: number;
  }>;
}

export default function Dashboard() {
  const [chargingStations, setChargingStations] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      'https://api.openchargemap.io/v3/poi/?output=json&latitude=51.5074&longitude=-0.1278&distance=10'
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch charging stations");
        }
        return response.json();
      })
      .then((data) => {
        setChargingStations(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Define center as a tuple (LatLngTuple)
  const defaultCenter: [number, number] = [51.509865, -0.118092]; // Default to London
  const centerPosition: [number, number] =
    chargingStations.length > 0
      ? [chargingStations[0].AddressInfo.Latitude, chargingStations[0].AddressInfo.Longitude]
      : defaultCenter;

  return (
    <div style={{ height: "100vh", padding: "20px" }}>
      <h1>EV Charging Station Locator</h1>

      {loading ? (
        <p>Loading charging stations...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <MapContainer center={centerPosition} zoom={13} style={{ height: "500px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {chargingStations.map(
            (station) =>
              station.AddressInfo?.Latitude &&
              station.AddressInfo?.Longitude && (
                <Marker
                  key={station.ID}
                  position={[
                    station.AddressInfo.Latitude,
                    station.AddressInfo.Longitude,
                  ]}
                >
                  <Popup>
                    <strong>{station.AddressInfo.Title}</strong>
                    <br />
                    Power: {station.Connections?.[0]?.PowerKW ?? "N/A"} kW
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      )}
    </div>
  );
}

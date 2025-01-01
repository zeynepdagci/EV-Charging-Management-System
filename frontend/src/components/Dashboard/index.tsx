"use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import FilterSidebar from "../Map/FilterSideBar";
import { IconButton, Typography, Button } from "@mui/material"; // Import Button from MUI
import MenuIcon from "@mui/icons-material/Menu";
import { loadStripe } from "@stripe/stripe-js";
import ReserveButton from "../Map/ReserveButton";

// Define the type for the charging station data
interface ChargingStationData {
  station_id: number;
  location: string;
  latitude: number;
  longitude: number;
  availability_status: string;
  charging_speed: string;
  power_capacity: number;
  price_per_kwh: number;
  connector_types: string;
}

// Create a custom icon using images from the public folder
const customIcon = new L.Icon({
  iconUrl: "/images/icon/marker-icon.png",
  shadowUrl: "/images/icon/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Fetch stations from backend
const fetchStations = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch("http://127.0.0.1:8000/charging-stations/all/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Add Bearer token
    },
  });

  const responseJSON = await response.json();

  if (!response.ok) {
    throw new Error(responseJSON);
  }

  console.log("Stations: ", responseJSON);
  return responseJSON;
};

export default function Dashboard() {
  const [chargingStations, setChargingStations] = useState<
    ChargingStationData[]
  >([]);
  const [filteredChargingStations, setFilteredChargingStations] = useState<
    ChargingStationData[]
  >([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPowerKw: 50,
    distance: 10,
    status: "All",
  });

  // Filter stations based on the selected status and power filter
  useEffect(() => {
    console.log("Filters:", filters);
    const { minPowerKw, status } = filters;

    const filteredStations = chargingStations.filter(
      (station: ChargingStationData) => {
        const isPowerValid = station.power_capacity >= minPowerKw;

        // Filter based on status
        const isStatusValid =
          status === "All" ||
          (status === "Available" &&
            station.availability_status === "available") ||
          (status === "In Use" &&
            station.availability_status === "unavailable");

        // Only return stations that pass both the power and status filters
        return isPowerValid && isStatusValid;
      },
    );

    setFilteredChargingStations(filteredStations);
  }, [filters, chargingStations]); // Re-filter stations when filters or stations change

  useEffect(() => {
    fetchStations()
      .then((stations) => {
        setChargingStations(stations);
      })
      .catch((error) => {
        console.error("Error fetching stations:", error);
        // Redirect to login page as token is invalid or expired
        window.location.href = "/auth/signin";
      });
  }, []); // Fetch stations when the component mounts (on initial render)

  const stripePromise = loadStripe(
    "pk_test_51QTtdYIcvWpTvnoduZ2Pd0i5NblzFzfmlNP6wFzj8cFgFnlBkLhmWe9QTb5AiIbkdtZ4XpbJEQGrQYOfp6ji5ZzB00M3iaV4za",
  ); // Replace with your Stripe public key

  // Handler for the Reserve button
  const handleReserve = async (stationID: number) => {
    // checkout();
    // try {
    //   const response = await fetch("/create-checkout-session", {  // Your backend endpoint
    //     method: "POST",
    //     body: JSON.stringify({ stationID }),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });

    //   const session = await response.json();  // Session from your server
    //   const stripe = await stripePromise;

    //   // Redirect to Stripe Checkout page
    //   const { error } = await stripe!.redirectToCheckout({
    //     sessionId: session.id,
    //   });

    //   if (error) {
    //     console.error("Error during Stripe Checkout:", error);
    //   }
    // } catch (error) {
    //   console.error("Error during reservation:", error);
    // }
    console.log(`Reserved charging station with ID: ${stationID}`);
    // Add your reservation logic here (e.g., API call, state change, etc.)
  };

  return (
    <div style={{ height: "100vh" }}>
      <IconButton onClick={() => setSidebarOpen(true)}>
        <MenuIcon />
      </IconButton>
      <FilterSidebar
        open={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
      <MapContainer
        center={[51.509865, -0.118092]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredChargingStations.map((station) => (
          <Marker
            key={station.station_id}
            position={[station.latitude, station.longitude]}
            icon={customIcon}
          >
            <Popup>
              <strong>{station.location}</strong>
              <br />
              <strong>Power:</strong> {station.power_capacity} kW
              <br />
              <strong>Status:</strong> {station.availability_status}
              <br />
              {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleReserve(station.ID)}
                    style={{ marginTop: "10px" }}
                  >
                    Reserve
                  </Button> */}
              <ReserveButton
                chargingStationId={1}
                startTime="2024-12-30T13:30:00Z"
                endTime="2024-12-30T14:00:00Z"
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

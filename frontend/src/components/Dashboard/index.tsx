"use client"
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import FilterSidebar from "../Map/FilterSideBar";
import { IconButton, Typography, Button } from "@mui/material";  // Import Button from MUI
import MenuIcon from "@mui/icons-material/Menu";
import { loadStripe } from "@stripe/stripe-js";

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
  StatusType?: { IsOperational: boolean };  // Operational status from the API (Available/In Use)
}

export default function Dashboard() {
  const [chargingStations, setChargingStations] = useState<ChargingStation[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({ minPowerKw: 50, distance: 10, status: "All" });

  // Create a custom icon using images from the public folder
  const customIcon = new L.Icon({
    iconUrl: "/images/icon/marker-icon.png",
    shadowUrl: "/images/icon/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Fetch stations with filters and status from API
  const fetchStations = () => {
    const { minPowerKw, distance, status } = filters;
    const latitude = 51.509865; // Set to user's location or predefined value
    const longitude = -0.118092; // Set to user's location or predefined value

    fetch(
      `https://api.openchargemap.io/v3/poi?latitude=${latitude}&longitude=${longitude}&distance=${distance}&minpowerkw=${minPowerKw}&key=334e438a-617a-45e6-82d9-59b9423c7962`
    )
      .then((response) => response.json())
      .then((data) => {
        // Filter stations based on the selected status
        const filteredStations = data.filter((station: ChargingStation) => {
          if (status === "All") return true; // No filter applied
          const operational = station.StatusType?.IsOperational;
          return status === "Available" ? operational : !operational;  // Filter based on availability
        });
        setChargingStations(filteredStations);
      });
  };

  useEffect(() => {
    fetchStations();
  }, [filters]); // Re-fetch stations when filters change


  const stripePromise = loadStripe("pk_test_51QTtdYIcvWpTvnoduZ2Pd0i5NblzFzfmlNP6wFzj8cFgFnlBkLhmWe9QTb5AiIbkdtZ4XpbJEQGrQYOfp6ji5ZzB00M3iaV4za"); // Replace with your Stripe public key

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
      <Typography variant="h4" gutterBottom>
        EV Charging Station Locator
      </Typography>
      <IconButton onClick={() => setSidebarOpen(true)}>
        <MenuIcon />
      </IconButton>
      <FilterSidebar
        open={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        filters={filters}
        setFilters={setFilters}
        fetchStations={fetchStations}
      />
      <MapContainer center={[51.509865, -0.118092]} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {chargingStations.map(
          (station) =>
            station.AddressInfo?.Latitude &&
            station.AddressInfo?.Longitude && (
              <Marker
                key={station.ID}
                position={[station.AddressInfo.Latitude, station.AddressInfo.Longitude]}
                icon={customIcon}
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
                  <strong>Status:</strong>{" "}
                  {station.StatusType?.IsOperational ? "Available" : "In Use"}
                  <br />
                  {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleReserve(station.ID)}
                    style={{ marginTop: "10px" }}
                  >
                    Reserve
                  </Button> */}
                  <form action="/api/checkout_sessions" method="POST">
                    <section>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        style={{ marginTop: "10px" }}
                      >
                        Reserve
                      </Button>
                    </section>
                  </form>
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>
    </div>
  );
}

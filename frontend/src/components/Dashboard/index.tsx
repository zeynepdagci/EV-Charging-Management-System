"use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import FilterSidebar from "../Map/FilterSideBar";
import { IconButton, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { loadStripe } from "@stripe/stripe-js";
import ReserveButton from "../Map/ReserveButton";
import Cookies from "js-cookie";

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

const customIcon = new L.Icon({
  iconUrl: "/images/icon/marker-icon.png",
  shadowUrl: "/images/icon/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const fetchStations = async () => {
  const token = Cookies.get("accessToken");
  if (token === undefined) {
    throw new Error("No access token found");
  }

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
  const [chargingStations, setChargingStations] = useState<ChargingStationData[]>([]);
  const [filteredChargingStations, setFilteredChargingStations] = useState<ChargingStationData[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPowerKw: 50,
    distance: 10,
    status: "All",
  });
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null); // Store the current location

  useEffect(() => {
    const { minPowerKw, status } = filters;

    const filteredStations = chargingStations.filter((station: ChargingStationData) => {
      const isPowerValid = station.power_capacity >= minPowerKw;

      const isStatusValid =
        status === "All" ||
        (status === "Available" && station.availability_status === "available") ||
        (status === "In Use" && station.availability_status === "unavailable");

      return isPowerValid && isStatusValid;
    });

    setFilteredChargingStations(filteredStations);
  }, [filters, chargingStations]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    fetchStations()
      .then((stations) => {
        setChargingStations(stations);
      })
      .catch((error) => {
        console.error("Error fetching stations:", error);
        window.location.href = "/auth/signin";
      });
  }, []);

  const stripePromise = loadStripe("pk_test_51QTtdYIcvWpTvnoduZ2Pd0i5NblzFzfmlNP6wFzj8cFgFnlBkLhmWe9QTb5AiIbkdtZ4XpbJEQGrQYOfp6ji5ZzB00M3iaV4za");

  const handleReserve = async (stationID: number) => {
    console.log(`Reserved charging station with ID: ${stationID}`);
  };

  const getStartTime = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes()); // Start time is 30 minutes from now
    return date.toISOString();
  };

  const getEndTime = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 90); // End time is 90 minutes from now
    return date.toISOString();
  };

  return (
    <div style={{ height: "100vh" }}>
      <IconButton onClick={() => setSidebarOpen(true)}>
        <MenuIcon />
      </IconButton>
      <FilterSidebar open={isSidebarOpen} onClose={() => setSidebarOpen(false)} filters={filters} setFilters={setFilters} />
      <MapContainer
        center={currentLocation || [51.509865, -0.118092]} // Default to London if location is unavailable
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {filteredChargingStations.map((station) => (
          <Marker key={station.station_id} position={[station.latitude, station.longitude]} icon={customIcon}>
            <Popup>
              <strong>{station.location}</strong>
              <br />
              <strong>Power:</strong> {station.power_capacity} kW
              <br />
              <strong>Status:</strong> {station.availability_status}
              <br />
              <ReserveButton chargingStationId={station.station_id} startTime={getStartTime()} endTime={getEndTime()} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

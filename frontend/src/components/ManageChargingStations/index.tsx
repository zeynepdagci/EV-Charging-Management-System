"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Server } from "@/server/requests";

interface ChargingStationData {
  station_id: number;
  location: string;
  availability_status: string;
  charging_speed: string;
  power_capacity: number;
  price_per_kwh: number;
  connector_types: string;
}

const ManageStations: React.FC = () => {
  const [data, setData] = useState<ChargingStationData>({
    station_id: 0,
    location: "",
    availability_status: "",
    charging_speed: "",
    power_capacity: 0,
    price_per_kwh: 0,
    connector_types: "",
  });

  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [stations, setStations] = useState<ChargingStationData[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const token: string = Cookies.get("accessToken") ?? "";
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
  
    if (
      !data.location ||
      !data.availability_status ||
      !data.charging_speed ||
      data.power_capacity === 0 ||
      data.price_per_kwh === 0 ||
      !data.connector_types
    ) {
      setError("Please fill in all fields.");
      return;
    }
  
    if (!token) {
      setError("Authorization token is missing.");
      return;
    }
  
    try {
      const url = isEditMode
        ? `http://127.0.0.1:8000/charging-stations/${data.station_id}/update/`
        : "http://127.0.0.1:8000/charging-stations/add/";
      const method = isEditMode ? "PUT" : "POST";
  
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log(
          isEditMode ? "Charging station updated successfully" : "Charging station added successfully"
        );
        setOpen(false);
        fetchChargingStations();
        setIsEditMode(false);
        setData({
          station_id: 0,
          location: "",
          availability_status: "",
          charging_speed: "",
          power_capacity: 0,
          price_per_kwh: 0,
          connector_types: "",
        });
      } else {
        const errorData = await response.json();
        setError(
          errorData.message ||
            (isEditMode
              ? "Failed to update charging station. Please try again."
              : "Failed to add charging station. Please try again.")
        );
      }
    } catch (error) {
      setError("Network error. Please try again later.");
      console.error("Network error:", error);
    }
  };
  const handleEdit = (station: ChargingStationData) => {
    setIsEditMode(true);
    setOpen(true);
    setData(station);
  };
    
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const fetchChargingStations = async () => {
    if (!token) {
      setError("Authorization token is missing.");
      return;
    }

    try {
      const response = await Server.getChargingStationsForUser(token);
      if (!response.ok) {
        throw new Error("Failed to fetch charging stations.");
      }
      const data = await response.json();
      setStations(data);
    } catch (error) {
      console.error("Error fetching charging stations:", error);
      setError("Error fetching charging stations.");
    }
  };
  useEffect(() => {
    fetchChargingStations();
  }, []);

  const handleDelete = async (stationId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this station?"
    );
    if (!confirmDelete) return;

    if (!token) {
      setError("Authorization token is missing.");
      return;
    }

    try {
      const response = await Server.deleteChargingStation(token, stationId);

      if (response.ok) {
        setStations((prevStations) =>
          prevStations.filter((station) => station.station_id !== stationId)
        );
        alert("Charging station deleted successfully.");
      } else {
        const errorData = await response.json();
        setError(
          errorData.message || "Failed to delete charging station. Please try again."
        );
      }
    } catch (error) {
      setError("Network error. Please try again later.");
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    fetchChargingStations();
  }, []);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-start", width: "auto" }}>
        <button
          className="flex w-auto justify-center rounded-lg bg-primary p-4 font-medium text-white hover:bg-opacity-90"
          onClick={handleOpen}
        >
          Add Charging Station
        </button>
      </div>
        <br />
      {open && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-lg bg-white p-6 shadow-lg dark:bg-dark-2"
        >
          <div className="mb-4">
            <label htmlFor="location" className="mb-2.5 block font-medium text-dark dark:text-white">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={data.location}
              onChange={handleChange}
              placeholder="Enter the location"
              className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="availabilityStatus" className="mb-2.5 block font-medium text-dark dark:text-white">
              Availability Status
            </label>
            <input
              type="text"
              name="availability_status"
              value={data.availability_status}
              onChange={handleChange}
              placeholder="Enter the availability status"
              className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="chargingSpeed" className="mb-2.5 block font-medium text-dark dark:text-white">
              Charging Speed
            </label>
            <input
              type="text"
              name="charging_speed"
              value={data.charging_speed}
              onChange={handleChange}
              placeholder="Enter the charging speed"
              className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="power_capacity" className="mb-2.5 block font-medium text-dark dark:text-white">
              Power Capacity
            </label>
            <input
              type="number"
              name="power_capacity"
              value={data.power_capacity}
              onChange={handleChange}
              placeholder="Enter the power capacity"
              className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="price_per_kwh" className="mb-2.5 block font-medium text-dark dark:text-white">
              Price Per KWh
            </label>
            <input
              type="number"
              name="price_per_kwh"
              value={data.price_per_kwh}
              onChange={handleChange}
              placeholder="Enter the price per KWh"
              className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="connectorTypes" className="mb-2.5 block font-medium text-dark dark:text-white">
              Connector Types
            </label>
            <input
              type="text"
              name="connector_types"
              value={data.connector_types}
              onChange={handleChange}
              placeholder="Enter connector types"
              className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
          </div>
          
          <button
            type="submit"
            className="w-full rounded-lg bg-primary p-4 text-center font-medium text-white hover:bg-opacity-90"
          >
            {isEditMode ? "Update Charging Station" : "Add Charging Station"}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="w-full mt-2 rounded-lg bg-gray-500 p-4 text-center font-medium text-white hover:bg-opacity-90"
          >
            Close
          </button>
        </form>
      )}

      {error && (
        <div className="mt-4 text-red-600">
          <p>{error}</p>
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow-md dark:bg-dark-2">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b dark:border-dark-3">
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Availability Status</th>
              <th className="px-6 py-4">Charging Speed</th>
              <th className="px-6 py-4">Power Capacity</th>
              <th className="px-6 py-4">Price Per KWh</th>
              <th className="px-6 py-4">Connector Types</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stations.length > 0 ? (
              stations.map((station) => (
                <tr
                  key={station.station_id}
                  className="border-t hover:bg-gray-50 dark:border-dark-3 dark:hover:bg-dark-2"
                >
                  <td className="px-6 py-4">{station.location}</td>
                  <td className="px-6 py-4">{station.availability_status}</td>
                  <td className="px-6 py-4">{station.charging_speed}</td>
                  <td className="px-6 py-4">{station.power_capacity}</td>
                  <td className="px-6 py-4">£{station.price_per_kwh}</td>
                  <td className="px-6 py-4">{station.connector_types}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(station.station_id)}
                      className="rounded-lg bg-red-500 p-2 font-medium text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <td>
                    <button
                      onClick={() => handleEdit(station)}
                      className="rounded-lg bg-blue-500 p-2 font-medium text-white hover:bg-blue-600"
                    >
                      Update
                    </button>
                    </td>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  No stations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageStations;

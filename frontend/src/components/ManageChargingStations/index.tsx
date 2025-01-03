"use client";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";

interface ChargingStationData {
  location: string;
  availability_status: string;
  charging_speed: string;
  power_capacity: number;
  price_per_kwh: number;
  connector_types: string;
}

const ManageStations: React.FC = () => {
  const [data, setData] = useState<ChargingStationData>({
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

  const token = Cookies.get("accessToken"); // replace with your actual token retrieval logic

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Reset error message

    // Ensure all required fields are filled in
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
      const response = await fetch(
        "http://127.0.0.1:8000/charging-stations/add/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add Bearer token
          },
          body: JSON.stringify(data),
        },
      );

      if (response.ok) {
        console.log("Charging station added successfully");
        setOpen(false);
        fetchChargingStations(); // Refresh the list after adding a new station
      } else {
        const errorData = await response.json();
        setError(
          errorData.message ||
            "Failed to add charging station. Please try again.",
        );
      }
    } catch (error) {
      setError("Network error. Please try again later.");
      console.error("Network error:", error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchChargingStations = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/charging-stations/user/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add Bearer token
          },
        },
      );
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

  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "flex-start", width: "auto" }}
      >
        <button
          className="flex w-auto justify-center rounded-lg bg-primary p-4 font-medium text-white hover:bg-opacity-90"
          onClick={handleOpen}
        >
          Add Charging Station
        </button>
      </div>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-lg bg-white p-6 shadow-lg dark:bg-dark-2"
        >
          <div className="mb-4">
            <label
              htmlFor="location"
              className="mb-2.5 block font-medium text-dark dark:text-white"
            >
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
            <label
              htmlFor="availabilityStatus"
              className="mb-2.5 block font-medium text-dark dark:text-white"
            >
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
            <label
              htmlFor="chargingSpeed"
              className="mb-2.5 block font-medium text-dark dark:text-white"
            >
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
            <label
              htmlFor="power_capacity"
              className="mb-2.5 block font-medium text-dark dark:text-white"
            >
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
            <label
              htmlFor="price_per_kwh"
              className="mb-2.5 block font-medium text-dark dark:text-white"
            >
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
            <label
              htmlFor="connectorTypes"
              className="mb-2.5 block font-medium text-dark dark:text-white"
            >
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

          {error && (
            <div className="mb-4 font-medium text-red-500">{error}</div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg bg-gray-300 p-4 font-medium text-dark hover:bg-gray-400 dark:bg-dark-3 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary p-4 font-medium text-white hover:bg-opacity-90"
            >
              Save
            </button>
          </div>
        </form>
      )}

      <div className="mt-8">
        <div className="overflow-x-auto rounded-lg bg-white p-6 shadow-lg">
          <table className="min-w-full table-auto text-left text-sm text-gray-500 dark:text-white">
            <thead className="bg-gray-100 dark:bg-dark-3">
              <tr>
                <th className="px-6 py-3 font-medium text-dark">Location</th>
                <th className="px-6 py-3 font-medium text-dark">
                  Availability Status
                </th>
                <th className="px-6 py-3 font-medium text-dark">
                  Charging Speed
                </th>
                <th className="px-6 py-3 font-medium text-dark">
                  Power Capacity
                </th>
                <th className="px-6 py-3 font-medium text-dark">
                  Price Per KWh
                </th>
                <th className="px-6 py-3 font-medium text-dark">
                  Connector Types
                </th>
              </tr>
            </thead>
            <tbody>
              {stations.length > 0 ? (
                stations.map((station, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 dark:border-dark-3 dark:hover:bg-dark-2"
                  >
                    <td className="px-6 py-4">{station.location}</td>
                    <td className="px-6 py-4">{station.availability_status}</td>
                    <td className="px-6 py-4">{station.charging_speed}</td>
                    <td className="px-6 py-4">{station.power_capacity}</td>
                    <td className="px-6 py-4">${station.price_per_kwh}</td>
                    <td className="px-6 py-4">{station.connector_types}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    No stations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ManageStations;

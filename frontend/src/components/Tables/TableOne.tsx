"use client";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";

interface MostVisitedStationData {
  station_id: number;
  location: string;
  latitude: number;
  longitude: number;
  availability_status: string;
  charging_speed: number;
  power_capacity: number;
  price_per_kwh: number;
  connector_types: string;
  visits: number;
}

const MostVisitedStation: React.FC = () => {
  const [data, setData] = useState<MostVisitedStationData | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const token = Cookies.get("accessToken");

  const fetchMostVisitedStation = async () => {
    try {
      setLoading(true);
      if (!token) {
        setError("Authorization token is missing.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/reservations/most-visited/", // API endpoint
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch most visited station.");
      }

      const result: MostVisitedStationData = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMostVisitedStation();
  }, []);

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-dark-2 dark:shadow-card">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : data ? (
        <table className="min-w-full table-auto text-left text-sm text-gray-500 dark:text-white">
          <thead className="bg-gray-100 dark:bg-dark-3">
            <tr>
              <th className="px-6 py-3 font-medium text-dark">Location</th>
              <th className="px-6 py-3 font-medium text-dark">Charging Speed (kW)</th>
              <th className="px-6 py-3 font-medium text-dark">Power Capacity (kW)</th>
              <th className="px-6 py-3 font-medium text-dark">Price per kWh</th>
              <th className="px-6 py-3 font-medium text-dark">Connector Types</th>
              <th className="px-6 py-3 font-medium text-dark">Total Visits</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t hover:bg-gray-50 dark:border-dark-3 dark:hover:bg-dark-2">
              <td className="px-6 py-4">{data.location}</td>
              <td className="px-6 py-4">{data.charging_speed}</td>
              <td className="px-6 py-4">{data.power_capacity}</td>
              <td className="px-6 py-4">{data.price_per_kwh}</td>
              <td className="px-6 py-4">{data.connector_types}</td>
              <td className="px-6 py-4">{data.visits}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default MostVisitedStation;

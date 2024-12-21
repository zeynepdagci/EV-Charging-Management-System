"use client";
import React, { useState } from "react";

interface ChargingStationData {
  price: string;
  connectorType: string;
}

const ManageStations: React.FC = () => {
  const [data, setData] = useState<ChargingStationData>({
    price: "",
    connectorType: "",
  });

  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState(false);

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

    if (!data.price || !data.connectorType) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/charging-stations/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify(data),
        body: JSON.stringify({
            price: data.price,
            connectorType: data.connectorType
          }),
    });

      if (response.ok) {
        console.log("Charging station added successfully");
        setOpen(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to add charging station. Please try again.");
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

      {open && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-white rounded-lg shadow-lg p-6 dark:bg-dark-2"
        >
          <div className="mb-4">
            <label
              htmlFor="price"
              className="mb-2.5 block font-medium text-dark dark:text-white"
            >
              Price
            </label>
            <input
              type="number"
              name="price"
              value={data.price}
              onChange={handleChange}
              placeholder="Enter the price"
              className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="connectorType"
              className="mb-2.5 block font-medium text-dark dark:text-white"
            >
              Connector Type
            </label>
            <input
              type="text"
              name="connectorType"
              value={data.connectorType}
              onChange={handleChange}
              placeholder="Enter the connector type"
              className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
            />
          </div>

          {error && (
            <div className="mb-4 text-red-500 font-medium">{error}</div>
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
    </>
  );
};

export default ManageStations;

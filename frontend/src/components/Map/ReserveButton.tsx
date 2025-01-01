import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@mui/material";

interface ReserveButtonProps {
  chargingStationId: number;
  startTime: string;
  endTime: string;
}

const ReserveButton = ({
  chargingStationId,
  startTime,
  endTime,
}: ReserveButtonProps) => {
  const handleReserve = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/create-checkout-session/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          charging_station_id: chargingStationId,
          start_time: startTime,
          end_time: endTime,
        }),
      },
    );

    const { url } = await response.json();

    // Redirect to Stripe Checkout
    window.location.href = url;
  };

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      style={{ marginTop: "10px" }}
      onClick={handleReserve}
    >
      Reserve
    </Button>
  );
};

export default ReserveButton;

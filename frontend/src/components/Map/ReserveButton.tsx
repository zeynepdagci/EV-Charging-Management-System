import React from "react";
import { Button } from "@mui/material";
import Cookies from "js-cookie";
import { Server } from "@/server/requests";

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
    const response = await Server.createCheckoutSession(
      Cookies.get("accessToken") ?? "",
      chargingStationId,
      startTime,
      endTime,
    );

    const { url } = await response.json();
    console.log("URL", url);

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

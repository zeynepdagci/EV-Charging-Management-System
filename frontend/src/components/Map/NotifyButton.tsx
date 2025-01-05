"use client";
import React from "react";
import { Button } from "@mui/material";
import Cookies from "js-cookie";
import { Server } from "@/server/requests";

interface NotifyButtonProps {
  chargingStationId: number;
}

const NotifyButton = ({ chargingStationId }: NotifyButtonProps) => {
  const handleNotify = async () => {
    try {
      const response = await Server.requestNotification(
        Cookies.get("accessToken") ?? "",
        chargingStationId,
      );

      if (response.ok) {
        alert("You will be notified when the station becomes available.");
      } else {
        alert("Failed to request notification. Please try again.");
      }
    } catch (error) {
      console.error("Error requesting notification:", error);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      style={{ marginTop: "10px" }}
      onClick={handleNotify}
    >
      Notify Me
    </Button>
  );
};

export default NotifyButton;

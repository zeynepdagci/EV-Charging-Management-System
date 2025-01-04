"use client";
import { useEffect } from "react";
import { Server } from "@/server/requests";
import { fetchStations } from "@/utils";

function useReservationUpdates(setChargingStations: Function) {
  useEffect(() => {
    const socket = new WebSocket(`ws://${Server.SERVER_IP}/ws/reservations/`);

    socket.onmessage = async (event) => {
      console.log("Update received, refetching data for stations");
      setChargingStations(await fetchStations());
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);
}

export default useReservationUpdates;

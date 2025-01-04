"use client";
import { useEffect } from "react";
import { Server } from "@/server/requests";
import { fetchStations } from "@/utils";

function useReservationUpdates(setChargingStations: Function) {
  useEffect(() => {
    const socket = new WebSocket(
      `${Server.SERVER_URL_SOCKET}/ws/reservations/`,
    );

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

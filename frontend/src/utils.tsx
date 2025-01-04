import Cookies from "js-cookie";
import { Server } from "./server/requests";

export async function checkAuth(token?: string) {
  return token !== undefined && (await Server.validateToken(token));
}

export const fetchStations = async () => {
  const token = Cookies.get("accessToken");
  if (token === undefined) {
    throw new Error("No access token found");
  }

  const responseStations = await Server.getAllChargingStations(token);
  const responseStationsJSON = await responseStations.json();

  if (!responseStations.ok) {
    throw new Error(responseStationsJSON);
  }

  console.log("Stations: ", responseStationsJSON);

  const responseReservations = await Server.getAllReservations(token);
  const responseReservationsJSON = await responseReservations.json();

  if (!responseReservations.ok) {
    throw new Error(responseReservationsJSON);
  }

  console.log("Reservations: ", responseReservationsJSON);

  responseStationsJSON.forEach((station: any) => {
    station.reservations =
      station.station_id in responseReservationsJSON
        ? responseReservationsJSON[station.station_id]
        : [];
  });

  return responseStationsJSON;
};

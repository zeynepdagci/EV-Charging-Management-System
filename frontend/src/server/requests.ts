const IS_LOCAL = process.env.NEXT_PUBLIC_IS_LOCAL === "true";
const SERVER_IP = IS_LOCAL
  ? process.env.NEXT_PUBLIC_LOCAL_SERVER_IP
  : process.env.NEXT_PUBLIC_DEPLOYED_SERVER_IP;

console.log("SERVER_IP", SERVER_IP);

async function validateToken(token: string) {
  try {
    const response = await fetch(`http://${SERVER_IP}/validate-token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add Bearer token
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Network error:", error);
    return false;
  }
}

async function login({ email, password }: { email: string; password: string }) {
  return fetch(`http://${SERVER_IP}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

async function signup({
  email,
  first_name,
  last_name,
  password,
  role,
}: {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role: string;
}) {
  return fetch(`http://${SERVER_IP}/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      first_name,
      last_name,
      password,
      role,
    }),
  });
}

async function getAllChargingStations(token: string) {
  return fetch(`http://${SERVER_IP}/charging-stations/all/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Add Bearer token
    },
  });
}

async function getChargingStationsForUser(token: string) {
  return fetch(`http://${SERVER_IP}/charging-stations/user/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Add Bearer token
    },
  });
}

async function addChargingStation(token: string, data: any) {
  return fetch(`http://${SERVER_IP}/charging-stations/add/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Add Bearer token
    },
    body: JSON.stringify(data),
  });
}

async function deleteChargingStation(token: string, stationId: number) {
  return fetch(`http://${SERVER_IP}/charging-stations/${stationId}/delete/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

async function createCheckoutSession(
  token: string,
  chargingStationId: number,
  startTime: string,
  endTime: string,
) {
  return fetch(`http://${SERVER_IP}/create-checkout-session/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      charging_station_id: chargingStationId,
      start_time: startTime,
      end_time: endTime,
    }),
  });
}

async function getMostVisitedStation(token: string) {
  return fetch(`http://${SERVER_IP}/reservations/most-visited/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

async function getAllReservations(token: string) {
  return fetch(`http://${SERVER_IP}/get-all-reservations/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

async function updateChargingStation(token: string, stationId: number) {
  return fetch(`http://${SERVER_IP}/charging-stations/${stationId}/update/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

const Server = {
  validateToken,
  login,
  signup,
  getAllChargingStations,
  getChargingStationsForUser,
  addChargingStation,
  deleteChargingStation,
  createCheckoutSession,
  getMostVisitedStation,
  updateChargingStation,
  getAllReservations,
  SERVER_IP,
};

export { Server };

const IS_LOCAL = process.env.NEXT_PUBLIC_IS_LOCAL === "true";
const API_URL = IS_LOCAL
  ? process.env.NEXT_PUBLIC_LOCAL_SERVER_URL
  : process.env.NEXT_PUBLIC_DEPLOYED_SERVER_URL;

console.log("API_URL", API_URL);

async function validateToken(token: string) {
  try {
    const response = await fetch(`${API_URL}/validate-token/`, {
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
  return fetch(`${API_URL}/login/`, {
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
  return fetch(`${API_URL}/signup/`, {
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
  return fetch(`${API_URL}/charging-stations/all/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Add Bearer token
    },
  });
}

async function getChargingStationsForUser(token: string) {
  return fetch(`${API_URL}/charging-stations/user/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Add Bearer token
    },
  });
}

async function addChargingStation(token: string, data: any) {
  return fetch(`${API_URL}/charging-stations/add/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Add Bearer token
    },
    body: JSON.stringify(data),
  });
}

async function deleteChargingStation(token: string, stationId: number) {
  return fetch(`http://127.0.0.1:8000/charging-stations/${stationId}/delete/`, {
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
  return fetch(`${API_URL}/create-checkout-session/`, {
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
  return fetch(`${API_URL}/reservations/most-visited/`, {
    method: "GET",
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
};

export { Server };

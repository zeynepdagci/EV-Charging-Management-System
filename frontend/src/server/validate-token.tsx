export async function validateToken(token: string) {
  try {
    const response = await fetch("http://127.0.0.1:8000/validate-token/", {
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

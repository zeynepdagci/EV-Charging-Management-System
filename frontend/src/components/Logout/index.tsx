"use client";
import Cookies from "js-cookie";

const Logout = () => {
  Cookies.remove("accessToken");
  localStorage.removeItem("role");
  console.log("Logout successful");

  window.location.href = "/auth/signin";

  return null;
};

export default Logout;

"use client";
import { useEffect } from "react";
import Cookies from "js-cookie";

const Logout = () => {
  useEffect(() => {
    // Remove the access token cookie
    Cookies.remove("accessToken");

    // Remove items from localStorage
    localStorage.removeItem("userProfile");
    localStorage.removeItem("role");

    console.log("Logout successful");

    // Redirect to the sign-in page
    window.location.href = "/auth/signin";
  }, []);

  return null;
};

export default Logout;

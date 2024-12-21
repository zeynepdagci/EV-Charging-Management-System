"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Metadata } from "next";
import SignIn from "@/app/auth/signin/page";
import LogOut from "@/app/logout/page";

const Logout = () => {

    const router = useRouter();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    console.log("Logout successful");
    
    // Redirect to sign-in page
    window.location.href = "/auth/signin";

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       // Remove tokens from localStorage
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       console.log("Logout successful");
      
//       // Redirect to sign-in page
//       router.push("/");
//     }
//   }, []);

    return (
        <LogOut />

    );
};

export default Logout;

import { Metadata } from "next";
import React from "react";
import Dashboard from "@/app/dashboard/page";

export const metadata: Metadata = {
  title: "Next.js EV Dashboard Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Home page for NextAdmin Dashboard Kit",
};

const Home = () => {
  return (
    <>
      <Dashboard />
    </>
  );
};

export default Home;

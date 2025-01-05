import { Metadata } from "next";
import React from "react";
import Dashboard from "@/app/dashboard/page";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

const Home = () => {
  return (
    <>
      <Dashboard />
    </>
  );
};

export default Home;

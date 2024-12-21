import OpenChargeMap from "@/components/Dashboard";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
  title:
    "Next.js EV Dashboard Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Home page for NextAdmin Dashboard Kit",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <div className="w-full max-w-[970px]">
          <Breadcrumb pageName="Charging Stations" />

          <OpenChargeMap />
        </div>
      </DefaultLayout>
    </>
  );
}

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Reservations from "@/components/Reservations";

export const metadata: Metadata = {
  title: "Reservations",
  description: "My Reservations",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <div className="w-full max-w-[970px]">
          <Breadcrumb pageName="My Reservations" />

          <Reservations />
        </div>
      </DefaultLayout>
    </>
  );
}

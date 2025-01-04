import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useMemo } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Find Charging Stations",
  description: "Find charging stations",
};

export default function Home() {
  const OpenChargeMap = useMemo(
    () =>
      dynamic(() => import("@/components/Dashboard"), {
        ssr: false,
      }),
    [],
  );
  return (
    <>
      <DefaultLayout>
        <div className="w-full max-w-[970px]">
          <Breadcrumb pageName="" />

          <OpenChargeMap />
        </div>
      </DefaultLayout>
    </>
  );
}

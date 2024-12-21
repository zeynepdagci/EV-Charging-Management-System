
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import ManageStations from "@/components/ManageChargingStations";

export const metadata: Metadata = {
  title: "Next.js Profile Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Profile page for NextAdmin Dashboard Kit",
};

const ManageChargingStations = () => {
  return (
    <DefaultLayout>
    <div className="w-full max-w-[970px]">
      <Breadcrumb pageName="Manage Charging Stations" />

      <ManageStations />
    </div>
    </DefaultLayout>
  );
};

export default ManageChargingStations;


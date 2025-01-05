import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ManageStations from "@/components/ManageChargingStations";

export const metadata: Metadata = {
  title: "Manage Charging Stations",
  description: "Manage Charging Stations",
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

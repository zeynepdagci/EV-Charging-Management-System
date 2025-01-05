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
      <Breadcrumb pageName="Manage Charging Stations" />
      <div className="flex flex-col gap-10">
        <ManageStations />
      </div>
    </DefaultLayout>
  );
};

export default ManageChargingStations;

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Signup from "@/components/Auth/Signup";

export const metadata: Metadata = {
  title: "EV Charging | Sign Up",
  description: "Sign up for a new account",
};

const SignUp: React.FC = () => {
  return (
    <DefaultLayout showUserSpecificContent={false}>
      <Breadcrumb pageName="Sign Up" />

      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="flex flex-wrap items-stretch">
          <div className="flex w-full flex-col xl:w-1/2">
            <div className="w-full flex-grow p-4 sm:p-12.5 xl:p-15">
              <Signup />
            </div>
          </div>

          <div className="hidden w-full p-7.5 xl:flex xl:w-1/2 xl:flex-col xl:items-center xl:justify-center">
            <div className="flex w-full flex-grow flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-blue-300 to-purple-300 px-12.5 pt-2.5 dark:from-blue-400 dark:to-purple-400">
              <Link className="mb-2.5 inline-block" href="/">
                <Image
                  src={"/images/logo/logo-dark.svg"}
                  alt="Logo"
                  width={176}
                  height={32}
                  className="dark:invert"
                />
              </Link>
              <h1 className="mb-5 text-center text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
                Welcome!
              </h1>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SignUp;

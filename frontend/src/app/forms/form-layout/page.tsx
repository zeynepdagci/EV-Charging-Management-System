import React from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Signin from "@/components/Auth/Signin";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Next.js Login Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Login Page NextAdmin Dashboard Kit",
};

const Form: React.FC = () => {
  return (
    <DefaultLayout>

      <div className="w-full">
        <ContactForm />
      </div>

    </DefaultLayout>
  );
};

export default Form;

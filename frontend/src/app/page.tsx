import { Metadata } from "next";
import React from "react";
import SignIn from "@/app/auth/signin/page";

export const metadata: Metadata = {
  title:
    "Next.js EV Dashboard Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Home page for NextAdmin Dashboard Kit",
};

export default function Home() {
  return (
    <>
      <SignIn />
    </>
  );
}

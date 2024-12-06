"use client";
import Link from "next/link";
import React from "react";
import SignupWithPassword from "../SignupWithPassword";

export default function Signup() {
  return (
    <>
      {/* <GoogleSigninButton text="Sign up" /> Updated button text */}

      {/* <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Or sign up with email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div> */}

      {/* <div>
        <SigninWithPassword isSignup={true} />  */}
        {/* Adjust logic for signup */}
      {/* </div> */}

      <div>
        <SignupWithPassword />
      </div>
    </>
  );
}

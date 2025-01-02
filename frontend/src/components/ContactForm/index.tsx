"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout"; // Fixed typo DefaultLaout -> DefaultLayout
import SelectGroupOne from "@/components/FormElements/SelectGroup/SelectGroupOne";
import InputGroup from "@/components/FormElements/InputGroup";
import { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        alert("Failed to send the message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4">
      {/* Centered Contact Form */}
      <div className="w-full max-w-4xl rounded-lg border-4 border-white bg-white shadow-lg dark:border-dark-3 dark:bg-gray-dark">
        <div className="border-b-4 border-white px-8 py-6 dark:border-dark-3">
          <h3 className="text-xl font-semibold text-dark dark:text-white">
            Contact Form
          </h3>
        </div>

        {/* Wrap the form content inside the form tag */}
        <form onSubmit={handleSubmit}>
          <div className="p-8 sm:p-10 md:p-12">
            {" "}
            {/* Adjusted padding for responsiveness */}
            <div className="mb-6 flex flex-col gap-6 xl:flex-row">
              <InputGroup
                label="First name"
                type="text"
                placeholder="Enter your first name"
                customClasses="w-full xl:w-1/2"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />

              <InputGroup
                label="Last name"
                type="text"
                placeholder="Enter your last name"
                customClasses="w-full xl:w-1/2"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <InputGroup
              label="Email"
              type="email"
              placeholder="Enter your email address"
              customClasses="mb-6"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <InputGroup
              label="Subject"
              type="text"
              placeholder="Enter your subject"
              customClasses="mb-6"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            />
            <SelectGroupOne />
            <div className="mb-6">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                Message
              </label>
              <textarea
                rows={6}
                placeholder="Type your message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-lg border-4 border-white bg-transparent px-5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </div>
            <button className="flex w-full justify-center rounded-lg bg-primary p-4 font-medium text-white hover:bg-opacity-90">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;

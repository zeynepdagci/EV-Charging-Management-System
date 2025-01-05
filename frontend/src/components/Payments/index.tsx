"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Server } from "@/server/requests";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const token = Cookies.get("accessToken") ?? "";
      try {
        const response = await Server.getUserPayments(token);
        const data = await response.json();
        console.log("Payments", data);
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  const generateInvoice = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Payment Invoice", 14, 20);

    // Table data
    const tableColumn = [
      "Payment Id",
      "Amount",
      "Date",
      "Location",
      "Start Time",
      "End Time",
    ];
    const tableRows = payments.map((payment) => [
      payment.id,
      `£${payment.amount}`,
      new Date(payment.payment_date).toLocaleString(),
      payment.location,
      new Date(payment.start_time).toLocaleString(),
      new Date(payment.end_time).toLocaleString(),
    ]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    // Save PDF
    doc.save("invoice.pdf");
  };

  return (
    <div className="w-full p-6">
      <h2 className="mb-6 text-center text-xl font-bold">Payment History</h2>

      {/* Generate Invoice Button */}
      <div className="mb-6 text-right">
        <button
          onClick={generateInvoice}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Generate Invoice
        </button>
      </div>

      {/* Table */}
      <div className="mx-auto w-full max-w-7xl overflow-x-auto bg-white shadow-md dark:bg-dark-2">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b dark:border-dark-3">
              <th className="px-6 py-4">Payment Id</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Start Time</th>
              <th className="px-6 py-4">End Time</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment, idx) => (
                <tr
                  key={idx}
                  className="border-t hover:bg-gray-50 dark:border-dark-3 dark:hover:bg-dark-2"
                >
                  <td className="px-6 py-4">{payment.id}</td>
                  <td className="px-6 py-4">£{payment.amount}</td>
                  <td className="px-6 py-4">
                    {new Date(payment.payment_date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{payment.location}</td>
                  <td className="px-6 py-4">
                    {new Date(payment.start_time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(payment.end_time).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;

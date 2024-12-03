"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Invoice({ params }) {
    const [parcel, setParcel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchParcel();
    }, []);

    const fetchParcel = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("/api/parcel-tracking-number", {
                params: { trackingNumber: params.trackingNumber },
            });
            setParcel(response.data);
        } catch (error) {
            console.error("Error fetching parcel:", error);
            setError("Failed to fetch parcel. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([document.getElementById("invoice").outerHTML], {
            type: "text/html",
        });
        element.href = URL.createObjectURL(file);
        element.download = `Invoice_${parcel?.invoiceNumber || "Unknown"}.html`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">{error}</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-5">
            <div
                id="invoice"
                className="bg-white mx-auto p-8 rounded-lg shadow-md"
                style={{ maxWidth: "900px" }}
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-primary">
                        Sun Express Services
                    </h2>
                    <p className="text-sm">901, 9th Floor, Emerald 2 CHS LTD, Royal Palms, Aarey Milk Colony, Goregaon East, Mumbai 400 065</p>
                    <hr />
                    <h3 className="mt-4 text-xl font-semibold text-gray-700">
                        TAX INVOICE
                    </h3>
                </div>

                {/* Invoice Details */}
                <div className="flex justify-between mb-6 gap-4">
                    <div className="w-1/2">
                        <p>
                            <strong>Invoice Number:</strong> {parcel.invoiceNumber}
                        </p>
                        <p>
                            <strong>Bill To: <span className="text-primary">{parcel?.billTo?.name}</span></strong>
                        </p>
                        <p>{parcel?.billTo?.address}</p>
                        <p>
                            <strong>Client GST:</strong> {parcel.gst}
                        </p>
                    </div>
                    <div className="w-1/2">
                        <p>
                            <strong>Date:</strong> {parcel.date?.date} {parcel.date?.time}
                        </p>
                        <p>
                            <strong>Shipment To: <span className="text-primary">{parcel?.receiver?.name}</span></strong>
                        </p>
                        <p>{parcel?.receiver?.address}</p>
                    </div>
                </div>

                {/* Table */}
                <table className="w-full mb-6">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border-y border-gray-300 px-4 py-2 text-left">
                                Description
                            </th>
                            <th className="border-y border-gray-300 px-4 py-2 text-center">
                                Weight
                            </th>
                            <th className="border-y border-gray-300 px-4 py-2 text-right">
                                Price
                            </th>
                            <th className="border-y border-gray-300 px-4 py-2 text-right">
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcel?.boxes?.map((box, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border-y border-gray-300 px-4 py-2">
                                    Box {box?.boxNumber}
                                </td>
                                <td className="border-y border-gray-300 px-4 py-2 text-center">
                                    {box.chargeableWeight}
                                </td>
                                <td className="border-y border-gray-300 px-4 py-2 text-right">
                                    ₹{box.price}
                                </td>
                                <td className="border-y border-gray-300 px-4 py-2 text-right">
                                    ₹{box.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p>
                            <strong>GST Number:</strong> {parcel.gst}
                        </p>
                        <p>
                            <strong>PAN Number:</strong> {parcel.panNumber || "PAN"}
                        </p>
                    </div>
                    <div className="text-right">
                        <p>
                            <strong>Subtotal:</strong> ₹{parcel.subtotal || "0.00"}
                        </p>
                        <p>
                            <strong>CGST (9%):</strong> ₹
                            {parcel.taxes?.cgst?.amount || "0.00"}
                        </p>
                        <p>
                            <strong>SGST (9%):</strong> ₹
                            {parcel.taxes?.sgst?.amount || "0.00"}
                        </p>
                        <p>
                            <strong>Total:</strong>{" "}
                            <span className="text-lg font-bold">
                                ₹{parcel.total || "0.00"}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Signature */}
                <div className="text-right mt-16">
                    <img
                        src={parcel.signature || "/placeholder-signature.png"}
                        alt="Signature"
                        className="w-32"
                    />
                    <p className="mt-2">Authorized Signatory</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-6 space-x-4">
                <button
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                    onClick={handlePrint}
                >
                    Print Invoice
                </button>
                <button
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                    onClick={handleDownload}
                >
                    Download Invoice
                </button>
            </div>
        </div>
    );
}

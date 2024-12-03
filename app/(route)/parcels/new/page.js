"use client";

import { useState } from "react";

export default function CreateParcelForm() {
    const [formData, setFormData] = useState({
        parcelType: "",
        staffId: "",
        invoiceNumber: "",
        date: {
            date: "",
            time: "",
        },
        time: "",
        fromCountry: "",
        toCountry: "",
        vesselFlight: "",
        portDischarge: "",
        originCountry: "",
        expRef: "",
        preCarriage: "",
        placeReceipt: "",
        portLoading: "",
        finalDestination: "",
        countryFinalDestination: "",
        trackingNumber: "",
        zone: "",
        gst: "",
        subtotal: 0,
        total: 0,
        taxes: {
            cgst: { percent: 0, amount: 0 },
            sgst: { percent: 0, amount: 0 },
            igst: { percent: 0, amount: 0 },
        },
        sender: { name: "", address: "", country: "", zip: "", contact: "" },
        receiver: { name: "", address: "", country: "", zip: "", contact: "" },
        billTo: { name: "", address: "", contact: "" },
        boxes: [],
    });

    const [boxes, setBoxes] = useState([]);

    const addBox = () => {
        setBoxes([
            ...boxes,
            { length: "", breadth: "", height: "", actualWeight: "", price: "" },
        ]);
    };

    const handleBoxChange = (index, field, value) => {
        const updatedBoxes = [...boxes];
        updatedBoxes[index][field] = value;

        if (field === "length" || field === "breadth" || field === "height" || field === "actualWeight") {
            const box = updatedBoxes[index];
            const dimensionalWeight = Math.round(
                (box.length * box.breadth * box.height) / 5000
            );
            const chargeableWeight = Math.max(box.actualWeight, dimensionalWeight);
            updatedBoxes[index].dimensionalWeight = dimensionalWeight;
            updatedBoxes[index].chargeableWeight = chargeableWeight;
            updatedBoxes[index].amount = Math.round(chargeableWeight * box.price);
        }

        setBoxes(updatedBoxes);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedFormData = { ...formData, boxes };
        console.log(updatedFormData);

        const response = await fetch("/api/gst-parcel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedFormData),
        });

        if (response.ok) {
            alert("Parcel created successfully!");
            setFormData({
                ...formData,
                sender: { name: "", address: "", country: "", zip: "", contact: "" },
                receiver: { name: "", address: "", country: "", zip: "", contact: "" },
                billTo: { name: "", address: "", contact: "" },
                boxes: [],
            });
            setBoxes([]);
        } else {
            alert("Error creating parcel.");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Create GST Parcel</h1>
            <form onSubmit={handleSubmit}>
                {/* General Parcel Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                    <input
                        type="date"
                        placeholder="Date"
                        value={formData.date.date}
                        onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                        }
                        required
                        className="border px-3 py-2 rounded w-full"
                    />
                    <input
                        type="time"
                        placeholder="Time"
                        value={formData.date.time}
                        onChange={(e) =>
                            setFormData({ ...formData, time: e.target.value })
                        }
                        required
                        className="border px-3 py-2 rounded w-full"
                    />
                </div>

                {/* Boxes */}
                <div className="mb-4">
                    <h2 className="text-lg font-bold mb-2">Boxes</h2>
                    {boxes.map((box, index) => (
                        <div key={index} className="border p-4 mb-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <input
                                    type="number"
                                    placeholder="Length (cm)"
                                    value={box.length || ""}
                                    onChange={(e) =>
                                        handleBoxChange(index, "length", e.target.value)
                                    }
                                    required
                                    className="border px-3 py-2 rounded w-full"
                                />
                                <input
                                    type="number"
                                    placeholder="Breadth (cm)"
                                    value={box.breadth || ""}
                                    onChange={(e) =>
                                        handleBoxChange(index, "breadth", e.target.value)
                                    }
                                    required
                                    className="border px-3 py-2 rounded w-full"
                                />
                                <input
                                    type="number"
                                    placeholder="Height (cm)"
                                    value={box.height || ""}
                                    onChange={(e) =>
                                        handleBoxChange(index, "height", e.target.value)
                                    }
                                    required
                                    className="border px-3 py-2 rounded w-full"
                                />
                                <input
                                    type="number"
                                    placeholder="Actual Weight (kg)"
                                    value={box.actualWeight || ""}
                                    onChange={(e) =>
                                        handleBoxChange(index, "actualWeight", e.target.value)
                                    }
                                    required
                                    className="border px-3 py-2 rounded w-full"
                                />
                                <input
                                    type="number"
                                    placeholder="Price (₹)"
                                    value={box.price || ""}
                                    onChange={(e) =>
                                        handleBoxChange(index, "price", e.target.value)
                                    }
                                    required
                                    className="border px-3 py-2 rounded w-full"
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addBox}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Add Box
                    </button>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

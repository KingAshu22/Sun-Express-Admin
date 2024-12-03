"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { HashLoader } from "react-spinners";

export default function Page() {
    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchParcels();
    }, []);

    const fetchParcels = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("/api/gst-parcels");
            console.log(response.data);
            setParcels(response.data);
        } catch (error) {
            console.error("Error fetching parcels:", error);
            setError("Failed to fetch parcels. Please try again later.");
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex justify-center items-center p-10">
                    <HashLoader color="#dc2626" size={80} />
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="container mx-auto py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container w-full">
            <DataTable columns={columns} data={parcels} />
        </div>
    );
}

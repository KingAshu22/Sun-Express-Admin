import { connectToDB } from "@/app/_utils/mongodb";
import GstParcel from "@/models/GstParcel";
import { NextResponse } from "next/server";

function generateTrackingNumber() {
    return Math.floor(1000000000 + Math.random() * 9000000000); // Generate a random 10-digit number
}

async function getUniqueTrackingNumber() {
    let isUnique = false;
    let trackingNumber;

    while (!isUnique) {
        trackingNumber = generateTrackingNumber();
        const existingParcel = await GstParcel.findOne({ trackingNumber }).select("_id");

        if (!existingParcel) {
            isUnique = true; // If no document with this tracking number exists, mark it as unique
        }
    }

    return trackingNumber;
}

export async function GET() {
    await connectToDB();

    try {
        // Fetch the last document for the invoice number
        const lastGstParcel = await GstParcel.findOne({}).sort({ _id: -1 }).select("invoiceNumber");

        if (!lastGstParcel) {
            return NextResponse.json(
                { message: "No documents found" },
                { status: 404 }
            );
        }

        // Generate a unique tracking number
        const uniqueTrackingNumber = await getUniqueTrackingNumber();

        return NextResponse.json({
            invoiceNumber: lastGstParcel.invoiceNumber,
            trackingNumber: uniqueTrackingNumber,
        });
    } catch (error) {
        console.error("Error fetching gstParcel:", error.message);
        return NextResponse.json(
            { error: "Failed to fetch gstParcel" },
            { status: 500 }
        );
    }
}

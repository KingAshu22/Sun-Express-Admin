import { connectToDB } from "@/app/_utils/mongodb";
import GstParcel from "@/models/GstParcel";
import { NextResponse } from "next/server";

export async function GET() {
    await connectToDB();
    try {
        const gstParcels = await GstParcel.find({}).sort({ _id: -1 });
        return NextResponse.json(gstParcels);
    } catch (error) {
        console.error("Error fetching gstParcel:", error.message);
        return NextResponse.json(
            { error: "Failed to fetch gstParcel" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await connectToDB();
        const data = await req.json(); // Parse JSON body from the request

        console.log(data);

        const gstParcel = new GstParcel(data);
        await gstParcel.save();

        return NextResponse.json(
            { message: "Parcel added successfully!", gstParcel },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error in POST /api/gst-parcels:", error.message);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

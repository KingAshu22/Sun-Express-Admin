import { connectToDB } from "@/app/_utils/mongodb";
import GstParcel from "@/models/GstParcel";
import { NextResponse } from "next/server";

export async function GET() {
    await connectToDB()
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

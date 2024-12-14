import mongoose, { Schema, model, models } from "mongoose";
import { UserSchema } from "./User";

const GstParcelSchema = new Schema({
    parcelType: String,
    staffId: String,
    invoiceNumber: String,
    date: Date,
    fromCountry: String,
    toCountry: String,
    vesselFlight: String,
    portDischarge: String,
    originCountry: String,
    expRef: String,
    preCarriage: String,
    placeReceipt: String,
    portLoading: String,
    finalDestination: String,
    countryFinalDestination: String,
    trackingNumber: { type: Number, required: true },
    sender: UserSchema,
    receiver: UserSchema,
    billTo: UserSchema,
    zone: String,
    gst: String,
    boxes: Array,
    parcelStatus: Array,
    subtotal: Number,
    service: String,
    taxes: {
        cgst: {
            percent: Number,
            amount: Number,
        },
        sgst: {
            percent: Number,
            amount: Number,
        },
        igst: {
            percent: Number,
            amount: Number,
        },
    },
    total: Number,
    parcelValue: Number,
});

const GstParcel = models.GstParcel || model("GstParcel", GstParcelSchema);

export default GstParcel;

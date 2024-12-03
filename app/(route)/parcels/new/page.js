"use client";

import { useState } from "react";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SingleSearch from "@/app/_components/SingleSearch";
import { Countries } from "@/app/constants/country";

export default function CreateParcelForm() {
    const [date, setDate] = useState();
    const [parcelType, setParcelType] = useState("International");
    const [staffId, setStaffId] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [fromCountry, setFromCountry] = useState("India");
    const [toCountry, setToCountry] = useState("");
    const [vesselFlight, setVesselFlight] = useState("");
    const [portDischarge, setPortDischarge] = useState("");
    const [originCountry, setOriginCountry] = useState("India");
    const [expRef, setExpRef] = useState("");
    const [preCarriage, setPreCarriage] = useState("");
    const [placeReceipt, setPlaceReceipt] = useState("");
    const [portLoading, setPortLoading] = useState("");
    const [finalDestination, setFinalDestination] = useState("");
    const [countryFinalDestination, setCountryFinalDestination] = useState("");
    const [trackingNumber, setTrackingNumber] = useState("");
    const [zone, setZone] = useState("");
    const [gst, setGst] = useState("");
    const [boxes, setBoxes] = useState([]);
    const [parcelStatus, setParcelStatus] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Create GST Parcel</h1>
            <form>
                {/* General Parcel Information */}
                <h1 className="text-xl mb-4">Basic Details for Shipping</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-center justify-center items-start content-center gap-4 mb-4">
                    <div className="grid w-full min-w-sm gap-1.5 mt-4">
                        <Label htmlFor="email">Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[280px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Select Parcel Date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <SingleSearch
                        type="Select Parcel Type"
                        topList={["International", "Domestic"]}
                        selectedItem={parcelType}
                        setSelectedItem={setParcelType}
                        showSearch={false}
                    />
                    <SingleSearch
                        type="From Country"
                        list={Countries}
                        selectedItem={fromCountry}
                        setSelectedItem={setFromCountry}
                        showSearch={true}
                    />
                    <SingleSearch
                        type="To Country"
                        list={Countries}
                        topList={["United States Of America", "Canada", "Australia", "United Arab Emirates"]}
                        selectedItem={toCountry}
                        setSelectedItem={setToCountry}
                        showSearch={true}
                    />
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="vesselFlight">Vessel/Flight No:</Label>
                        <Input type="text" placeholder="Vessel/Flight No" value={vesselFlight} onChange={(e) => setVesselFlight(e.target.value)} />
                    </div>
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="portDischarge">Port of Discharge:</Label>
                        <Input type="text" placeholder="Port of Discharge" value={portDischarge} onChange={(e) => setPortDischarge(e.target.value)} />
                    </div>
                    <div className="-mt-10">
                        <SingleSearch
                            type="Origin Country"
                            list={Countries}
                            selectedItem={originCountry}
                            setSelectedItem={setOriginCountry}
                            showSearch={true}
                        />
                    </div>
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="expRef">Exp Ref:</Label>
                        <Input type="text" placeholder="Exp Ref" value={expRef} onChange={(e) => setExpRef(e.target.value)} />
                    </div>
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="preCarriage">Pre Carriage By:</Label>
                        <Input type="text" placeholder="Pre Carriage By" value={preCarriage} onChange={(e) => setPreCarriage(e.target.value)} />
                    </div>
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="placeReceipt">Place of Receipt:</Label>
                        <Input
                            type="text"
                            placeholder="Place of Receipt"
                            value={placeReceipt}
                            onChange={(e) => setPlaceReceipt(e.target.value)}
                        />
                    </div>

                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="portLoading">Port of Loading:</Label>
                        <Input
                            type="text"
                            placeholder="Port of Loading"
                            value={portLoading}
                            onChange={(e) => setPortLoading(e.target.value)}
                        />
                    </div>

                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="finalDestination">Final Destination:</Label>
                        <Input
                            type="text"
                            placeholder="Final Destination"
                            value={finalDestination}
                            onChange={(e) => setFinalDestination(e.target.value)}
                        />
                    </div>
                    <div className="lg:-ml-28">
                        <SingleSearch
                            type="Country of Final Destination"
                            list={Countries}
                            selectedItem={countryFinalDestination}
                            setSelectedItem={setCountryFinalDestination}
                            showSearch={true}
                        />
                    </div>
                </div>
                <hr />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-center justify-center items-start content-center gap-4 mb-4">

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

"use client";

import { useEffect, useState } from "react";
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
import axios from "axios";

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
    const [senderName, setSenderName] = useState("");
    const [senderAddress, setSenderAddress] = useState("");
    const [senderCountry, setSenderCountry] = useState("India");
    const [senderZipCode, setSenderZipCode] = useState("");
    const [senderContact, setSenderContact] = useState("+91");
    const [kycType, setKycType] = useState("Aadhaar No -");
    const [kyc, setKyc] = useState("");
    const [gst, setGst] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [receiverAddress, setReceiverAddress] = useState("");
    const [receiverCountry, setReceiverCountry] = useState("");
    const [receiverZipCode, setReceiverZipCode] = useState("");
    const [receiverContact, setReceiverContact] = useState("");
    const [zone, setZone] = useState("");
    const [billToSelector, setBillToSelector] = useState("Sender");
    const [billToName, setBillToName] = useState("");
    const [billToAddress, setBillToAddress] = useState("");
    const [billToContact, setBillToContact] = useState("");
    const [trackingNumber, setTrackingNumber] = useState("");
    const [boxes, setBoxes] = useState([{
        length: "",
        breadth: "",
        height: "",
        actualWeight: "",
        dimensionalWeight: "",
        chargeableWeight: "",
        items: [{
            name: "",
            quantity: "",
            price: "",
        }]
    }]);
    const [totalChargeableWeight, setTotalChargeableWeight] = useState("")
    const [service, setService] = useState("");
    const [baseRate, setBaseRate] = useState(0);
    const [profitRate, setProfitRate] = useState(0);
    const [discountedProfitRate, setDiscountedProfitRate] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [cgstPercent, setCgstPercent] = useState(0);
    const [sgstPercent, setSgstPercent] = useState(0);
    const [igstPercent, setIgstPercent] = useState(0);
    const [cgst, setCgst] = useState(0);
    const [sgst, setSgst] = useState(0);
    const [igst, setIgst] = useState(0);
    let discount = 0;

    const rate = Math.ceil(subtotal / totalChargeableWeight);
    if (discountedProfitRate > 0) {
        discount = Math.ceil((profitRate - discountedProfitRate) * totalChargeableWeight)
    }
    const taxableAmount = Math.ceil(subtotal - discount)
    const total = Math.ceil(taxableAmount + cgst + sgst + igst);

    const [senderNameOptions, setSenderNameOptions] = useState([]);
    const [receiverNameOptions, setReceiverNameOptions] = useState([]);

    useEffect(() => {
        getInvoiceNumber();
    }, []);

    useEffect(() => {
        // Calculate the total chargeable weight
        const totalWeight = boxes.reduce((acc, box) => {
            const chargeableWeight = parseFloat(box.chargeableWeight) || 0; // Parse as a number and default to 0 if invalid
            return acc + chargeableWeight;
        }, 0); // Initial accumulator value is 0

        // Update the totalChargeableWeight state
        setTotalChargeableWeight(Math.round(totalWeight));
    }, [boxes]);

    useEffect(() => {
        CheckBillToSelector()
    }, [billToSelector]);

    // Fetch rate when service or dependent variables change
    useEffect(() => {
        if (totalChargeableWeight && receiverCountry && service) {
            getRate(service.toLowerCase());
        }
    }, [service, totalChargeableWeight, receiverCountry]);

    // Update subtotal when baseRate or profitRate changes
    useEffect(() => {
        setSubtotal((baseRate * totalChargeableWeight) + (profitRate * totalChargeableWeight));
    }, [baseRate, profitRate, totalChargeableWeight]);

    // Update tax calculations when relevant percentages or subtotal changes
    useEffect(() => {
        setCgst((cgstPercent * taxableAmount) / 100);
        setSgst((sgstPercent * taxableAmount) / 100);
        setIgst((igstPercent * taxableAmount) / 100);
    }, [cgstPercent, sgstPercent, igstPercent, subtotal, taxableAmount]);

    const getRate = async (type) => {
        try {
            const response = await axios.get("/api/rate", {
                params: {
                    type,
                    weight: totalChargeableWeight,
                    country: receiverCountry,
                    profitPercent: 50,
                },
            });

            if (response.data) {
                const data = response.data;

                setBaseRate(Math.ceil(data.baseCharges / totalChargeableWeight));
                setProfitRate(Math.ceil(data.profitCharges / totalChargeableWeight));

                // Update tax percentages based on GST
                if (gst.length === 0) {
                    setCgstPercent(9);
                    setSgstPercent(9);
                    setIgstPercent(0);
                }
                else if (!gst.startsWith("27")) {
                    setIgstPercent(18);
                    setCgstPercent(0);
                    setSgstPercent(0);
                } else {
                    setCgstPercent(9);
                    setSgstPercent(9);
                    setIgstPercent(0);
                }
            }
        } catch (error) {
            console.error("Error fetching rate:", error.response?.data || error.message);
        }
    };

    const CheckBillToSelector = (name, address, contact) => {
        if (billToSelector === "Sender") {
            setBillToName(name);
            setBillToAddress(address);
            setBillToContact(contact);
        } else if (billToSelector === "Receiver") {
            setBillToName(name);
            setBillToAddress(address);
            setBillToContact(contact);
        } else {
            setBillToName("");
            setBillToAddress("");
            setBillToContact("");
        }
    };

    useEffect(() => {
        if (billToSelector === "Sender") {
            CheckBillToSelector(senderName, senderAddress, senderContact);
        } else if (billToSelector === "Receiver") {
            CheckBillToSelector(receiverName, receiverAddress, receiverContact);
        }
    }, [billToSelector, senderName, senderAddress, senderContact, receiverName, receiverAddress, receiverContact]);


    const getInvoiceNumber = async () => {
        try {
            const response = await axios.get("/api/get-last-invoice");
            const lastInvoiceNumber = response.data.invoiceNumber;

            // Extract the last number part from the invoice number
            const parts = lastInvoiceNumber.split("/");
            let lastNumber = parseInt(parts[1], 10); // Extract the numeric part and parse it

            // Increment the number and ensure it is at least 3 digits
            const incrementedNumber = (lastNumber + 1).toString().padStart(3, "0");

            // Construct the new invoice number
            const newInvoiceNumber = `${parts[0]}/${incrementedNumber}`;

            // Set the new invoice number
            setInvoiceNumber(newInvoiceNumber);
            setTrackingNumber(response.data.trackingNumber);
        } catch (error) {
            console.error("Error fetching parcel:", error);
            setError("Failed to fetch parcel. Please try again later.");
        }
    };

    const fetchCustomerNames = async (query, type) => {
        console.log("Query", query);

        if (!query) {
            setSenderNameOptions([]);
            return;
        }
        try {
            const response = await axios.get(`/api/customer?query=${query}`);
            type === "sender" ?
                setSenderNameOptions(response.data.map((customer) => customer.name))
                : setReceiverNameOptions(response.data.map((customer) => customer.name));
        } catch (error) {
            console.error("Error fetching customer names:", error);
        }
    };

    // Function to fetch details of the selected sender
    const fetchCustomerDetails = async (name, type) => {
        try {
            const response = await axios.get(`/api/customer?query=${name}`);
            const customer = response.data[0]; // Assuming the first match is the desired one
            if (customer) {
                if (type === "sender") {
                    const senderName = name;
                    const senderAddress = customer.address;
                    const senderContact = customer.contact;
                    const senderCountry = customer.country;
                    const senderZipCode = customer.zip;
                    const senderKycType = customer?.kyc?.type;
                    const senderKyc = customer?.kyc?.kyc;
                    const senderGst = customer?.gst;

                    setSenderAddress(senderAddress);
                    setSenderContact(senderContact);
                    setSenderCountry(senderCountry);
                    setSenderZipCode(senderZipCode);
                    setKycType(senderKycType);
                    setKyc(senderKyc);
                    setGst(senderGst);
                    // Automatically set the BillTo details for the sender
                    setSenderName(senderName);
                    setBillToName(senderName);
                    setBillToAddress(senderAddress);
                    setBillToContact(senderContact);
                } else {
                    const receiverName = name;
                    const receiverAddress = customer.address;
                    const receiverContact = customer.contact;
                    const receiverCountry = customer.country;
                    const receiverZipCode = customer.zip

                    setReceiverAddress(receiverAddress);
                    setReceiverContact(receiverContact);
                    setReceiverCountry(receiverCountry);
                    setReceiverZipCode(receiverZipCode);
                    // Automatically set the BillTo details for the receiver
                    setReceiverName(receiverName);
                    setBillToName(receiverName);
                    setBillToAddress(receiverAddress);
                    setBillToContact(receiverContact);
                }
            }
        } catch (error) {
            console.error("Error fetching customer details:", error);
        }
    };

    const addBox = () => {
        setBoxes([
            ...boxes,
            {
                length: "",
                breadth: "",
                height: "",
                actualWeight: "",
                dimensionalWeight: "",
                chargeableWeight: "",
                items: [{ name: "", quantity: "", price: "" }],
            },
        ]);
    };

    const handleBoxChange = (index, field, value) => {
        const updatedBoxes = [...boxes];
        updatedBoxes[index][field] = value;

        if (["length", "breadth", "height", "actualWeight"].includes(field)) {
            const box = updatedBoxes[index];
            const dimensionalWeight = Math.round(
                (box.length * box.breadth * box.height) / 5000
            );
            const chargeableWeight = Math.max(box.actualWeight, dimensionalWeight);
            updatedBoxes[index].dimensionalWeight = dimensionalWeight;
            updatedBoxes[index].chargeableWeight = chargeableWeight;
        }

        setBoxes(updatedBoxes);
    };

    const handleItemChange = (boxIndex, itemIndex, field, value) => {
        const updatedBoxes = [...boxes];
        updatedBoxes[boxIndex].items[itemIndex][field] = value;
        setBoxes(updatedBoxes);
    };

    const addItem = (boxIndex) => {
        const updatedBoxes = [...boxes];
        updatedBoxes[boxIndex].items.push({ name: "", quantity: "", price: "" });
        setBoxes(updatedBoxes);
    };

    const removeItem = (boxIndex, itemIndex) => {
        const updatedBoxes = [...boxes];
        updatedBoxes[boxIndex].items.splice(itemIndex, 1);
        setBoxes(updatedBoxes);
    };

    const removeBox = (boxIndex) => {
        const updatedBoxes = [...boxes];
        updatedBoxes.splice(boxIndex, 1);
        setBoxes(updatedBoxes);
    };

    const saveParcel = async () => {
        try {
            console.log("Inside Save Parcel Function");
            const parcelData = {
                parcelType,
                staffId,
                invoiceNumber,
                date,
                fromCountry,
                toCountry,
                vesselFlight,
                portDischarge,
                originCountry,
                expRef,
                preCarriage,
                placeReceipt,
                portLoading,
                finalDestination,
                countryFinalDestination,
                trackingNumber,
                sender: {
                    name: senderName,
                    address: senderAddress,
                    country: senderCountry,
                    zipCode: senderZipCode,
                    contact: senderContact,
                    kyc: {
                        type: kycType,
                        kyc,
                    },
                },
                receiver: {
                    name: receiverName,
                    address: receiverAddress,
                    country: receiverCountry,
                    zipCode: receiverZipCode,
                    contact: receiverContact,
                },
                billTo: {
                    name: billToName,
                    address: billToAddress,
                    contact: billToContact,
                },
                gst,
                boxes,
                baseRate,
                profitRate,
                rate,
                subtotal,
                service,
                taxes: {
                    cgst: {
                        percent: cgstPercent,
                        amount: cgst,
                    },
                    sgst: {
                        percent: sgstPercent,
                        amount: sgst,
                    },
                    igst: {
                        percent: igstPercent,
                        amount: igst,
                    },
                },
                total,
            };

            const response = await axios.post("/api/gst-parcels", parcelData);

            if (response.status === 200) {
                console.log("Parcel saved successfully:", response.data);
                alert("Parcel saved successfully!");
            } else {
                console.error("Failed to save parcel:", response.data);
                alert("Failed to save the parcel. Please try again.");
            }
        } catch (error) {
            console.error("Error saving parcel:", error.response?.data || error.message);
            alert("An error occurred while saving the parcel.");
        }
    };

    return (
        <div className="container mx-auto px-2">
            <h1 className="text-2xl font-bold mb-4">Create GST Parcel</h1>
            <form onSubmit={saveParcel}>
                {/* General Parcel Information */}
                <h1 className="text-xl mb-4">Basic Details for Shipping</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 justify-items-center justify-center items-start content-center gap-4 mb-4">
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="invoiceNumber">Invoice No:</Label>
                        <Input type="text" placeholder="Invoice No." value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                    </div>
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="trackingNumber">Tracking No:</Label>
                        <Input type="number" placeholder="Tracking No." value={trackingNumber} readOnly />
                    </div>
                    <div className="grid w-full min-w-sm gap-1.5 mt-4">
                        <Label htmlFor="date" className="lg:-mt-6">Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "lg:-mt-2 w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Select Parcel Date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="lg:-mt-2">
                        <SingleSearch
                            type="Select Parcel Type"
                            topList={["International", "Domestic"]}
                            selectedItem={parcelType}
                            setSelectedItem={setParcelType}
                            showSearch={false}
                        />
                    </div>
                    <div className="lg:-mt-10">
                        <SingleSearch
                            type="From Country"
                            list={Countries}
                            selectedItem={fromCountry}
                            setSelectedItem={setFromCountry}
                            showSearch={true}
                        />
                    </div>
                    <SingleSearch
                        type="To Country"
                        list={Countries}
                        selectedItem={toCountry}
                        setSelectedItem={setToCountry}
                        showSearch={true}
                    />
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="vesselFlight">Vessel/Flight No:</Label>
                        <Input type="text" placeholder="Vessel/Flight No" value={vesselFlight} onChange={(e) => setVesselFlight(e.target.value)} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 justify-items-center justify-center items-start content-center gap-4 mb-4">
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="portDischarge">Port of Discharge:</Label>
                        <Input type="text" placeholder="Port of Discharge" value={portDischarge} onChange={(e) => setPortDischarge(e.target.value)} />
                    </div>
                    <div className="lg:-mt-8">
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
                    <div className="lg:-mt-4">
                        <SingleSearch
                            type="Country of Final Destination"
                            list={Countries}
                            selectedItem={countryFinalDestination}
                            setSelectedItem={setCountryFinalDestination}
                            showSearch={true}
                        />
                    </div>
                </div>
                <h1 className="text-xl mb-4">Sender Details:</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 justify-items-center justify-center items-start content-center gap-4 mb-4">
                    <div className="lg:-mt-1">
                        <SingleSearch
                            type="Sender Name"
                            list={senderNameOptions}
                            selectedItem={senderName}
                            setSelectedItem={(name) => {
                                setSenderName(name);
                                fetchCustomerDetails(name, "sender");
                            }}
                            showSearch={true}
                            onInputChange={(value) => fetchCustomerNames(value, "sender")}
                        />
                    </div>
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="senderAddress">Sender Address:</Label>
                        <textarea
                            id="senderAddress"
                            placeholder="Sender Address"
                            value={senderAddress}
                            onChange={(e) => setSenderAddress(e.target.value)}
                            className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4" // Set rows to control the height
                        />
                    </div>
                    <div className="lg:-mt-10">
                        <SingleSearch
                            type="Sender Country"
                            list={Countries}
                            selectedItem={senderCountry}
                            setSelectedItem={setSenderCountry}
                            showSearch={true}
                        />
                    </div>
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="senderZipCode">Sender Zip Code:</Label>
                        <Input
                            type="text"
                            placeholder="Sender Zip Code"
                            value={senderZipCode}
                            onChange={(e) => setSenderZipCode(e.target.value)}
                        />
                    </div>
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="senderContact">Sender Contact:</Label>
                        <Input
                            type="text"
                            placeholder="Sender Contact"
                            value={senderContact}
                            onChange={(e) => setSenderContact(e.target.value)}
                        />
                    </div>
                    <div className="lg:-mt-10">
                        <SingleSearch
                            type="Sender KYC Type"
                            list={["Aadhaar No -", "Pan No -", "Passport No -", "Driving License No -", "Voter ID Card No -", "GST No -"]}
                            selectedItem={kycType}
                            setSelectedItem={setKycType}
                            showSearch={true}
                        />
                    </div>
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="kyc">KYC:</Label>
                        <Input
                            type="text"
                            placeholder="KYC"
                            value={kyc}
                            onChange={(e) => setKyc(e.target.value)}
                        />
                    </div>
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="gst">GST:</Label>
                        <Input
                            type="text"
                            placeholder="GST No"
                            value={gst}
                            onChange={(e) => setGst(e.target.value)}
                        />
                    </div>
                </div>
                <h1 className="text-xl mb-4">Receiver Details:</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 justify-items-center justify-center items-start content-center gap-4 mb-4">
                    <div className="lg:-mt-1">
                        <SingleSearch
                            type="Receiver Name"
                            list={receiverNameOptions}
                            selectedItem={receiverName}
                            setSelectedItem={(name) => {
                                setReceiverName(name);
                                fetchCustomerDetails(name, "receiver");
                            }}
                            showSearch={true}
                            onInputChange={(value) => fetchCustomerNames(value, "receiver")}
                        />
                    </div>
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="receiverAddress">Receiver Address:</Label>
                        <textarea
                            id="receiverAddress"
                            placeholder="Receiver Address"
                            value={receiverAddress}
                            onChange={(e) => setReceiverAddress(e.target.value)}
                            className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4" // Set rows to control the height
                        />
                    </div>
                    <div className="">
                        <SingleSearch
                            type="Receiver Country"
                            list={Countries}
                            selectedItem={receiverCountry}
                            setSelectedItem={setReceiverCountry}
                            showSearch={true}
                        />
                    </div>
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="receiverZipCode">Receiver Zip Code:</Label>
                        <Input
                            type="text"
                            placeholder="Receiver Zip Code"
                            value={receiverZipCode}
                            onChange={(e) => setReceiverZipCode(e.target.value)}
                        />
                    </div>
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="receiverContact">Receiver Contact:</Label>
                        <Input
                            type="text"
                            placeholder="Receiver Contact"
                            value={receiverContact}
                            onChange={(e) => setReceiverContact(e.target.value)}
                        />
                    </div>
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="zone">Zone:</Label>
                        <Input
                            type="text"
                            placeholder="Zone"
                            value={zone}
                            onChange={(e) => setZone(e.target.value)}
                        />
                    </div>
                </div>
                <h1 className="text-xl mb-4">Bill To Details:</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 justify-items-center justify-center items-start content-center gap-4 mb-4">
                    <div className="">
                        <SingleSearch
                            type="Bill To"
                            list={["Sender", "Receiver", "Other Person"]}
                            topList={["Sender", "Receiver", "Other Person"]}
                            selectedItem={billToSelector}
                            setSelectedItem={setBillToSelector}
                            showSearch={false}
                        />
                    </div>
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="billToName">Bill To Name:</Label>
                        <Input
                            type="text"
                            placeholder="Bill To Name"
                            value={billToName}
                            onChange={(e) => setBillToName(e.target.value)}
                        />
                    </div>
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="billToAddress">Bill To Address:</Label>
                        <Input
                            type="text"
                            placeholder="Bill To Address"
                            value={billToAddress}
                            onChange={(e) => setBillToAddress(e.target.value)}
                        />
                    </div>
                    <div className="grid w-full min-w-sm items-center gap-1.5">
                        <Label htmlFor="billToContact">Bill To Contact:</Label>
                        <Input
                            type="text"
                            placeholder="Bill To Contact"
                            value={billToContact}
                            onChange={(e) => setBillToContact(e.target.value)}
                        />
                    </div>
                </div>
                <h1 className="text-xl mb-4">Box Details:</h1>
                <div className="mb-4">
                    <h2 className="text-lg font-bold mb-2">Boxes</h2>
                    {boxes.map((box, boxIndex) => (
                        <div key={boxIndex} className="p-4 mb-4 border rounded shadow-sm">
                            <h1 className="text-xl mb-4">Box {boxIndex + 1}:</h1>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                                {/* Box Fields */}
                                <div>
                                    <Label htmlFor="length">Length (cm):</Label>
                                    <Input
                                        type="number"
                                        placeholder="Length (cm)"
                                        value={box.length || ""}
                                        onChange={(e) =>
                                            handleBoxChange(boxIndex, "length", parseFloat(e.target.value) || "")
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="breadth">Breadth (cm):</Label>
                                    <Input
                                        type="number"
                                        placeholder="Breadth (cm)"
                                        value={box.breadth || ""}
                                        onChange={(e) =>
                                            handleBoxChange(boxIndex, "breadth", parseFloat(e.target.value) || "")
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="height">Height (cm):</Label>
                                    <Input
                                        type="number"
                                        placeholder="Height (cm)"
                                        value={box.height || ""}
                                        onChange={(e) =>
                                            handleBoxChange(boxIndex, "height", parseFloat(e.target.value) || "")
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="actualWeight">Actual Weight (kg):</Label>
                                    <Input
                                        type="number"
                                        placeholder="Actual Weight (kg)"
                                        value={box.actualWeight || ""}
                                        onChange={(e) =>
                                            handleBoxChange(boxIndex, "actualWeight", parseFloat(e.target.value) || "")
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="dimensionalWeight">Dimensional Weight (kg):</Label>
                                    <Input
                                        type="number"
                                        placeholder="Dimensional Weight (kg)"
                                        value={box.dimensionalWeight || ""}
                                        readOnly
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="chargeableWeight">Chargeable Weight (kg):</Label>
                                    <Input
                                        type="number"
                                        placeholder="Chargeable Weight (kg)"
                                        value={box.chargeableWeight || ""}
                                        readOnly
                                        required
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeBox(boxIndex)}
                                    className="lg:mt-6 w-28 h-8 bg-red-500 text-white rounded"
                                >
                                    Remove Box
                                </button>
                            </div>
                            <h3 className="text-lg font-semibold mt-4">Items</h3>
                            {box.items.map((item, itemIndex) => (
                                <>
                                    <h1 className="text-md mb-4">Item {itemIndex + 1}:</h1>
                                    <div key={itemIndex} className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                                        <div>
                                            <Label htmlFor={`itemName-${boxIndex}-${itemIndex}`}>Name:</Label>
                                            <Input
                                                type="text"
                                                placeholder="Item Name"
                                                value={item.name || ""}
                                                onChange={(e) =>
                                                    handleItemChange(boxIndex, itemIndex, "name", e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`itemQuantity-${boxIndex}-${itemIndex}`}>Quantity:</Label>
                                            <Input
                                                type="number"
                                                placeholder="Quantity"
                                                value={item.quantity || ""}
                                                onChange={(e) =>
                                                    handleItemChange(boxIndex, itemIndex, "quantity", e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`itemPrice-${boxIndex}-${itemIndex}`}>Price:</Label>
                                            <Input
                                                type="number"
                                                placeholder="Price"
                                                value={item.price || ""}
                                                onChange={(e) =>
                                                    handleItemChange(boxIndex, itemIndex, "price", e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(boxIndex, itemIndex)}
                                            className="lg:mt-6 w-28 h-8 bg-red-500 text-white px-2 py-1 rounded"
                                        >
                                            Remove Item
                                        </button>
                                    </div>
                                </>
                            ))}
                            <button
                                type="button"
                                onClick={() => addItem(boxIndex)}
                                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                            >
                                Add Item
                            </button>
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

                <h1 className="text-xl mb-4">Service:</h1>
                <p>Total Chargeable Weight: {totalChargeableWeight}</p>
                <div className="">
                    <SingleSearch
                        type="Select Service"
                        list={["DHL", "FedEx", "UPS", "DTDC", "SkyNet", "Atlantic", "Aramex", "Orbit",]}
                        topList={["DHL", "FedEx", "UPS", "DTDC", "SkyNet", "Atlantic", "Aramex", "Orbit",]}
                        selectedItem={service}
                        setSelectedItem={setService}
                        showSearch={false}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 justify-items-center justify-center items-start content-center gap-4 mb-4">
                    <div>
                        <Label htmlFor="baseRate">Base Rate:</Label>
                        <Input
                            type="number"
                            placeholder="Base Rate"
                            value={baseRate}
                            readOnly={true}
                        />
                    </div>
                    <div>
                        <Label htmlFor="profitRate">Profit Rate:</Label>
                        <Input
                            type="number"
                            placeholder="Profit Rate"
                            value={profitRate}
                            readOnly={true}
                        />
                    </div>
                    <div>
                        <Label htmlFor="discountedProfitRate">Discounted Profit Rate:</Label>
                        <Input
                            type="number"
                            placeholder="Discounted Profit Rate"
                            value={discountedProfitRate}
                            onChange={(e) => setDiscountedProfitRate(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="rate">Rate:</Label>
                        <Input
                            type="number"
                            placeholder="Rate"
                            value={rate}
                            readOnly={true}
                        />
                    </div>
                    <div>
                        <Label htmlFor="baseRate">Sub Total:</Label>
                        <Input
                            type="number"
                            placeholder="Sub Total"
                            value={subtotal}
                            readOnly={true}
                        />
                    </div>
                    <div>
                        <Label htmlFor="discount">Discount:</Label>
                        <Input
                            type="number"
                            placeholder="Discount"
                            value={discount}
                            readOnly={true}
                        />
                    </div>
                    <div>
                        <Label htmlFor="taxableAmount">Taxable Amount:</Label>
                        <Input
                            type="number"
                            placeholder="Taxable Amount"
                            value={taxableAmount}
                            readOnly={true}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 justify-items-center justify-end items-start content-center gap-2 mb-4 max-w-54">
                    <div>
                        <Label htmlFor="cgstPercent">CGST Percent</Label>
                        <Input
                            type="number"
                            placeholder="cgstPercent"
                            value={cgstPercent}
                            onChange={(e) => setCgstPercent(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="cgst">CGST</Label>
                        <Input
                            type="number"
                            placeholder="cgst"
                            value={cgst}
                            readOnly={true}
                        />
                    </div>
                    <div>
                        <Label htmlFor="sgstPercent">SGST Percent</Label>
                        <Input
                            type="number"
                            placeholder="sgstPercent"
                            value={sgstPercent}
                            onChange={(e) => setSgstPercent(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="sgst">SGST</Label>
                        <Input
                            type="number"
                            placeholder="sgst"
                            value={sgst}
                            readOnly={true}
                        />
                    </div>
                    <div>
                        <Label htmlFor="igstPercent">IGST Percent</Label>
                        <Input
                            type="number"
                            placeholder="igstPercent"
                            value={igstPercent}
                            onChange={(e) => setIgstPercent(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="igst">IGST</Label>
                        <Input
                            type="number"
                            placeholder="igst"
                            value={igst}
                            readOnly={true}
                        />
                    </div>
                    <div></div>
                    <div>
                        <Label htmlFor="total">Total</Label>
                        <Input
                            type="number"
                            placeholder="Total"
                            value={total}
                            readOnly={true}
                        />
                    </div>
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

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { formatToIndianNumber } from "@/lib/utils";
import Modal from "@/app/_components/Modal";

export const columns = [
    {
        accessorKey: "date.date",
        header: ({ column }) => (
            <span
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center gap-1"
            >
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </span>
        ),
    },
    {
        accessorKey: "invoiceNumber",
        header: ({ column }) => (
            <span
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center gap-1"
            >
                Invoice No.
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </span>
        ),
    },
    {
        accessorKey: "trackingNumber",
        header: ({ column }) => (
            <span
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center gap-1"
            >
                Tracking No.
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </span>
        ),
    },
    {
        accessorKey: "sender.name",
        header: ({ column }) => (
            <span
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center gap-1"
            >
                Sender
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </span>
        ),
    },
    {
        accessorKey: "receiver.name",
        header: ({ column }) => (
            <span
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center gap-1"
            >
                Receiver
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </span>
        ),
    },
    {
        accessorKey: "toCountry",
        header: ({ column }) => (
            <span
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center gap-1"
            >
                Destination
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </span>
        ),
    },
    {
        accessorKey: "staffId",
        header: ({ column }) => (
            <span
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center gap-1"
            >
                Staff
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </span>
        ),
    },
    {
        accessorKey: "parcelType",
        header: ({ column }) => (
            <span
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex items-center gap-1"
            >
                Category
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </span>
        ),
    },
];

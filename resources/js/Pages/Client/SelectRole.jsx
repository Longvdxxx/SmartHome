import React from "react";
import { usePage, router } from "@inertiajs/react";

export default function SelectRole() {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-6">
            <h1 className="text-3xl font-bold">You are?</h1>
            <div className="flex gap-4">
                <button
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    onClick={() => router.get('/shop/dashboard')}
                >
                    Customer
                </button>
                <button
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    onClick={() => router.get('/server/dashboard')}
                >
                    User
                </button>
            </div>
        </div>
    );
}

import React, { useRef, useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import EmployeeLayout from "@/Layouts/EmployeeLayout";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function CustomerPage({ customers = [] }) {
    const toast = useRef(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(customers);
    const [searched, setSearched] = useState(false);

    // Form state
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("staff.customers.index"),
            { q: query },
            {
                preserveState: true,
                onSuccess: (page) => {
                    setResults(page.props.customers || []);
                    setSearched(true);
                },
            }
        );
    };

    const handleCreate = (e) => {
        e.preventDefault();
        post(route("staff.customers.store"), {
            onSuccess: () => {
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Customer created successfully.",
                });
                reset();
            },
            onError: () => {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Failed to create customer.",
                });
            },
        });
    };

    return (
        <EmployeeLayout>
            <Head title="Customers" />
            <div className="p-6">
                <Toast ref={toast} />

                {/* Search */}
                <Card title="Search Customer" className="p-6 shadow-md mb-6">
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <InputText
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name / phone / email"
                            className="w-full"
                        />
                        <Button
                            type="submit"
                            label="Search"
                            icon="pi pi-search"
                            className="px-4" // ✅ fix chữ bị lệch
                        />
                    </form>
                </Card>

                {/* Results */}
                {searched && results.length > 0 && (
                    <Card title="Search Results" className="p-6 shadow-md">
                        <DataTable value={results} paginator rows={5}>
                            <Column field="name" header="Name" />
                            <Column field="email" header="Email" />
                            <Column field="phone" header="Phone" />
                            <Column
                                header="Action"
                                body={(row) => (
                                    <Button
                                        label="Proceed to Checkout"
                                        icon="pi pi-arrow-right"
                                        onClick={() =>
                                            toast.current.show({
                                                severity: "info",
                                                summary: "Checkout",
                                                detail: `Checkout for ${row.name}`,
                                            })
                                        }
                                    />
                                )}
                            />
                        </DataTable>
                    </Card>
                )}

                {/* Not found */}
                {searched && results.length === 0 && (
                    <Card title="Create New Customer" className="p-6 shadow-md mt-6">
                        <p className="mb-4 text-red-600">
                            No customer found. Please create a new customer.
                        </p>
                        <form onSubmit={handleCreate}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block mb-1 font-semibold">
                                        Name
                                    </label>
                                    <InputText
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        className="w-full"
                                    />
                                    {errors.name && <small className="p-error">{errors.name}</small>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block mb-1 font-semibold">
                                        Email
                                    </label>
                                    <InputText
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        className="w-full"
                                    />
                                    {errors.email && (
                                        <small className="p-error">{errors.email}</small>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label htmlFor="phone" className="block mb-1 font-semibold">
                                        Phone
                                    </label>
                                    <InputText
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData("phone", e.target.value)}
                                        className="w-full"
                                    />
                                    {errors.phone && (
                                        <small className="p-error">{errors.phone}</small>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label htmlFor="password" className="block mb-1 font-semibold">
                                        Password
                                    </label>
                                    <Password
                                        id="password"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        toggleMask
                                        feedback={false}
                                        className="w-full"
                                    />
                                    {errors.password && (
                                        <small className="p-error">{errors.password}</small>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="password_confirmation"
                                        className="block mb-1 font-semibold"
                                    >
                                        Confirm Password
                                    </label>
                                    <Password
                                        id="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData("password_confirmation", e.target.value)
                                        }
                                        toggleMask
                                        feedback={false}
                                        className="w-full"
                                    />
                                    {errors.password_confirmation && (
                                        <small className="p-error">
                                            {errors.password_confirmation}
                                        </small>
                                    )}
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end mt-8">
                                <Button
                                    label={processing ? "Saving..." : "Save Customer"}
                                    icon="pi pi-check"
                                    loading={processing}
                                    type="submit"
                                    className="px-6"
                                />
                            </div>
                        </form>
                    </Card>
                )}
            </div>
        </EmployeeLayout>
    );
}

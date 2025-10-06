import EmployeeLayout from "@/Layouts/EmployeeLayout";
import { Head, Link } from "@inertiajs/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

export default function Index({ auth, employees }) {
    return (
        <EmployeeLayout user={auth.user}>
            <Head title="Manage Employees" />
            <div className="card shadow-2 p-4 bg-white rounded-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Employee Management</h2>
                    <Link href={route("staff.manage.create")}>
                        <Button label="Add Employee" icon="pi pi-plus" />
                    </Link>
                </div>

                <DataTable value={employees} paginator rows={10} responsiveLayout="scroll">
                    <Column field="id" header="ID" style={{ width: "5%" }} />
                    <Column field="name" header="Name" sortable />
                    <Column field="email" header="Email" sortable />
                    <Column field="role" header="Role" />
                    <Column field="store.name" header="Store" />
                    <Column
                        header="Actions"
                        body={(row) => (
                            <div className="flex gap-2">
                                <Link href={route("staff.manage.show", row.id)}>
                                    <Button icon="pi pi-eye" rounded text />
                                </Link>
                                <Link href={route("staff.manage.edit", row.id)}>
                                    <Button icon="pi pi-pencil" rounded text severity="warning" />
                                </Link>
                            </div>
                        )}
                    />
                </DataTable>
            </div>
        </EmployeeLayout>
    );
}

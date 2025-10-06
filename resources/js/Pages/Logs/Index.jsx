import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";

export default function Index({ logs, filters }) {
  const { auth } = usePage().props;
  const [globalFilter, setGlobalFilter] = useState(filters.search || "");
  const [actionFilter, setActionFilter] = useState(filters.action || "");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);

  const actionOptions = [
    { label: "All", value: "" },
    { label: "Created", value: "created" },
    { label: "Updated", value: "updated" },
    { label: "Deleted", value: "deleted" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(
      route("logs.index"),
      {
        search: globalFilter,
        action: actionFilter,
        page: 1,
      },
      { preserveState: true, replace: true }
    );
  };

  const renderLimitedContent = (content, maxLength = 50, maxHeight = 60) => {
    if (!content) return "-";

    const isString = typeof content === "string";
    let isLong = false;
    let shortContent;

    if (isString) {
      isLong = content.length > maxLength;
      shortContent = isLong ? content.substring(0, maxLength) + "..." : content;
    } else {
      const entries = Object.entries(content);
      isLong = entries.length > maxLength;
      const shortEntries = entries.slice(0, maxLength);

      shortContent = (
        <ul className="list-disc pl-4 text-sm">
          {shortEntries.map(([field, values]) => (
            <li key={field}>
              <strong>{field}</strong>: <span className="text-red-500 line-through">{values.old}</span> →{" "}
              <span className="text-green-600">{values.new}</span>
            </li>
          ))}
          {isLong && <li>...</li>}
        </ul>
      );
    }

    return (
      <div
        style={{
          maxHeight: `${maxHeight}px`,
          overflow: "hidden",
          cursor: isLong ? "pointer" : "default",
        }}
        onClick={() => {
          if (!isLong) return;

          if (isString) {
            setDialogContent(<p>{content}</p>);
          } else {
            const fullContent = (
              <ul className="list-disc pl-4 text-sm">
                {Object.entries(content).map(([field, values]) => (
                  <li key={field}>
                    <strong>{field}</strong>: <span className="text-red-500 line-through">{values.old}</span> →{" "}
                    <span className="text-green-600">{values.new}</span>
                  </li>
                ))}
              </ul>
            );
            setDialogContent(fullContent);
          }

          setDialogVisible(true);
        }}
      >
        {shortContent}
      </div>
    );
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="User Logs" />
      <Card>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search logs..."
            className="p-inputtext-sm"
          />
          <Dropdown
            value={actionFilter}
            options={actionOptions}
            onChange={(e) => {
              setActionFilter(e.value);
              router.get(
                route("logs.index"),
                {
                  search: globalFilter,
                  action: e.value,
                  page: 1,
                },
                { preserveState: true, replace: true }
              );
            }}
            placeholder="Filter by action"
            className="p-inputtext-sm"
            style={{ width: "180px" }}
          />
          <Button type="submit" label="Search" />
        </form>

        <DataTable
          value={logs.data}
          paginator
          rows={logs.per_page}
          totalRecords={logs.total}
          first={(logs.current_page - 1) * logs.per_page}
          onPage={(e) => {
            router.get(
              route("logs.index"),
              {
                search: globalFilter,
                action: actionFilter,
                page: e.page + 1,
              },
              { preserveState: true, replace: true }
            );
          }}
          stripedRows
          responsiveLayout="scroll"
        >
          <Column field="id" header="ID" style={{ width: "70px" }} />
          <Column field="loggable_type" header="Type" />
          <Column field="loggable_id" header="Loggable ID" />
          <Column field="action" header="Action" />
          <Column
            field="description"
            header="Description"
            body={(rowData) => renderLimitedContent(rowData.description, 50, 50)}
          />
          <Column field="ip_address" header="IP" />
          <Column
            header="Changes"
            body={(rowData) => renderLimitedContent(rowData.changes, 3, 60)}
          />
          <Column field="created_at" header="Created At" />
        </DataTable>
      </Card>

      <Dialog
        header="Details"
        visible={dialogVisible}
        style={{ width: "50vw" }}
        onHide={() => setDialogVisible(false)}
      >
        {dialogContent}
      </Dialog>
    </AuthenticatedLayout>
  );
}

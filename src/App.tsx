"use client";

import "./App.css";
import { AddUserDialog } from "./components/add-user-dialog";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { BrandingBadge } from "./components/worqhat-badge";
import { Users } from "lucide-react";
import { useUsers } from "./hooks/use-users";

function App() {
  const { data = [], isLoading } = useUsers();

  return (
    <>
      <div className="fixed bottom-0 right-20">
        <BrandingBadge />
      </div>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <AddUserDialog />
        </div>
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          enableSorting={true}
          enablePagination={true}
          enableFiltering={true}
          filterableColumns={["name", "amount"]}
          emptyIcon={<Users className="h-12 w-12 text-muted-foreground" />}
          filterPlaceholder="Search Users..."
          emptyText="No Users found. Create one to get started!"
        />
      </div>
    </>
  );
}

export default App;

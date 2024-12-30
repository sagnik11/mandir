"use client";

import "./App.css";
import { AddUserDialog } from "./components/add-user-dialog";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useEffect, useState, useCallback } from "react";
import { getAllUsers } from "./lib/api";
import { toast } from "sonner";
import { BrandingBadge } from "./components/worqhat-badge";
import { Users } from "lucide-react";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const users = await getAllUsers();
      setData(users);
    } catch (error) {
      toast.error("Failed to fetch users. Please try again.");
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div className="fixed bottom-0 right-20">
        <BrandingBadge />
      </div>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <AddUserDialog onSuccess={fetchData} />
        </div>
        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          onDataChange={fetchData}
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

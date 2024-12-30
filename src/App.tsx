import "./App.css";
import { DataTable } from "@/components/ui/data-table";
import { Users } from "lucide-react";
import { useState } from "react";
import { columns, DataFormat } from "./columns";
import { BrandingBadge } from "./components/worqhat-badge";
import { AddUserDialog } from "./components/add-user-dialog";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DataFormat[]>([]);

  return (
    <>
      <div className="fixed bottom-0 right-20">
        <BrandingBadge />
      </div>
      <div className="w-full">
        <div className="flex justify-end items-center">
          <AddUserDialog />
        </div>

        <DataTable
          columns={columns}
          data={data}
          enableSorting={true}
          enablePagination={true}
          enableFiltering={true}
          filterableColumns={["name", "amount"]}
          emptyIcon={<Users className="h-12 w-12 text-muted-foreground" />}
          filterPlaceholder="Search Users..."
          emptyText="No Users found. Create one to get started!"
          isLoading={isLoading}
        />
      </div>
    </>
  );
}

export default App;

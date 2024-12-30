import "./App.css";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Users, Plus } from "lucide-react";
import { useState } from "react";
import { columns, DataFormat } from "./columns";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DataFormat[]>([]);

  return (
    <>
      <div className="p-3 sm:p-5 bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-950 dark:border-neutral-800">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-end items-center">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add User Details
            </Button>
          </div>

          <div className="mt-8">
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
        </div>
      </div>
    </>
  );
}

export default App;

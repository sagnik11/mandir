"use client";

import "./App.css";
import { AddUserDialog } from "./components/add-user-dialog";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { BrandingBadge } from "./components/worqhat-badge";
import { Users, IndianRupee } from "lucide-react";
import { useUsers } from "./hooks/use-users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

function App() {
  const { data = [], isLoading } = useUsers();

  const totalAmount = data.reduce(
    (sum: number, user: { amount: number }) => sum + user.amount,
    0,
  );
  const totalUsers = data.length;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

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

        <motion.div
          className="grid gap-4 md:grid-cols-2 mb-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Amount
                </CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total contributions received
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Active contributors
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

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

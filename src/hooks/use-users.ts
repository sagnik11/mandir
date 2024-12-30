import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addUser, deleteUser, getAllUsers, updateUser } from "@/lib/api";
import { toast } from "sonner";
import { DataFormat } from "@/columns";

export const USERS_QUERY_KEY = ["users"];

export function useUsers() {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: getAllUsers,
  });
}

export function useAddUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success("User added successfully");
    },
    onError: (error: unknown) => {
      console.error("Error adding user:", error);
      toast.error("Failed to add user. Please try again.");
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DataFormat> }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success("User updated successfully");
    },
    onError: (error: unknown) => {
      console.error("Error updating user:", error);
      toast.error("Failed to update user. Please try again.");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success("User deleted successfully");
    },
    onError: (error: unknown) => {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    },
  });
}

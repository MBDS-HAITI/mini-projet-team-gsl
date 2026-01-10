import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconPencil } from "@tabler/icons-react";

import { useFetchData } from "@/hooks/use-fetch-data.js";
import { UserRoleForm } from "@/components/users/user-role-form";

export default function UsersPage() {
  const { data: response, loading, error, refetch } = useFetchData("/users");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const users = response?.data || [];

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsSheetOpen(true);
  };

  const handleSuccess = () => {
    refetch(); 
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(timestamp));
  };

  const getUserInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
      </div>
      <div className="rounded-md border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Last Sign In</TableHead>
              <TableHead className="w-12.5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            )}

            {error && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-red-500"
                >
                  Error: {error}
                </TableCell>
              </TableRow>
            )}

            {!loading && !error &&
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={user.imageUrl}
                        alt={user.username || "User"}
                      />
                      <AvatarFallback>
                        {getUserInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.username ? `@${user.username}` : ""}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>{formatDate(user.lastSignInAt)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(user)}
                    >
                      <IconPencil className="size-4" />
                      <span className="sr-only">Edit role</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

            {!loading && !error && users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <UserRoleForm
        user={selectedUser}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

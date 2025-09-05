"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Shield, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  isAdmin: boolean;
  emailVerified?: string | null;
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (userId: string, isAdmin: boolean) => {
    setUpdatingUser(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAdmin }),
      });

      if (!response.ok) throw new Error("Failed to update user");

      setUsers(
        users.map((user) => (user.id === userId ? { ...user, isAdmin } : user)),
      );

      toast.success(`User ${isAdmin ? "granted" : "removed"} admin privileges`);
    } catch {
      toast.error("Failed to update user");
    } finally {
      setUpdatingUser(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Admin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="flex items-center gap-3">
                  <div className="bg-muted h-8 w-8 animate-pulse rounded-full" />
                  <div className="space-y-2">
                    <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                    <div className="bg-muted h-3 w-24 animate-pulse rounded" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-4 w-48 animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="bg-muted h-5 w-12 animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Admin</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const initials = (user.name || user.email || "")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <TableRow key={user.id}>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name || "No name"}</div>
                    <div className="text-muted-foreground text-sm">
                      ID: {user.id.slice(0, 8)}...
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.emailVerified ? "default" : "secondary"}>
                    {user.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.isAdmin ? (
                      <ShieldCheck className="text-primary h-4 w-4" />
                    ) : (
                      <Shield className="text-muted-foreground h-4 w-4" />
                    )}
                    <Switch
                      checked={user.isAdmin}
                      onCheckedChange={(checked) =>
                        toggleAdmin(user.id, checked)
                      }
                      disabled={updatingUser === user.id}
                    />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

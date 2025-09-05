"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Mail } from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

interface WhitelistEntry {
  id: string;
  email: string;
  createdAt: string;
}

interface EmailWhitelistManagerProps {
  allowedDomains?: string[];
}

export function EmailWhitelistManager({
  allowedDomains = [],
}: EmailWhitelistManagerProps) {
  const [entries, setEntries] = useState<WhitelistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/email-whitelist");
      if (!response.ok) throw new Error("Failed to fetch whitelist");
      const data = await response.json();
      setEntries(data);
    } catch {
      toast.error("Failed to load email whitelist");
    } finally {
      setLoading(false);
    }
  };

  const addEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsAddingEmail(true);
    try {
      const response = await fetch("/api/email-whitelist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newEmail.toLowerCase() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add email");
      }

      const newEntry = await response.json();
      setEntries([...entries, newEntry]);
      setNewEmail("");
      setDialogOpen(false);
      toast.success("Email added to whitelist");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add email",
      );
    } finally {
      setIsAddingEmail(false);
    }
  };

  const deleteEmail = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/email-whitelist/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete email");

      setEntries(entries.filter((entry) => entry.id !== id));
      toast.success("Email removed from whitelist");
    } catch {
      toast.error("Failed to delete email");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <div className="bg-muted h-6 w-48 animate-pulse rounded" />
          <div className="bg-muted h-4 w-72 animate-pulse rounded" />
          <div className="mb-6 flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-muted h-6 w-20 animate-pulse rounded-full"
              />
            ))}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email Address</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="bg-muted h-4 w-48 animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="bg-muted h-8 w-8 animate-pulse rounded" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Whitelisted Domains Section */}
      {allowedDomains.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-medium">Whitelisted Domains</h3>
          <p className="text-muted-foreground mb-3 text-sm">
            Any email from these domains can sign up automatically:
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            {allowedDomains.map((domain) => (
              <Badge key={domain} variant="outline" className="px-3 py-1">
                @{domain}
              </Badge>
            ))}
          </div>
          <div className="mb-6 border-b pb-4" />
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="mb-2 text-lg font-medium">
            Individual Email Addresses
          </h3>
          <Badge variant="secondary" className="mb-2">
            {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </Badge>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Email
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={addEmail}>
              <DialogHeader>
                <DialogTitle>Add Email to Whitelist</DialogTitle>
                <DialogDescription>
                  Enter an email address to allow sign-ups from this address.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2 py-4">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isAddingEmail}>
                  {isAddingEmail && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Email
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {entries.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center">
          <Mail className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p>No email addresses in whitelist</p>
          <p className="text-sm">
            Add email addresses to control who can sign up
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email Address</TableHead>
              <TableHead>Added</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.email}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DeleteConfirmationDialog
                    trigger={
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={deletingId === entry.id}
                      >
                        {deletingId === entry.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    }
                    title="Remove email from whitelist?"
                    description={`Are you sure you want to remove "${entry.email}" from the whitelist? This email will no longer be able to sign up.`}
                    confirmText="Remove"
                    onConfirm={() => deleteEmail(entry.id)}
                    isLoading={deletingId === entry.id}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

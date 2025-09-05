"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface AccountSettingsFormProps {
  user: User;
}

export function AccountSettingsForm({ user }: AccountSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    image: user.image || "",
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/account/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          image: formData.image,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Update failed");
      }

      toast.success("Your account has been updated successfully.");

      // Refresh the page to update the session
      window.location.reload();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update account",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (url: string | null) => {
    setFormData((prev) => ({ ...prev, image: url || "" }));
  };

  const handleImageError = (error: string) => {
    toast.error(error);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-6">
      {/* Profile Picture */}
      <div className="space-y-4">
        <Label>Profile Picture</Label>
        <ImageUpload
          value={formData.image}
          onChange={handleImageUpload}
          onError={handleImageError}
          variant="avatar"
          size="lg"
        />
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Enter your name"
        />
      </div>

      {/* Email (read-only) */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={user.email || ""}
          disabled
          className="bg-muted"
        />
        <p className="text-muted-foreground text-sm">
          Email cannot be changed. Contact support if you need to update it.
        </p>
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}

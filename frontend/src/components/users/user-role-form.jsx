import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ROLES } from "@/lib/roles";
import { toast } from "sonner";

export function UserRoleForm({ user, open, onOpenChange, onSuccess }) {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setRole(user.publicMetadata?.role || ROLES.STUDENT);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would make a PUT/PATCH request here
      // await fetch(`/api/users/${user.id}`, { method: 'PATCH', body: JSON.stringify({ publicMetadata: { role } }) });

      toast.success(`Role updated to ${role}`);

      // Pass back the updated role so the parent can update local state
      if (onSuccess) {
        onSuccess(user.id, role);
      }
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit User Role</SheetTitle>
          <SheetDescription>
            Assign a role to {user?.firstName} {user?.lastName}.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-6">
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ROLES).map((r) => (
                  <SelectItem key={r} value={r}>
                    {r
                      .split("_")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

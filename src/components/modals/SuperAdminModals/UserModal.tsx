import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type UserModalType = "add" | "edit";

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: UserModalType;
  user?: any;
  departments?: any[];
  onSave?: (data: any) => Promise<void>;
}

export function UserModal({
  open,
  onOpenChange,
  type,
  user,
  departments = [],
  onSave,
}: UserModalProps) {
  const [errors, setErrors] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open) {
      setErrors(null);
    }
  }, [open]);

  const getTitle = () => {
    switch (type) {
      case "add":
        return "Add New User";
      case "edit":
        return "Edit User";
      default:
        return "";
    }
  };

  const validateCredentials = (data: any) => {
    const validationErrors: string[] = [];
    if (type === "add") {
      if (!data.userName || data.userName.trim().length < 3) {
        validationErrors.push("Username must be at least 3 characters");
      }
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        validationErrors.push("Valid email is required");
      }
      if (!data.password || data.password.length < 6) {
        validationErrors.push("Password must be at least 6 characters");
      } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(data.password)) {
        validationErrors.push("Password must contain at least 1 uppercase letter, 1 number, and 1 special character");
      }
      if (!data.confirmPassword || data.password !== data.confirmPassword) {
        validationErrors.push("Passwords do not match");
      }
    } else if (type === "edit") {
      if (data.password && data.password.length > 0) {
        if (data.password.length < 6) {
          validationErrors.push("Password must be at least 6 characters");
        } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(data.password)) {
          validationErrors.push("Password must contain at least 1 uppercase letter, 1 number, and 1 special character");
        }
        if (!data.confirmPassword || data.password !== data.confirmPassword) {
          validationErrors.push("Passwords do not match");
        }
      }
    }
    return validationErrors;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Resizing the modal size is this DialogContent*/}
      <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto p-6 rounded-xl max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const data = {
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                userName: formData.get("userName") as string,
                email: formData.get("email") as string,
                password: formData.get("password") as string,
                confirmPassword: formData.get("confirmPassword") as string,
                departmentId: formData.get("departmentId") as string,
                role: formData.get("role") as string,
                phone: formData.get("phone") as string,
                address: formData.get("address") as string,
                employeeId: formData.get("employeeId") as string,
                startDate: formData.get("startDate") as string,
              };

              // Only include password if it's provided (for edit mode, password is optional)
              if (data.password && data.password.trim() !== "") {
                data.password = data.password;
              }

              const validationErrors = validateCredentials(data);
              if (validationErrors.length > 0) {
                setErrors(validationErrors.join(", "));
                return;
              }

              setErrors(null);
              try {
                if (onSave) {
                  await onSave(data);
                }
                onOpenChange(false);
              } catch (err) {
                setErrors(err instanceof Error ? err.message : "Failed to save user");
              }
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  First Name
                </label>
                <input
                  name="firstName"
                  type="text"
                  defaultValue={type === "edit" ? user?.firstName : ""}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Last Name
                </label>
                <input
                  name="lastName"
                  type="text"
                  defaultValue={type === "edit" ? user?.lastName : ""}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter last name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Username
                </label>
                <input
                  name="userName"
                  type="text"
                  defaultValue={type === "edit" ? user?.userName : ""}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter username"
                  required={type === "add"}
                  disabled={type === "edit"}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                defaultValue={type === "edit" ? user?.email : ""}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter email"
                required
                disabled={type === "edit"}
              />
            </div>

            {/* Password Field - visible in both Add and Edit modes */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password {type === "edit" && "(leave blank to keep current)"}
              </label>
              {type === "add" && (
                <p className="text-xs text-slate-500 mb-2">
                  Must contain at least: 1 uppercase letter, 1 number, 1 special character
                </p>
              )}
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={
                    type === "add"
                      ? "Enter password"
                      : "Enter new password (optional)"
                  }
                  required={type === "add"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Confirm password"
                required={type === "add"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Department
                </label>
                <select
                  name="departmentId"
                  defaultValue={type === "edit" ? user?.departmentId : ""}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ADD THIS ROLE FIELD */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  defaultValue={
                    type === "edit" ? user?.roles?.[0] || "User" : "User"
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Employee ID
                </label>
                <input
                  name="employeeId"
                  type="text"
                  defaultValue={type === "edit" ? user?.employeeId : ""}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter employee ID"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  defaultValue={type === "edit" ? user?.phone : ""}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Start Date
                </label>
                <input
                  name="startDate"
                  type="date"
                  defaultValue={
                    type === "edit" ? user?.startDate?.split("T")[0] : ""
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                defaultValue={type === "edit" ? user?.address : ""}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter address"
                rows={2}
              />
            </div>

            {errors && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded mt-4">
                {errors}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {type === "add" ? "Add" : "Update"} User
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import CustomButton from "@/components/button/button";
import CustomTextField from "@/components/textField/textField";
import CustomAutoComplete, { AutocompleteOption } from "@/components/textField/customAutoComplete";
import { useLayoutContext } from "@/utils/context/contextGlobal";

interface ModalAddStaffProps {
  onClose: () => void;
  onSuccess: () => void;
  onEdit?: boolean;
  onEditData?: {
    staff_id: string;
    staff_name: string;
    email: string;
    role: string;
    is_active: boolean;
  } | null;
}

const roleOptions: AutocompleteOption[] = [
  { label: "Admin", value: "Admin" },
  { label: "Cashier", value: "Cashier" },
  { label: "Waiter", value: "Waiter" },
  { label: "Kitchen", value: "Kitchen" },
];

const ModalAddStaff = ({
  onClose,
  onSuccess,
  onEdit = false,
  onEditData = null,
}: ModalAddStaffProps) => {
  const [staffName, setStaffName] = useState(onEditData?.staff_name || "");
  const [email, setEmail] = useState(onEditData?.email || "");
  const [role, setRole] = useState<AutocompleteOption | null>(
    onEditData ? { label: onEditData.role, value: onEditData.role } : null
  );
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(onEditData?.is_active ?? true);
  const [loading, setLoading] = useState(false);
  const { showToast } = useLayoutContext();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const method = onEdit ? "PUT" : "POST";
      const url = onEdit
        ? `/api/staff/${onEditData?.staff_id}`
        : `/api/staff`;

      const payload = onEdit
        ? {
            staff_name: staffName,
            email,
            role: role?.value || "",
            is_active: isActive,
          }
        : {
            staff_name: staffName,
            email,
            role: role?.value || "",
            password,
            is_active: isActive,
          };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save staff data");

      showToast(
        onEdit ? "Staff updated successfully!" : "Staff added successfully!",
        "success"
      );

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <CustomTextField
        label="Full Name"
        name="staff_name"
        value={staffName}
        onChange={({ value }) => setStaffName(value)}
        placeholder="Enter staff name"
      />

      <CustomTextField
        label="Email"
        name="email"
        value={email}
        onChange={({ value }) => setEmail(value)}
        placeholder="Enter email address"
      />

      <CustomAutoComplete
        label="Role"
        value={role}
        onChange={(option) => setRole(option)}
        options={roleOptions}
        placeholder="Select a role"
      />

      {!onEdit && (
        <CustomTextField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={({ value }) => setPassword(value)}
          placeholder="Enter password"
        />
      )}

      <div className="flex justify-end gap-3 pt-4">
        <CustomButton label="Cancel" onClick={onClose} severity="danger" />
        <CustomButton
          label={loading ? "Saving..." : onEdit ? "Update" : "Save"}
          onClick={handleSubmit}
          severity="info"
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default ModalAddStaff;

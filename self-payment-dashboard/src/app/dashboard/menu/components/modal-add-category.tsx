"use client";

import { useState } from "react";
import CustomButton from "@/components/button/button";
import { useLayoutContext } from "@/utils/context/contextGlobal";
import CustomTextField from "@/components/textField/textField";

interface ModalAddCategoryProps {
  onClose: () => void;
  onSuccess: () => void;
  onEdit?: boolean;
  onEditData?: {
    category_id: string;
    name: string;
    is_active: boolean;
  } | null;
}

const ModalAddCategory = ({
  onClose,
  onSuccess,
  onEdit = false,
  onEditData = null,
}: ModalAddCategoryProps) => {
  const [name, setName] = useState(onEditData?.name || "");
  const [isActive, setIsActive] = useState(onEditData?.is_active ?? true);
  const [loading, setLoading] = useState(false);
  const { showToast } = useLayoutContext();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const method = onEdit ? "PUT" : "POST";
      const url = onEdit
        ? `/api/menu/category/${onEditData?.category_id}`
        : `/api/menu/category`;

        const payload = onEdit
      ? {
          category_id: onEditData?.category_id,
          name,
          is_active: isActive,
        }
      : {
          name,
          is_active: isActive,
        };


      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      showToast(
        onEdit
          ? "Category updated successfully!"
          : "Category added successfully!",
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
        label="Category Name"
        name="name"
        value={name}
        onChange={({ value }) => setName(value)}
        placeholder="Enter category name"
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        <span>Active</span>
      </div>

      <div className="flex justify-end gap-3">
        <CustomButton
          label="Cancel"
          onClick={onClose}
          severity="danger"
        />
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

export default ModalAddCategory;

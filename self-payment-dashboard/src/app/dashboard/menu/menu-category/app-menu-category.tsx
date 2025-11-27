"use client";

import { useEffect, useState } from "react";
import { CustomTable, TableHeader } from "@/components/table/customTable";
import ChildModalWrapper from "@/components/modal/childModalWrapper";
import ModalAddCategory from "../components/modal-add-category";
import { useLayoutContext } from "@/utils/context/contextGlobal";
import CustomButton from "@/components/button/button";
import PageHeader from "@/components/layout/pageHeader";
import PageLeftRightWrapper from "@/components/pageLeftRightWrapper/pageLeftRightWrapper";

interface MenuCategory {
  category_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  action?: any;
}

const AppMenuCategory = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [dataToEdit, setDataToEdit] = useState<MenuCategory | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const { setLoading, showConfirm, dayjs } = useLayoutContext();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/menu/category");
      const json = await res.json();
      setCategories(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error("Fetch category error:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = (cat: MenuCategory) => {
    showConfirm(
      `Yakin ingin menghapus kategori "${cat.name}"?`,
      async () => {
        try {
          const res = await fetch(`/api/menu/category/${cat.category_id}`, {
            method: "DELETE",
          });
          if (res.ok) fetchCategories();
        } catch (err) {
          console.error("Delete error:", err);
        }
      },
      () => {}
    );
  };

  const handleEdit = (cat: MenuCategory) => {
    setIsEdit(true);
    setDataToEdit(cat);
    setShowModal(true);
  };

  const handleToggleActive = async (cat: MenuCategory) => {
    try {
      await fetch(`/api/menu/category/${cat.category_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !cat.is_active }),
      });
      fetchCategories();
    } catch (error) {
      console.error("Failed to update active status:", error);
    }
  };

  const tableHeaders: TableHeader<MenuCategory>[] = [
    { value: "name", title: "Category Name", width: "220px" },
    { value: "is_active", title: "Status", width: "220px" },
    { value: "created_at", title: "Created At", width: "220px" },
    { value: "action", title: "Action", width: "220px" },
  ];

  const renderCell = (
    row: MenuCategory,
    field: keyof MenuCategory | "action"
  ) => {
    if (field === "is_active") {
      return (
        <span
          onClick={() => handleToggleActive(row)}
          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition ${
            row.is_active
              ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
              : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
          }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </span>
      );
    }

    if (field === "action") {
      return (
        <div className="flex gap-2">
          <CustomButton
            label="Edit"
            icon="pi pi-pencil"
            size="small"
            severity="warning"
            onClick={() => handleEdit(row)}
          />
          <CustomButton
            label="Delete"
            icon="pi pi-trash"
            size="small"
            severity="danger"
            onClick={() => handleDelete(row)}
          />
        </div>
      );
    }

  if (field === "created_at") {
    return dayjs(row.created_at).tz().format("DD MMM YYYY, HH:mm");
  }

    return row[field];
  };

  return (
    <div className="px-1 py-2 md:p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <PageLeftRightWrapper
        leftComponent={<PageHeader title="Menu Categories" />}
        rightComponent={
          <CustomButton
            label="Add Category"
            icon="pi pi-plus"
            severity="info"
            onClick={() => {
              setIsEdit(false);
              setDataToEdit(null);
              setShowModal(true);
            }}
          />
        }
      />

      <CustomTable
        data={categories}
        tableHeaders={tableHeaders}
        renderCell={renderCell}
        rows={10}
      />

      <ChildModalWrapper
        title={isEdit ? "Edit Category" : "Add Category"}
        open={showModal}
        onClose={() => setShowModal(false)}
      >
        <ModalAddCategory
          onClose={() => setShowModal(false)}
          onSuccess={fetchCategories}
          onEdit={isEdit}
          onEditData={dataToEdit}
        />
      </ChildModalWrapper>
    </div>
  );
};

export default AppMenuCategory;

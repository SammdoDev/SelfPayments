"use client";

import { useEffect, useState } from "react";
import { CustomTable, TableHeader } from "@/components/table/customTable";
import ChildModalWrapper from "@/components/modal/childModalWrapper";
import ModalAddMenuItem from "@/app/dashboard/menu/components/modal-add-menu";
import { useLayoutContext } from "@/utils/context/contextGlobal";
import CustomButton from "@/components/button/button";
import PageHeader from "@/components/layout/pageHeader";
import PageLeftRightWrapper from "@/components/pageLeftRightWrapper/pageLeftRightWrapper";
import TablePaginator from "@/components/table/tablePaginator";

interface MenuCategory {
  category_id: string;
  name: string;
  is_active?: boolean;
}

interface MenuItem {
  menu_id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_active: boolean;
  action?: any;
}

const AppMenuList = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);

  const { showToast, setLoading, showConfirm } = useLayoutContext();

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  useEffect(() => {
    if (!showModal) {
      fetchItems();
    }
  }, [showModal]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/menu/category");
      const data = await res.json();
      setCategories((data.data || []).filter((c: MenuCategory) => c.is_active));
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/menu/items");
      const data = await res.json();
      setItems(data.data || []);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category_id === selectedCategory);

  const handleDelete = (menu: MenuItem) => {
    showConfirm(
      `Yakin ingin menghapus menu "${menu.name}"?`,
      async () => {
        try {
          const res = await fetch(`/api/menu/items/${menu.menu_id}`, {
            method: "DELETE",
          });

          if (res.ok) {
            showToast("Berhasil menghapus data!", "success");
            fetchItems();
          } else {
            showToast("Gagal menghapus menu.", "error");
          }
        } catch (error) {
          console.error("Delete error:", error);
          showToast("Terjadi kesalahan saat menghapus.", "error");
        }
      },
      () => {
        showToast("Dibatalkan.", "info");
      }
    );
  };

  const handleEdit = (menu: MenuItem) => {
    setEditItem(menu);
    setShowModal(true);
  };

  const handlePageChange = (_event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(0);
  };

  const tableHeaders: TableHeader<MenuItem>[] = [
    { value: "image_url", title: "Preview", width: "150px" },
    { value: "name", title: "Menu Name", width: "200px" },
    { value: "description", title: "Description", width: "300px" },
    { value: "price", title: "Price", width: "120px" },
    { value: "category_id", title: "Category", width: "150px" },
    { value: "action", title: "Action", width: "180px" },
  ];

  const renderCell = (row: MenuItem, field: keyof MenuItem) => {
    if (field === "image_url") {
      if (!row.image_url) return "-";
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(row.image_url);

      if (isImage) {
        return (
          <img
            src={row.image_url}
            alt={row.name}
            className="w-16 h-16 object-cover rounded-md border border-gray-300 dark:border-gray-700 cursor-pointer hover:opacity-80 transition"
            onClick={() => {
              if (row.image_url) {
                setPreviewImage(row.image_url);
                setPreviewName(row.name);
              }
            }}
          />
        );
      } else {
        return (
          <iframe
            src={row.image_url}
            title={row.name}
            className="w-24 h-16 rounded-md border border-gray-300 dark:border-gray-700"
          />
        );
      }
    }

    if (field === "price") {
      return `Rp ${row.price.toLocaleString()}`;
    }

    if (field === "category_id") {
      const category = categories.find(
        (c) => c.category_id === row.category_id
      );
      return category ? category.name : "-";
    }

    if (field === "action") {
      return (
        <div className="flex gap-2">
          <CustomButton
            label="Edit"
            icon="pi pi-pencil"
            severity="warning"
            size="small"
            onClick={() => handleEdit(row)}
          />
          <CustomButton
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            size="small"
            onClick={() => handleDelete(row)}
          />
        </div>
      );
    }

    return row[field];
  };

  const startIndex = page * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  return (
    <div className="px-1 py-2 md:p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <PageLeftRightWrapper
        leftComponent={<PageHeader title="Menu List" />}
        rightComponent={
          <CustomButton
            label="Add Item"
            icon="pi pi-plus"
            severity="info"
            onClick={() => {
              setEditItem(null);
              setShowModal(true);
            }}
          />
        }
      />

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`flex-1 py-2 text-sm sm:text-base capitalize text-center ${
            selectedCategory === "all"
              ? "border-b-2 border-blue-500 text-blue-600 font-semibold dark:text-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.category_id}
            onClick={() => setSelectedCategory(cat.category_id)}
            className={`flex-1 py-2 text-sm sm:text-base capitalize text-center whitespace-nowrap ${
              selectedCategory === cat.category_id
                ? "border-b-2 border-blue-500 text-blue-600 font-semibold dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
          No menu items found
        </p>
      ) : (
        <div className="flex flex-col">
          <TablePaginator
            count={filteredItems.length}
            countLoading={false}
            limit={limit}
            page={page}
            pageChange={handlePageChange}
            rowsChange={handleRowsChange}
          />

          <CustomTable
            data={paginatedItems}
            tableHeaders={tableHeaders}
            renderCell={renderCell}
            rows={limit}
          />
        </div>
      )}

      <ChildModalWrapper
        title={editItem ? "Edit Menu Item" : "Add Menu Item"}
        open={showModal}
        onClose={() => setShowModal(false)}
      >
        <ModalAddMenuItem
          categories={categories}
          editItem={editItem}
          onClose={() => setShowModal(false)}
          fetchItems={fetchItems}
          fetchCategories={fetchCategories}
        />
      </ChildModalWrapper>

      <ChildModalWrapper
        title={previewName || "Menu"}
        open={!!previewImage}
        onClose={() => {
          setPreviewImage(null);
          setPreviewName(null);
        }}
      >
        {previewImage && (
          <div className="flex justify-center items-center">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[70vh] rounded-lg object-contain shadow-lg"
            />
          </div>
        )}
      </ChildModalWrapper>
    </div>
  );
};

export default AppMenuList;

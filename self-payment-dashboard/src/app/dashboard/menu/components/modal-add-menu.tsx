"use client";

import { useState, useEffect, useRef } from "react";
import CustomAutoComplete from "@/components/textField/customAutoComplete";
import CustomTextField from "@/components/textField/textField";
import CustomButton from "@/components/button/button";
import CustomFileUpload from "@/components/fileUpload/customFileUpload";
import CustomNumberField from "@/components/textField/numberField";
import CustomTextArea from "@/components/textField/customTextArea";
import { useLayoutContext } from "@/utils/context/contextGlobal";
import { supabase } from "@/utils/lib/supabaseClient";

interface Category {
  category_id: string;
  name: string;
}

interface MenuItem {
  menu_id: string;
  name: string;
  description?: string;
  price: number;
  category_id: string;
  image_url?: string;
}

interface ModalAddMenuItemProps {
  onClose: () => void;
  categories: Category[];
  editItem?: MenuItem | null;
  fetchItems?: () => void;
  fetchCategories?: () => void;
}

const ModalAddMenuItem: React.FC<ModalAddMenuItemProps> = ({
  onClose,
  categories,
  editItem,
  fetchCategories = () => {},
  fetchItems = () => {},
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image_url: "",
  });

  const { loading, setLoading } = useLayoutContext();

  useEffect(() => {
    if (editItem) {
      setNewItem({
        name: editItem.name || "",
        description: editItem.description || "",
        price: editItem.price?.toString() || "",
        category_id: editItem.category_id || "",
        image_url: editItem.image_url || "",
      });
      setPreviewUrl(editItem.image_url || null);
    }
  }, [editItem]);

  const handleInputChange = (e: { name: string; value: string }) => {
    setNewItem((prev) => ({ ...prev, [e.name]: e.value }));
  };

  const handleFileSelect = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(url);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const uploadImageToSupabase = async (file: File) => {
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const { data, error } = await supabase.storage
      .from("menu-images")
      .upload(fileName, file);

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("menu-images")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };
  const handleSave = async () => {
    setLoading(true);
    try {
      let imageUrl = newItem.image_url;

      if (selectedFile) {
        imageUrl = await uploadImageToSupabase(selectedFile);
      }

      const body = {
        ...newItem,
        price: parseFloat(newItem.price),
        image_url: imageUrl,
      };

      const res = await fetch(
        editItem ? `/api/menu/items/${editItem.menu_id}` : "/api/menu/items",
        {
          method: editItem ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (res.ok) {
        fetchItems();
        fetchCategories();
        onClose();
      } else {
        const text = await res.text();
        let errData;
        try {
          errData = text
            ? JSON.parse(text)
            : { message: text || "Unknown error" };
        } catch {
          errData = { message: text };
        }
        console.error("Failed to save menu item:", errData);
        alert("Gagal menyimpan data");
      }
    } catch (err: any) {
      console.error("Error saving item:", err.message);
      alert("Terjadi kesalahan saat menyimpan");
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat.category_id,
  }));

  return (
    <div className="flex flex-col gap-4">
      <CustomTextField
        name="name"
        label="Menu Name"
        placeholder="Enter menu name"
        value={newItem.name}
        onChange={handleInputChange}
      />

      <CustomTextArea
        name="description"
        label="Description"
        placeholder="Enter description"
        value={newItem.description}
        onChange={handleInputChange}
        rows={6}
      />

      <CustomNumberField
        name="price"
        label="Price"
        placeholder="Enter price"
        value={newItem.price}
        onChange={handleInputChange}
      />

      <CustomAutoComplete
        label="Category"
        options={categoryOptions}
        value={
          categoryOptions.find((opt) => opt.value === newItem.category_id) ||
          null
        }
        onChange={(val) =>
          setNewItem((prev) => ({ ...prev, category_id: val?.value || "" }))
        }
        placeholder="Select category"
        onFocus={() => {
          fetchCategories();
        }}
      />

      <CustomFileUpload
        label="Upload Menu Image"
        onFileSelect={handleFileSelect}
        accept="image/*"
      />

      {previewUrl && (
        <div className="flex justify-center mt-2">
          <img
            src={previewUrl}
            alt="Preview"
            className="rounded-lg w-40 h-40 object-cover shadow"
          />
        </div>
      )}

      <div className="flex justify-end mt-4 gap-3">
        <CustomButton
          label="Cancel"
          severity="secondary"
          icon="pi pi-times"
          onClick={onClose}
          className="p-button-outlined"
        />
        <CustomButton
          label={loading ? "Saving..." : editItem ? "Update" : "Save"}
          icon="pi pi-check"
          severity="success"
          onClick={handleSave}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default ModalAddMenuItem;

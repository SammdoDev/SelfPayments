"use client";

import { useEffect, useState } from "react";
import { CustomTable, TableHeader } from "@/components/table/customTable";
import { useLayoutContext } from "@/utils/context/contextGlobal";
import CustomButton from "@/components/button/button";
import PageHeader from "@/components/layout/pageHeader";
import PageLeftRightWrapper from "@/components/pageLeftRightWrapper/pageLeftRightWrapper";
import ChildModalWrapper from "@/components/modal/childModalWrapper";
import ModalAddStaff from "./components/modal-edit-add-satff";

interface Staff {
  staff_id: string;
  staff_name: string;
  role: string;
  email: string;
  is_active: boolean;
  created_at: string;
  action?: any;
}

const AppStaff = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const { setLoading, dayjs, showConfirm, showToast } = useLayoutContext();

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [dataToEdit, setDataToEdit] = useState<Staff | null>(null);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/staff");
      const json = await res.json();
      setStaffList(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error("Fetch staff error:", err);
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleToggleActive = async (staff: Staff) => {
    try {
      await fetch(`/api/staff/${staff.staff_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !staff.is_active }),
      });
      showToast("Staff updated successfully!", "success")
      fetchStaff();
    } catch (error) {
      console.error("Failed to update active status:", error);
    }
  };

  const handleDelete = (staff: Staff) => {
    showConfirm(`Yakin ingin menghapus staff "${staff.staff_name}"?`, async () => {
      try {
        const res = await fetch(`/api/staff/${staff.staff_id}`, {
          method: "DELETE",
        });
        if (res.ok)
        showToast("Success Remove Data!",
        "success"
        )  
        fetchStaff();
      } catch (err) {
        console.error("Delete staff error:", err);
      }
    });
  };

  const handleEditRow = (row: Staff) => {
    setIsEdit(true);
    setDataToEdit(row);
    setShowModal(true);
  };

  const tableHeaders: TableHeader<Staff>[] = [
    { value: "staff_name", title: "Name", width: "180px" },
    { value: "email", title: "Email", width: "200px" },
    { value: "role", title: "Role", width: "120px" },
    { value: "is_active", title: "Status", width: "120px" },
    { value: "created_at", title: "Created At", width: "180px" },
    { value: "action", title: "Action", width: "180px" },
  ];

  const renderCell = (row: Staff, field: keyof Staff | "action") => {
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
            onClick={() => handleEditRow(row)}
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
      return dayjs(row.created_at).format("DD MMM YYYY, HH:mm");
    }

    return row[field];
  };

  return (
    <div className="px-1 py-2 md:p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <PageLeftRightWrapper
        leftComponent={<PageHeader title="Staff List" />}
        rightComponent={
          <CustomButton
            label="Add Staff"
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
        data={staffList}
        tableHeaders={tableHeaders}
        renderCell={renderCell}
        rows={10}
      />

      {showModal && (
        <ChildModalWrapper
          title={isEdit ? "Edit Staff" : "Add Staff"}
          onClose={() => setShowModal(false)}
          open={showModal}
        >
          <ModalAddStaff
            onClose={() => setShowModal(false)}
            onSuccess={fetchStaff}
            onEdit={isEdit}
            onEditData={dataToEdit}
          />
        </ChildModalWrapper>
      )}
    </div>
  );
};

export default AppStaff;

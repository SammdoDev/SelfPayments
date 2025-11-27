"use client";

import { useEffect, useState } from "react";
import { CustomTable, TableHeader } from "@/components/table/customTable";
import PageHeader from "@/components/layout/pageHeader";
import PageLeftRightWrapper from "@/components/pageLeftRightWrapper/pageLeftRightWrapper";
import CustomCalendar from "@/components/textField/customCalendar";
import CustomAutoComplete, {
  AutocompleteOption,
} from "@/components/textField/customAutoComplete";
import CustomButton from "@/components/button/button";
import { useLayoutContext } from "@/utils/context/contextGlobal";
import ChildModalWrapper from "@/components/modal/childModalWrapper";
import ModalOrderDetail from "./components/modal-detail-orders";

export interface OrderItem {
  itemName: string;
  quantity: number;
  price: number;
  total: any;
}

export interface Order {
  orderId: string;
  staffName: string;
  sessionName: string;
  status: "Pending" | "Paid" | "Cancel";
  isActive: boolean;
  items: OrderItem[];
  createdAt: string;
  subtotal: string;
  action: string;
}

const AppOrders = () => {
  const { showToast, setLoading } = useLayoutContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [staffOptions, setStaffOptions] = useState<AutocompleteOption[]>([]);
  const [filterStaff, setFilterStaff] = useState<AutocompleteOption | null>(
    null
  );
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<
    "All" | "Pending" | "Paid" | "Cancel"
  >("All");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const tabs = ["All", "Pending", "Paid", "Cancel"] as const;

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/staff");
      const data = await res.json();
      const options: AutocompleteOption[] = data.data.map((s: any) => ({
        label: s.staff_name,
        value: s.staff_name,
      }));
      setStaffOptions(options);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let query = "";
      if (filterStaff)
        query += `staff=${encodeURIComponent(filterStaff.value)}&`;
      if (filterDate)
        query += `date=${filterDate.toLocaleDateString("sv-SE")}&`;

      const res = await fetch(`/api/orders?${query}`);
      const data = await res.json();
      if (!data.success)
        throw new Error(data.error || "Failed to fetch orders");
      setOrders(data.data || []);
      showToast("Success get data!", "success");
    } catch (err: any) {
      console.error("Fetch orders error:", err);
      showToast(err.message || "Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [filterStaff, filterDate]);

  const filteredOrders =
    activeTab === "All" ? orders : orders.filter((o) => o.status === activeTab);

  const tableHeaders: TableHeader<Order>[] = [
    { value: "staffName", title: "Staff", width: "150px" },
    { value: "sessionName", title: "Name", width: "200px" },
    { value: "items", title: "Items", width: "250px" },
    { value: "subtotal", title: "Subtotal", width: "150px" },
    { value: "status", title: "Status", width: "120px" },
    { value: "action", title: "Action", width: "200px" },
  ];

  const renderCell = (
    row: Order,
    field: keyof Order | "subtotal" | "action"
  ) => {
    if (field === "items") {
      return (
        <div className="text-sm">
          {row.items.map((i) => (
            <div key={i.itemName}>
              {i.itemName} × {i.quantity}
            </div>
          ))}
        </div>
      );
    }

    if (field === "subtotal") {
      const total = row.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
      return `Rp ${total.toLocaleString("id-ID")}`;
    }

    if (field === "status") {
      const color =
        row.status === "Paid"
          ? "bg-green-100 text-green-700"
          : row.status === "Pending"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700";
      return (
        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${color}`}>
          {row.status}
        </span>
      );
    }

    if (field === "action") {
      return (
        <div className="flex gap-2">
          <CustomButton
            label="View"
            icon="pi pi-eye"
            severity="info"
            size="small"
            onClick={() => setSelectedOrder(row)}
          />
        </div>
      );
    }

    return (row as any)[field];
  };

  return (
    <div className="px-1 py-2 md:p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <PageLeftRightWrapper
        leftComponent={<PageHeader title="Orders List" />}
        rightComponent={
          <CustomButton
            label="Reload"
            icon="pi pi-refresh"
            severity="info"
            onClick={fetchOrders}
          />
        }
      />

      <PageLeftRightWrapper
        leftComponent={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            <CustomCalendar
              label="Filter by Date"
              value={filterDate}
              onChange={setFilterDate}
            />
            <CustomAutoComplete
              label="Filter by Staff"
              options={staffOptions}
              value={filterStaff}
              onChange={setFilterStaff}
              onFocus={fetchStaff}
            />
          </div>
        }
        rightComponent={<div />}
      />

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm sm:text-base capitalize text-center whitespace-nowrap ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600 font-semibold dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
          No orders found
        </p>
      ) : (
        <CustomTable
          data={filteredOrders}
          tableHeaders={tableHeaders}
          renderCell={renderCell}
          rows={10}
        />
      )}

      <ChildModalWrapper
        title="Order Detail"
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      >
        <ModalOrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      </ChildModalWrapper>
    </div>
  );
};

export default AppOrders;

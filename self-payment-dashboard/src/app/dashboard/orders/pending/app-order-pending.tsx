"use client";

import { useEffect, useState } from "react";
import OrderCard from "@/components/card/orderCard";
import PageHeader from "@/components/layout/pageHeader";
import PageLeftRightWrapper from "@/components/pageLeftRightWrapper/pageLeftRightWrapper";
import { useLayoutContext } from "@/utils/context/contextGlobal";
import CustomCalendar from "@/components/textField/customCalendar";
import CustomAutoComplete, {
  AutocompleteOption,
} from "@/components/textField/customAutoComplete";

interface OrderItem {
  itemName: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: string;
  staffName: string;
  status: "Pending" | "Paid" | "Cancel";
  isActive: boolean;
  items: OrderItem[];
  createdAt: string;
}

const AppOrdersPending = () => {
  const { showToast, setLoading } = useLayoutContext();

  const [orders, setOrders] = useState<Order[]>([]);
  const [staffOptions, setStaffOptions] = useState<AutocompleteOption[]>([]);
  const [activeTab, setActiveTab] = useState<"Pending">("Pending");
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [filterStaff, setFilterStaff] = useState<AutocompleteOption | null>(
    null
  );

  const tabs = ["Pending"] as const;

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
        query += `date=${filterDate.toISOString().split("T")[0]}&`;

      const res = await fetch(`/api/orders?${query}`);
      const data = await res.json();
      if (!data.success)
        throw new Error(data.error || "Failed to fetch orders");
      setOrders(data.data || []);
      showToast("Orders loaded!", "success");
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
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
    activeTab === "Pending" ? orders : orders.filter((o) => o.status === activeTab);

  return (
    <div className="px-1 py-2 md:p-6 min-h-screen dark:bg-gray-900 dark:text-gray-100">
      <PageLeftRightWrapper
        leftComponent={<PageHeader title="Pending Orders" />}
        rightComponent={<div></div>}
      />

      <PageLeftRightWrapper
        leftComponent={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            <CustomCalendar
              label="Filter by Date"
              value={filterDate}
              onChange={(date) => setFilterDate(date)}
              className="p-fluid"
            />

            <CustomAutoComplete
              label="Filter by Staff"
              options={staffOptions}
              value={filterStaff}
              onChange={(val) => setFilterStaff(val)}
              className="p-fluid"
            />
          </div>
        }
        rightComponent={<div></div>}
      />

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm sm:text-base capitalize text-center whitespace-nowrap transition-all ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600 font-semibold dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order, idx) => (
            <OrderCard
              key={`${order.orderId}-${idx}`}
              orderId={order.orderId}
              staffName={order.staffName}
              status={order.status}
              isActive={order.isActive}
              items={order.items}
              onEdit={(id) => console.log("Edit order", id)}
              onToggleActive={(id, newStatus) =>
                console.log("Toggle active", id, newStatus)
              }
              onCheckStatus={(id) => console.log("Check status", id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">No orders found.</p>
      )}
    </div>
  );
};

export default AppOrdersPending;

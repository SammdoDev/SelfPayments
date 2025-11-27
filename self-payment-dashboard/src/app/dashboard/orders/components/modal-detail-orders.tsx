"use client";

import { CustomTable, TableHeader } from "@/components/table/customTable";
import ChildModalWrapper from "@/components/modal/childModalWrapper";
import type { Order, OrderItem } from "../app-orders";

interface ModalOrderDetailProps {
  order?: Order | null;
  onClose: () => void;
}

const ModalOrderDetail: React.FC<ModalOrderDetailProps> = ({ order, onClose }) => {
  if (!order) return null;

  const total = order.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const tableHeaders: TableHeader<OrderItem>[] = [
    { value: "itemName", title: "Item" },
    { value: "quantity", title: "Qty" },
    { value: "price", title: "Price" },
    { value: "total", title: "Total" },
  ];

  const renderCell = (row: OrderItem, field: keyof OrderItem | "total") => {
    switch (field) {
      case "quantity":
        return <div className="text-right">{row.quantity}</div>;
      case "price":
        return (
          <div className="text-right">
            Rp {row.price.toLocaleString("id-ID")}
          </div>
        );
      case "total":
        return (
          <div className="text-right font-semibold text-blue-500">
            Rp {(row.price * row.quantity).toLocaleString("id-ID")}
          </div>
        );
      default:
        return row[field as keyof OrderItem];
    }
  };

  return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <p>
            <strong>Staff:</strong> {order.staffName}
          </p>
          <p>
            <strong>Customer Name:</strong> {order.sessionName}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`font-semibold ${
                order.status === "Paid"
                  ? "text-green-600 dark:text-green-400"
                  : order.status === "Pending"
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {order.status}
            </span>
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.createdAt).toLocaleString("id-ID", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 pt-3">
          <h3 className="font-semibold text-lg mb-2">Items</h3>

          <CustomTable
            data={order.items}
            tableHeaders={tableHeaders}
            renderCell={renderCell}
            rows={5}
          />

          <div className="mt-4 text-right font-semibold text-base">
            Total:{" "}
            <span className="text-blue-500">
              Rp {total.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>
  );
};

export default ModalOrderDetail;

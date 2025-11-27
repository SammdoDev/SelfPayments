"use client";
import React from "react";
import { CheckCircle2, XCircle, Edit2 } from "lucide-react";

interface OrderItem {
  itemName: string;
  quantity: number;
  price: number;
}

interface OrderCardProps {
  orderId: string;
  staffName: string;
  status: "Pending" | "Paid" | "Cancel";
  isActive: boolean;
  items: OrderItem[];
  onEdit?: (orderId: string) => void;
  onToggleActive?: (orderId: string, newStatus: boolean) => void;
  onCheckStatus?: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  orderId,
  staffName,
  status,
  isActive,
  items = [],
  onEdit,
  onToggleActive,
  onCheckStatus,
}) => {
  const handleEdit = () => onEdit?.(orderId);
  const handleToggleActive = () => onToggleActive?.(orderId, !isActive);
  const handleCheckStatus = () => onCheckStatus?.(orderId);

  const statusColor = {
    Pending: "bg-yellow-200 text-yellow-800",
    Paid: "bg-green-200 text-green-800",
    Cancel: "bg-red-200 text-red-800",
  }[status];

  const subtotal = (items || []).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div
      className="rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700
      bg-white/70 dark:bg-gray-800/60 backdrop-blur-lg
        p-6 transition-all duration-300
        hover:shadow-2xl hover:-translate-y-1 hover:bg-white/90 dark:hover:bg-gray-800/80"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{staffName}</h3>
        <span
          className={`px-2 py-1 rounded-md text-sm font-medium ${statusColor}`}
        >
          {status}
        </span>
      </div>

      <div className="space-y-1">
        {items.map((item) => (
          <div
            key={`${item.itemName}-${item.quantity}-${item.price}`}
            className="flex justify-between"
          >
            <span>
              {item.itemName} x {item.quantity}
            </span>
            <span>
              Rp{" "}
              {new Intl.NumberFormat("id-ID").format(
                item.price * item.quantity
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="font-semibold text-right">
        Subtotal: Rp {new Intl.NumberFormat("id-ID").format(subtotal)}
      </div>

      <div className="flex justify-between items-center mt-2 gap-2">
        <button className="flex items-center gap-1" onClick={handleEdit}>
          <Edit2 size={16} /> Edit
        </button>
        <button
          className={`flex items-center gap-1 px-2 py-1 rounded-md ${
            isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
          onClick={handleToggleActive}
        >
          {isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {isActive ? "Active" : "Inactive"}
        </button>
        <button className="px-3 py-1 rounded-md" onClick={handleCheckStatus}>
          Check Status
        </button>
      </div>
    </div>
  );
};

export default OrderCard;

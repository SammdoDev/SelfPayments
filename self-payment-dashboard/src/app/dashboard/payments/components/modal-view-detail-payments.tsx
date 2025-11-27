"use client";

import { CustomTable, TableHeader } from "@/components/table/customTable";

interface ModalPaymentDetailProps {
  payment?: Payment | null;
  onClose: () => void;
}

interface Payment {
  payment_id: string;
  orders_id: string;
  amount: number;
  status: string;
  created_at: string;
  payments_method: { name: string };
  orders: {
    order_id: string;
    staff_id: string;
    staff_profiles: { staff_name: string };
  };
}

const ModalPaymentDetail: React.FC<ModalPaymentDetailProps> = ({
  payment,
  onClose,
}) => {
  if (!payment) return null;

  const tableData = [
    { field: "Staff", value: payment.orders?.staff_profiles?.staff_name },
    { field: "Method", value: payment.payments_method?.name },
    { field: "Status", value: payment.status },
    { field: "Date", value: new Date(payment.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) },
    { field: "Amount", value: `Rp ${payment.amount.toLocaleString("id-ID")}` },
  ];

  const tableHeaders: TableHeader<typeof tableData[0]>[] = [
    { value: "field", title: "Field", width: "150px" },
    { value: "value", title: "Value", width: "300px" },
  ];

  const renderCell = (row: typeof tableData[0], field: keyof typeof row) => {
    if (field === "value" && row.field === "Status") {
      return (
        <span
          className={`font-semibold ${
            row.value === "Paid"
              ? "text-green-600 dark:text-green-400"
              : row.value === "Pending"
              ? "text-yellow-600 dark:text-yellow-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {row.value}
        </span>
      );
    }
    return row[field];
  };

  return (
    <div className="space-y-4 p-4">
      <h3 className="font-semibold text-lg mb-2">Payment Detail</h3>

      <CustomTable
        data={tableData}
        tableHeaders={tableHeaders}
        renderCell={renderCell}
        rows={7}
      />
    </div>
  );
};

export default ModalPaymentDetail;

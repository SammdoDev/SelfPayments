"use client";

import { useEffect, useState } from "react";
import { CustomTable, TableHeader } from "@/components/table/customTable";
import ChildModalWrapper from "@/components/modal/childModalWrapper";
import { useLayoutContext } from "@/utils/context/contextGlobal";
import CustomButton from "@/components/button/button";
import PageHeader from "@/components/layout/pageHeader";
import PageLeftRightWrapper from "@/components/pageLeftRightWrapper/pageLeftRightWrapper";
import { formatDate, formatDateTime } from "@/utils/context/dateUtils";
import ModalPaymentDetail from "./components/modal-view-detail-payments";

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
  action: any;
}

const AppPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [previewPayment, setPreviewPayment] = useState<Payment | null>(null);
  const { showToast, setLoading } = useLayoutContext();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/payments"); // pastikan API ini sesuai
      const data = await res.json();
      if (data.success) {
        setPayments(data.data || []);
      } else {
        showToast("Gagal mengambil data pembayaran", "error");
      }
    } catch (error) {
      console.error("Fetch payments error:", error);
      showToast("Terjadi kesalahan saat mengambil data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (payment: Payment) => {
    showToast("Delete payment not implemented", "info");
  };

  const tableHeaders: TableHeader<Payment>[] = [
    { value: "payment_id", title: "Payment ID", width: "250px" },
    { value: "amount", title: "Amount", width: "120px" },
    { value: "status", title: "Status", width: "120px" },
    { value: "created_at", title: "Created At", width: "180px" },
    { value: "payments_method", title: "Method", width: "120px" },
    { value: "orders", title: "Staff", width: "180px" },
    { value: "action", title: "Action", width: "120px" },
  ];

  const renderCell = (row: Payment, field: keyof Payment) => {
    switch (field) {
      case "amount":
        return `Rp ${row.amount.toLocaleString()}`;
      case "payments_method":
        return row.payments_method?.name || "-";
      case "orders":
        return row.orders?.staff_profiles?.staff_name || "-";
      case "created_at":
        return formatDate(row.created_at).toLocaleString();
      case "action":
        return (
          <div className="flex gap-2">
            <CustomButton
              label="View"
              icon="pi pi-eye"
              severity="info"
              size="small"
              onClick={() => setPreviewPayment(row)}
            />
          </div>
        );
      default:
        return row[field];
    }
  };

  return (
    <div className="px-1 py-2 md:p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <PageLeftRightWrapper
        leftComponent={<PageHeader title="Payments" />}
        rightComponent={null}
      />

      {payments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
          No payments found
        </p>
      ) : (
        <CustomTable
          data={payments}
          tableHeaders={tableHeaders}
          renderCell={renderCell}
          rows={10}
        />
      )}

      <ChildModalWrapper
        title="Payment Detail"
        open={!!previewPayment}
        onClose={() => setPreviewPayment(null)}
      >
        {previewPayment && (
          <ModalPaymentDetail
            payment={previewPayment}
            onClose={() => setPreviewPayment(null)}
          />
        )}
      </ChildModalWrapper>
    </div>
  );
};

export default AppPayments;

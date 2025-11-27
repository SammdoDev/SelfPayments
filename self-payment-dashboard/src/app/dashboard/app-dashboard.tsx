"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CardSummary from "@/components/card/cardSummary";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Utensils,
  TrendingUp,
  Users,
  ListChecks,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import PageHeader from "@/components/layout/pageHeader";
import PageLeftRightWrapper from "@/components/pageLeftRightWrapper/pageLeftRightWrapper";
import CustomDateRange from "@/components/textField/customDateRange";
import CustomAutoComplete, {
  AutocompleteOption,
} from "@/components/textField/customAutoComplete";
import { useLayoutContext } from "@/utils/context/contextGlobal";
import dayjs, { formatDate, toISOString } from "@/utils/context/dateUtils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

interface SummaryData {
  totalOrders: number;
  totalItemsSold: number;
  totalRevenue: number;
  totalPending: number;
  totalPaid: number;
  totalServed: number;
  totalCanceled: number;
  mostOrderedMenu: {
    id: string;
    name: string;
  } | null;
}

const AppDashboard = () => {
  const [paymentMethods, setPaymentMethods] = useState<AutocompleteOption[]>(
    []
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<AutocompleteOption | null>(null);

  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [staffCount, setStaffCount] = useState<number | null>(null);
  const [menuCount, setMenuCount] = useState<number | null>(null);
  const { setLoading } = useLayoutContext();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const fetchPaymentsMethod = async () => {
    const res = await fetch("/api/payments/payments-method");
    const json = await res.json();

    const data = Array.isArray(json)
      ? json
      : json.data?.map((p: any) => ({
          label: p.name,
          value: p.payment_method_id,
        })) || [];

    setPaymentMethods(data);
  };

  const fetchDashboardData = async () => {
    if (!dateRange[0] || !dateRange[1]) return;
    setLoading(true);

    try {
      const dateFrom = dayjs(dateRange[0]).format("YYYY-MM-DD");
      const dateTo = dayjs(dateRange[1]).format("YYYY-MM-DD");
      const query = `?dateFrom=${dateFrom}&dateTo=${dateTo}${
        selectedPaymentMethod
          ? `&paymentsMethod=${selectedPaymentMethod.value}`
          : ""
      }`;

      const [staffRes, menuRes, summaryRes] = await Promise.all([
        axios.get("/api/staff/count"),
        axios.get("/api/menu/count"),
        axios.get(`/api/summary${query}`),
      ]);

      setStaffCount(staffRes.data.count);
      setMenuCount(menuRes.data.count);
      setSummary(summaryRes.data.summary);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentsMethod();
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) fetchDashboardData();
  }, [dateRange, selectedPaymentMethod]);

  const topItems = [
    {
      label: "Jumlah Staff",
      value: staffCount ?? "-",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Jumlah Menu",
      value: menuCount ?? "-",
      icon: ListChecks,
      color: "bg-indigo-100 text-indigo-600",
    },
  ];

  const insightItems = summary
    ? [
        {
          label: "Total Order",
          value: summary.totalOrders,
          icon: ClipboardList,
          color: "bg-blue-100 text-blue-600",
        },
        {
          label: "Total Items Sold",
          value: summary.totalItemsSold,
          icon: Utensils,
          color: "bg-indigo-100 text-indigo-600",
        },
        {
          label: "Total Income",
          value: `Rp ${(summary.totalRevenue ?? 0).toLocaleString("id-ID")}`,
          icon: CheckCircle2,
          color: "bg-green-100 text-green-600",
        },
        {
          label: "Best Selling Menu",
          value: summary.mostOrderedMenu?.name || "-",
          icon: TrendingUp,
          color: "bg-purple-100 text-purple-600",
        },
        {
          label: "Currently Serving",
          value: summary.totalServed,
          icon: CheckCircle2,
          color: "bg-teal-100 text-teal-600",
        },
        {
          label: "Order Cancel",
          value: summary.totalCanceled,
          icon: XCircle,
          color: "bg-red-100 text-red-600",
        },
      ]
    : [];

  const orderStatusData = {
    labels: ["Paid", "Pending", "Served", "Canceled"],
    datasets: [
      {
        label: "Total Orders",
        data: summary
          ? [
              summary.totalPaid,
              summary.totalPending,
              summary.totalServed,
              summary.totalCanceled,
            ]
          : [0, 0, 0, 0],
        backgroundColor: ["#16a34a", "#fbbf24", "#3b82f6", "#ef4444"],
      },
    ],
  };

  const orderStatusOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: `Orders Status (${
          dateRange[0] && dateRange[1]
            ? `${formatDate(dateRange[0])} - ${formatDate(dateRange[1])}`
            : "-"
        })`,
      },
    },
  };

  const revenueVsItemsData = {
    labels: ["Periode Terpilih"],
    datasets: [
      {
        label: "Total Revenue (Rp)",
        data: [summary?.totalRevenue || 0],
        borderColor: "#16a34a",
        backgroundColor: "#16a34a40",
        yAxisID: "y",
      },
      {
        label: "Total Items Sold",
        data: [summary?.totalItemsSold || 0],
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f640",
        yAxisID: "y1",
      },
    ],
  };

  const revenueVsItemsOptions = {
    responsive: true,
    interaction: { mode: "index" as const, intersect: false },
    stacked: false,
    plugins: {
      title: { display: true, text: "Revenue vs Items Sold" },
      legend: { position: "top" as const },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: { display: true, text: "Revenue (Rp)" },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Jumlah Item" },
      },
    },
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Summary" />

      <PageLeftRightWrapper
        leftComponent={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            <CustomDateRange
              label="Date Range"
              value={dateRange}
              onChange={setDateRange}
            />

            <CustomAutoComplete
              label="Payment Method"
              placeholder="Select payment method"
              options={paymentMethods}
              value={selectedPaymentMethod}
              onChange={setSelectedPaymentMethod}
              onFocus={fetchPaymentsMethod}
            />
          </div>
        }
        rightComponent={<div />}
      />

      <CardSummary items={topItems} />

      {summary && (
        <>
          <h1 className="text-lg font-semibold mt-6 mb-2">
            Insight:{" "}
            {dateRange[0] && dateRange[1]
              ? `${formatDate(dateRange[0])} - ${formatDate(dateRange[1])}`
              : "Belum ada tanggal dipilih"}
          </h1>

          <CardSummary items={insightItems} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="rounded-3xl shadow-lg border border-gray-200 dark:border-gray-900 p-6 transition-all hover:shadow-2xl hover:-translate-y-1">
              <Bar data={orderStatusData} options={orderStatusOptions} />
            </div>

            <div className="rounded-3xl shadow-lg border border-gray-200 dark:border-gray-900 p-6 transition-all hover:shadow-2xl hover:-translate-y-1">
              <Line data={revenueVsItemsData} options={revenueVsItemsOptions} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AppDashboard;

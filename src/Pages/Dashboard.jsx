import { useEffect, useMemo, useState } from "react";
import {
  AiOutlineBarChart,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import { FiArrowUpRight, FiRefreshCw, FiTrendingUp } from "react-icons/fi";
import Chart from "../components/Chart";
import Piechart from "../components/Piechart";
import Table from "../components/Table";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/admin/users/");
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  };

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:5000/orders/vieworders");
    const result = await res.json();
    setOrders(Array.isArray(result) ? result : []);
  };

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([fetchUsers(), fetchOrders()]);
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError("Dashboard data could not be loaded.");
      setUsers([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const totalOrders = useMemo(
    () => new Set(orders.map((order) => order.order_id)).size,
    [orders],
  );

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0),
    [orders],
  );

  const pendingOrders = useMemo(() => {
    const pendingStatuses = new Set(["pending", "processing"]);
    const pendingOrderIds = new Set();

    orders.forEach((order) => {
      const status = String(order.status || "").toLowerCase();
      if (pendingStatuses.has(status)) {
        pendingOrderIds.add(order.order_id);
      }
    });

    return pendingOrderIds.size;
  }, [orders]);

  const statCards = [
    {
      label: "Total Users",
      value: users.length,
      note: "Registered users",
      tone: "from-sky-500 to-blue-600",
      icon: <AiOutlineUser className="text-2xl" />,
    },
    {
      label: "Total Orders",
      value: totalOrders,
      note: "Confirmed orders",
      tone: "from-violet-500 to-fuchsia-600",
      icon: <AiOutlineShoppingCart className="text-2xl" />,
    },
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      note: "Gross sales value",
      tone: "from-emerald-500 to-green-600",
      icon: <FiTrendingUp className="text-2xl" />,
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      note: "Pending review",
      tone: "from-amber-500 to-orange-600",
      icon: <FiArrowUpRight className="text-2xl" />,
    },
  ];

  return (
    <section className="min-h-full bg-[#f4f7fb] px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="relative overflow-hidden rounded-[32px] bg-[#081b45] px-6 py-8 text-white shadow-[0_24px_80px_rgba(8,27,69,0.18)] md:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.2),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.14),transparent_22%)]" />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-[#d6def2]">
                <AiOutlineBarChart />
                Overview
              </span>
              <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                Administrative dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#d6def2] md:text-base">
                A concise overview of users, orders, revenue, and operational
                flow in one place. This layout is designed to stay balanced,
                readable, and professional.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadDashboard}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black transition hover:bg-white/15"
              >
                <FiRefreshCw />
                Refresh
              </button>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#c6d5f7]">
                  Live Revenue
                </p>
                <strong className="mt-1 block text-2xl font-black">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-[28px] bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.tone}`} />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                    {stat.label}
                  </p>
                  <strong className="mt-3 block text-3xl font-black text-[#081b45]">
                    {loading ? "..." : stat.value}
                  </strong>
                  <p className="mt-2 text-sm text-slate-500">{stat.note}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.tone} text-white shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <div className="rounded-[32px] bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.08)] md:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">
                  Revenue Trend
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#081b45]">
                  Monthly revenue overview
                </h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                Recently updated
              </span>
            </div>
            <div className="h-[340px]">
              <Chart />
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.08)] md:p-6">
            <div className="mb-5">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">
                Order Mix
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#081b45]">
                Payment and order status
              </h2>
            </div>
            <div className="h-[340px]">
              <Piechart />
            </div>
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.08)] md:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">
                Operations
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#081b45]">
                Recent orders
              </h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              {pendingOrders} pending
            </span>
          </div>
          <Table />
        </div>
      </div>
    </section>
  );
}

export default Dashboard;

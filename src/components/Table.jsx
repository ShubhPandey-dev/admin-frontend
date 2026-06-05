import React from "react";
import { FiEye, FiInfo } from "react-icons/fi";

const orders = [
  {
    id: "#10234",
    name: "John Doe",
    product: "Wireless Headphones",
    amount: "₹7,500",
    payment: { text: "Paid", color: "bg-emerald-500" },
    status: { text: "Shipped", color: "bg-emerald-500" },
  },
  {
    id: "#10233",
    name: "Alice Smith",
    product: "Smartphone X",
    amount: "₹25,000",
    payment: { text: "Pending", color: "bg-amber-400" },
    status: { text: "Processing", color: "bg-orange-500" },
  },
  {
    id: "#10232",
    name: "Michael Lee",
    product: "4K LED TV",
    amount: "₹40,000",
    payment: { text: "Failed", color: "bg-rose-500" },
    status: { text: "Cancelled", color: "bg-rose-500" },
  },
  {
    id: "#10231",
    name: "Sara Wilson",
    product: "Nike Sneakers",
    amount: "₹3,200",
    payment: { text: "Paid", color: "bg-emerald-500" },
    status: { text: "Delivered", color: "bg-green-600" },
  },
];

function Table() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">
              Orders
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#081b45]">
              Recent orders
            </h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {orders.length} rows
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">
              <th className="px-6 py-4 text-left">Order ID</th>
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4 text-left">Amount</th>
              <th className="px-6 py-4 text-left">Payment</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-slate-100 text-[14px] text-slate-700 transition last:border-b-0 hover:bg-slate-50/70"
              >
                <td className="px-6 py-5 font-black text-[#081b45]">
                  {order.id}
                </td>
                <td className="px-6 py-5">{order.name}</td>
                <td className="px-6 py-5">{order.product}</td>
                <td className="px-6 py-5 font-semibold text-slate-900">
                  {order.amount}
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-black text-white ${order.payment.color}`}
                  >
                    {order.payment.text}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-black text-white ${order.status.color}`}
                  >
                    {order.status.text}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex gap-3">
                    <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#081b45] text-white transition hover:bg-[#0d255d]">
                      <FiEye size={16} />
                    </button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200">
                      <FiInfo size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-500">
          Showing {orders.length} recent orders for quick review.
        </p>
        <div className="flex gap-2">
          <button className="h-10 w-10 rounded-full bg-[#081b45] text-sm font-black text-white">
            1
          </button>
          <button className="h-10 w-10 rounded-full border border-slate-200 text-sm font-black text-slate-600">
            2
          </button>
          <button className="h-10 w-10 rounded-full border border-slate-200 text-sm font-black text-slate-600">
            3
          </button>
        </div>
      </div>
    </div>
  );
}

export default Table;

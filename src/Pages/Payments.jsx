import React, { useEffect, useState } from "react";

// const transactions = [
//   {
//     txnId: "TXN10000",
//     orderId: "#10234",
//     customer: "Sunny",
//     amount: "₹7,500",
//     method: "Credit Card",
//     status: "Paid",
//     color: "bg-green-500",
//     date: "Jan 20, 2026",
//   },
//   {
//     txnId: "TXN10001",
//     orderId: "#10233",
//     customer: "Neeshita",
//     amount: "₹25,000",
//     method: "Credit Card",
//     status: "Pending",
//     color: "bg-yellow-500",
//     date: "Jan 21, 2026",
//   },
//   {
//     txnId: "TXN10002",
//     orderId: "#10232",
//     customer: "Abdul",
//     amount: "₹40,000",
//     method: "Credit Card",
//     status: "Failed",
//     color: "bg-red-500",
//     date: "Jan 22, 2026",
//   },
//   {
//     txnId: "TXN10003",
//     orderId: "#10231",
//     customer: "Abhshek",
//     amount: "₹3,200",
//     method: "Credit Card",
//     status: "Paid",
//     color: "bg-green-500",
//     date: "Jan 23, 2026",
//   },
// ];

function Payments() {
  const [transactions, setTransaction] = useState([]);

  const getStatusClasses = (status) => {
    const normalizedStatus = String(status || "").toLowerCase();

    if (normalizedStatus === "paid" || normalizedStatus === "success") {
      return "bg-green-100 text-green-700";
    }

    if (normalizedStatus === "pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (normalizedStatus === "failed" || normalizedStatus === "cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  const formatPaymentDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
 const downloadReport = () => {
  window.open("https://ecom-common-backend.onrender.com/admin/payment-report");
};
  async function getTransaction() {
    let result = await fetch("https://ecom-common-backend.onrender.com/admin/payment/paymentHistory");
    let res = await result.json();
    setTransaction(res);
  }

  useEffect(() => {
    getTransaction();
  }, []);
 

  return (
    <div className="px-6 py-6">
      <div className="bg-white rounded-xl shadow-sm border-[0.5px] border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">                           
            Payment Transactions
          </h2>

          <button onClick={downloadReport} className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
            Download Report
          </button>
        </div>

       
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <th className="px-6 py-4 text-left">Transaction ID</th>
                <th className="px-6 py-4 text-left">Order ID</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Method</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 last:border-none text-sm text-gray-700"
                >
                  <td className="px-6 py-5 font-medium text-gray-900">
                    {tx.transaction_id}
                  </td>
                  <td className="px-6 py-5">{tx.order_id}</td>
                  <td className="px-6 py-5">{tx.customer}</td>
                  <td className="px-6 py-5 font-medium text-gray-900">
                    {tx.amount}
                  </td>
                  <td className="px-6 py-5">{tx.method}</td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(
                        tx.status
                      )}`}
                    >
                      {tx.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">{formatPaymentDate(tx.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Payments;

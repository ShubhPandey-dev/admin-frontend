import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from 'axios';

function Orders() {
  const [orders , setOrders] = useState([]);

  async function getOrders(){
    let res =  await axios.get('https://ecom-common-backend.onrender.com/orders/vieworders');
    setOrders(res.data);
  }

  useEffect(()=>{
    getOrders();
  },[]);

  return (
    <div className="px-6 py-6">
      <div className="bg-white rounded-xl shadow-sm border-[0.5px] border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            All Orders
          </h2>

          <div className="flex items-center gap-3">
            <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <th className="px-6 py-4 text-left">Order ID</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Total</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="border-b  border-gray-200 last:border-none text-sm text-gray-700"
                >
                  <td className="px-6 py-5 font-medium text-gray-900">
                    {order.order_id}
                  </td>
                  <td className="px-6 py-5">{order.customername}</td>
                  <td className="px-6 py-5">{order.date}</td>
                  <td className="px-6 py-5">{order.total_amount}</td>

                  <td className="px-6 py-5">
                    <span>{order.status}</span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex gap-4">
                      <button className="text-blue-500 hover:underline font-medium">
                        View
                      </button>
                      <button className="text-gray-700 hover:underline font-medium">
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;

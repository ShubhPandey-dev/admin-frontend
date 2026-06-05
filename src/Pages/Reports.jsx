import React from "react";

function Reports() {
  return (
    <div className="px-6 py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Analytics & Reports
      </h2>

      <div className="space-y-4 mb-8">

        <div className="rounded-lg px-6 py-4 text-white bg-linear-to-r from-blue-500 to-blue-600">
          <p className="text-sm opacity-90">Total Sales</p>
          <p className="text-2xl font-bold">₹18.45L</p>
          <p className="text-xs opacity-80">↑ 12% from last month</p>
        </div>

        <div className="rounded-lg px-6 py-4 text-white bg-linear-to-r from-green-500 to-green-600">
          <p className="text-sm opacity-90">Avg. Order Value</p>
          <p className="text-2xl font-bold">₹5,750</p>
          <p className="text-xs opacity-80">↑ 8% from last month</p>
        </div>

        <div className="rounded-lg px-6 py-4 text-white bg-linear-to-r from-purple-500 to-purple-600">
          <p className="text-sm opacity-90">Conversion Rate</p>
          <p className="text-2xl font-bold">3.2%</p>
          <p className="text-xs opacity-80">↑ 0.5% from last month</p>
        </div>

        <div className="rounded-lg px-6 py-4 text-white bg-linear-to-r from-orange-500 to-orange-600">
          <p className="text-sm opacity-90">Customer Retention</p>
          <p className="text-2xl font-bold">68%</p>
          <p className="text-xs opacity-80">↑ 5% from last month</p>
        </div>
      </div>

   
      <div className="bg-white rounded-xl border-[0.5px] border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Selling Products
        </h3>

        <div className="space-y-3 text-sm">
          {[
            { name: "Wireless Headphones", sold: "250 sold" },
            { name: "Smartphone X", sold: "200 sold" },
            { name: "4K LED TV", sold: "150 sold" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between text-gray-700">
              <span>{item.name}</span>
              <span className="font-medium">{item.sold}</span>
            </div>
          ))}
        </div>
      </div>

     
      <div className="bg-white rounded-xl border-[0.5px] border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Revenue by Category
        </h3>

        <div className="space-y-4">
    
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Electronics</span>
              <span className="font-medium">₹500K</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-500 rounded-full w-[90%]"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Fashion</span>
              <span className="font-medium">₹400K</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-500 rounded-full w-[75%]"></div>
            </div>
          </div>

       
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Home & Kitchen</span>
              <span className="font-medium">₹300K</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-500 rounded-full w-[55%]"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Reports;

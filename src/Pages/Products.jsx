import React, { useState, useEffect } from "react";
import { BsBoxSeam } from "react-icons/bs";

function Products() {

  const [products, setProducts] = useState([]);

  async function getProducts(){
    let result = await fetch("https://ecom-common-backend.onrender.com/admin/products/viewproducts");
    let res = await result.json();
    setProducts(res);
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="px-6 py-6">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Products
        </h2>
        <p className="text-sm text-gray-500">
          Overview of all available products
        </p>
      </div>

      <div className="bg-white rounded-xl border- border-gray-200 overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-50  text-gray-600">
            <tr>
              <th className="text-left px-20 py-3">Product</th>
              <th className="text-left px-5 py-3">Category</th>
              <th className="text-left px-5 py-3">Price</th>
              <th className="text-left px-5 py-3">Stock Status</th>
              <th className="text-left px-5 py-3">Retailer_Name </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BsBoxSeam className="text-gray-400 text-lg" />
                    </div>

                    <span className="font-medium text-gray-900">
                      {product.pname}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {product.category_name}
                </td>

                <td className="px-5 py-4 font-semibold text-gray-900">
                  {product.price}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.stock > 10
                        ? "bg-green-100 text-green-600"
                        : product.stock > 0
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {product.stock > 10
                      ? "In Stock"
                      : product.stock > 0
                      ? "Low Stock"
                      : "Out of Stock"}
                  </span>
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {product.retailer_name}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Products;

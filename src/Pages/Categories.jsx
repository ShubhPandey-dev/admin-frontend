import React, { useState, useEffect } from "react";
import { FiSettings } from "react-icons/fi";
import { TbCategory } from "react-icons/tb";

function Categories() {

  const [categories, setCategories] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [cname, setCname] = useState("");
  const [selectedCommon, setSelectedCommon] = useState("");

  const [editCategory, setEditCategory] = useState({
    cid: "",
    cname: ""
  });

  // 🔥 Common categories
  const commonCategories = [
    "Electronics",
    "Fashion",
    "Home Appliances",
    "Books",
    "Sports",
    "Home & Living",
    "Groceries",
    "Furniture",
    "Footwear"
  ];

  // ✅ Fetch Categories
  async function viewCategory() {
    try {
      let result = await fetch("https://ecom-common-backend.onrender.com/admin/categories/viewcategories");
      let res = await result.json();
      setCategories(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setCategories([]);
    }
  }

  useEffect(() => {
    viewCategory();
  }, []);

  // ✅ Add Category
  async function addCategory() {

    const finalCategory = selectedCommon || cname;

    if (!finalCategory.trim()) {
      alert("Category name required");
      return;
    }

    let result = await fetch("https://ecom-common-backend.onrender.com/admin/categories/addcategory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cname: finalCategory })
    });

    let res = await result.json();

    if (res.success) {
      setShowAddModal(false);
      setCname("");
      setSelectedCommon("");
      viewCategory();
    } else {
      alert(res.message);
    }
  }

  // ✅ Open Edit Modal
  const handleEditClick = (cat) => {
    setEditCategory({
      cid: cat.cid,
      cname: cat.cname
    });
    setShowEditModal(true);
  };

  // ✅ Update Category
  async function updateCategory() {

    if (!editCategory.cname.trim()) {
      alert("Category name required");
      return;
    }

    let result = await fetch(
      `https://ecom-common-backend.onrender.com/admin/categories/updatecategory/${editCategory.cid}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cname: editCategory.cname })
      }
    );

    let res = await result.json();

    if (res.success) {
      setShowEditModal(false);
      viewCategory();
    } else {
      alert(res.message);
    }
  }

  return (
    <>
      <div className="px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm border-[0.5px] border-gray-200 p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Categories
            </h2>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
            >
              Add Category
            </button>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.cid}
                className="flex items-center justify-between p-6 rounded-xl border-[0.5px] border-gray-200 hover:shadow-sm transition"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <TbCategory className="text-2xl" />
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {cat.cname}
                    </p>
                    <p className="text-sm text-gray-500">
                      {cat.total_subcategories} SubCategories
                    </p>
                  </div>
                </div>

                {/* Settings */}
                <button
                  onClick={() => handleEditClick(cat)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiSettings className="text-xl" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ✅ Add Category Modal */}
      {showAddModal && (
        <Modal title="Add Category" onClose={() => setShowAddModal(false)}>

          <div className="space-y-4">

            <Select
              value={selectedCommon}
              onChange={(e) => {
                setSelectedCommon(e.target.value);
                setCname("");
              }}
            >
              <option value="">Select Common Category</option>
              {commonCategories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>

            <div className="text-center text-xs text-gray-400">
              OR
            </div>

            <Input
              type="text"
              placeholder="Enter custom category"
              value={cname}
              onChange={(e) => {
                setCname(e.target.value);
                setSelectedCommon("");
              }}
            />

            <button
              onClick={addCategory}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
            >
              Add Category
            </button>

          </div>

        </Modal>
      )}

      {/* ✅ Update Category Modal */}
      {showEditModal && (
        <Modal title="Update Category" onClose={() => setShowEditModal(false)}>

          <div className="space-y-4">

            <Input
              type="text"
              value={editCategory.cname}
              onChange={(e) =>
                setEditCategory({
                  ...editCategory,
                  cname: e.target.value
                })
              }
            />

            <button
              onClick={updateCategory}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
            >
              Update Category
            </button>

          </div>

        </Modal>
      )}
    </>
  );
}

export default Categories;


// ✅ Reusable Components

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl w-96 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <button onClick={onClose} className="text-gray-400">✕</button>
      </div>
      {children}
    </div>
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

const Select = (props) => (
  <select
    {...props}
    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

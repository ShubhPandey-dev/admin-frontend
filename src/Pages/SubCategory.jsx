import React, { useState, useEffect } from "react";

function SubCategory() {
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSC, setFilteredSC] = useState([]);

  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [newSC, setNewSC] = useState("");
  const [modalCategory, setModalCategory] = useState("");

  /* ✅ PAGINATION STATES */
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  /* ------------------ FETCH SUBCATEGORIES ------------------ */
  async function getSubcategories() {
    try {
      let result = await fetch(
        "http://localhost:5000/admin/subcategories/viewsubCategory",
      );
      let res = await result.json();

      const items = Array.isArray(res) ? res : [];
      setSubcategories(items);
      setFilteredSC(items);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      setSubcategories([]);
      setFilteredSC([]);
    }
  }

  /* ------------------ FETCH CATEGORIES ------------------ */
  async function getCategories() {
    try {
      let result = await fetch("http://localhost:5000/admin/categories/viewcategories");
      let res = await result.json();
      setCategories(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  }

  useEffect(() => {
    getSubcategories();
    getCategories();
  }, []);

  /* ------------------ FILTER LOGIC ------------------ */
  useEffect(() => {
    let filtered = subcategories.filter((sc) => {
      const matchSearch = String(sc.sname || "").toLowerCase().includes(search.toLowerCase());

      const matchCategory = selectedCategory
        ? sc.category === selectedCategory
        : true;

      return matchSearch && matchCategory;
    });

    setFilteredSC(filtered);
    setCurrentPage(1); // ✅ Reset page when filtering
  }, [search, selectedCategory, subcategories]);

  /* ------------------ PAGINATION CALCULATIONS ------------------ */
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredSC.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredSC.length / rowsPerPage);

  /* ------------------ TOGGLE STATUS ------------------ */
  async function toggleStatus(id) {
    try {
      const result = await fetch(
        `http://localhost:5000/admin/subcategories/toggleStatus/${id}`,
        { method: "PUT" },
      );

      const res = await result.json();

      if (res.success) {
        getSubcategories();
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  }

  /* ------------------ ADD SUBCATEGORY ------------------ */
  async function handleAddSC() {
    if (!newSC || !modalCategory) {
      alert("Please fill all fields");
      return;
    }

    try {
      const result = await fetch(
        "http://localhost:5000/admin/subcategories/addsubcategory",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sname: newSC,
            category_id: modalCategory,
          }),
        },
      );

      const res = await result.json();

      if (res.success) {
        alert("Subcategory Added");
        setShowModal(false);
        setNewSC("");
        setModalCategory("");
        getSubcategories();
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error("Add error:", err);
    }
  }

  return (
    <>
      <div className="px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Header */}
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold">Subcategories Management</h2>

            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Add Subcategory
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search subcategory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm w-64"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.cid} value={cat.cname}>
                  {cat.cname}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase border-b border-gray-100 bg-gray-50">
                <th className="py-4 px-6 text-left font-medium">SC ID</th>
                <th className="py-4 px-6 text-left font-medium">Subcategory</th>
                <th className="py-4 px-6 text-left font-medium">Category</th>
                <th className="py-4 px-6 text-left font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((sc) => (
                  <tr
                    key={sc.sid}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6 font-medium text-gray-700">
                      #{String(sc.sid).slice(-3)}
                    </td>

                    <td className="py-4 px-6 text-gray-700">{sc.sname}</td>

                    <td className="py-4 px-6 text-gray-500">
                      {sc.category}
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleStatus(sc.sid)}
                        className={`relative w-10 h-5 rounded-full transition ${
                          sc.status === "InStock"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition ${
                            sc.status === "InStock" ? "translate-x-5" : ""
                          }`}
                        />
                      </button>

                      <p className="text-xs mt-1 text-gray-500">{sc.status}</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-400">
                    No subcategories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ✅ Pagination */}
          {filteredSC.length > rowsPerPage && (
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">
                Showing {indexOfFirstRow + 1} to{" "}
                {Math.min(indexOfLastRow, filteredSC.length)} of{" "}
                {filteredSC.length} entries
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="px-3 py-1 border rounded-lg text-sm"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "border"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="px-3 py-1 border rounded-lg text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-96 p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-semibold">Add Subcategory</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <select
              value={modalCategory}
              onChange={(e) => setModalCategory(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-3"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.cid} value={cat.cid}>
                  {cat.cname}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Subcategory name"
              value={newSC}
              onChange={(e) => setNewSC(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4"
            />

            <button
              onClick={handleAddSC}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
            >
              Add Subcategory
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SubCategory;

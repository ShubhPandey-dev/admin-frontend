import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiTag,
  FiPlus,
  FiX,
  FiRefreshCw,
  FiLink,
  FiTrash2,
} from "react-icons/fi";

const API_BASE_URL = "https://ecom-common-backend.onrender.com";

const initialOfferForm = {
  name: "",
  discount_type: "percentage",
  discount_value: "",
  start_date: "",
  end_date: "",
  priority: "0",
  is_active: true,
};

const initialMappingForm = {
  offer_id: "",
  category_id: "",
  subcategory_id: "",
  brand_id: "",
};

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Offers() {
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mappingSaving, setMappingSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [offerForm, setOfferForm] = useState(initialOfferForm);
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [mappingForm, setMappingForm] = useState(initialMappingForm);
  const [deletingOffer, setDeletingOffer] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [mappingDeletingId, setMappingDeletingId] = useState(null);
  const [brands, setBrands] = useState([]);

  const activeCount = useMemo(
    () => offers.filter((offer) => Number(offer.is_active) === 1).length,
    [offers],
  );

  const totalDiscountValue = useMemo(
    () =>
      offers.reduce((sum, offer) => sum + Number(offer.discount_value || 0), 0),
    [offers],
  );

  const filteredSubcategories = useMemo(() => {
    if (!mappingForm.category_id) return subcategories;
    return subcategories.filter(
      (sub) => String(sub.category_id) === String(mappingForm.category_id),
    );
  }, [mappingForm.category_id, subcategories]);

  const loadAllData = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${API_BASE_URL}/admin/offers/dashboard`);
      const payload = res.data?.data || {};
      console.log("FULL RESPONSE:", res.data);
      console.log("BRANDS:", payload.brands);
      const offerRows = Array.isArray(payload.offers) ? payload.offers : [];
      const categoryRows = Array.isArray(payload.categories)
        ? payload.categories
        : [];
      const subcategoryRows = Array.isArray(payload.subcategories)
        ? payload.subcategories
        : [];
      const mappingRows = Array.isArray(payload.mappings)
        ? payload.mappings
        : [];
      const brandRows = Array.isArray(payload.brands) ? payload.brands : [];
      setBrands(brandRows);

      setOffers(offerRows);
      setCategories(categoryRows);
      setSubcategories(subcategoryRows);
      setMappings(mappingRows);
    } catch (err) {
      setError(
        err.response?.data?.message || "Offer data load nahi ho pa raha hai.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const openOfferModal = () => {
    setOfferForm(initialOfferForm);
    setEditingOfferId(null);
    setError("");
    setMessage("");
    setShowOfferModal(true);
  };

  const openEditModal = (offer) => {
    setOfferForm({
      name: offer.name || "",
      discount_type: offer.discount_type || "percentage",
      discount_value: String(offer.discount_value ?? ""),
      start_date: offer.start_date ? String(offer.start_date).slice(0, 10) : "",
      end_date: offer.end_date ? String(offer.end_date).slice(0, 10) : "",
      priority: String(offer.priority ?? 0),
      is_active: Number(offer.is_active) === 1,
    });
    setEditingOfferId(offer.id);
    setError("");
    setMessage("");
    setShowOfferModal(true);
  };

  const openMappingModal = () => {
    setMappingForm(initialMappingForm);
    setError("");
    setMessage("");
    setShowMappingModal(true);
  };

  const openDeleteModal = (offer) => {
    setDeletingOffer(offer);
    setError("");
    setMessage("");
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    if (saving || mappingSaving || deleteLoading) return;
    setShowOfferModal(false);
    setShowMappingModal(false);
    setShowDeleteModal(false);
    setOfferForm(initialOfferForm);
    setEditingOfferId(null);
    setMappingForm(initialMappingForm);
    setDeletingOffer(null);
  };

  const handleOfferChange = (event) => {
    const { name, value } = event.target;
    setOfferForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleMappingChange = (event) => {
    const { name, value } = event.target;

    setMappingForm((current) => ({
      ...current,
      [name]: value,

      // 👉 category change hua → subcategory reset
      ...(name === "category_id" ? { subcategory_id: "" } : {}),

      // 👉 brand select hua → category & subcategory reset
      ...(name === "brand_id" && value
        ? { category_id: "", subcategory_id: "" }
        : {}),
    }));
  };

  const createOffer = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        ...offerForm,
        discount_value: Number(offerForm.discount_value),
        priority: Number(offerForm.priority || 0),
        is_active: offerForm.is_active ? 1 : 0,
      };

      const res = editingOfferId
        ? await axios.put(
            `${API_BASE_URL}/admin/offers/${editingOfferId}`,
            payload,
          )
        : await axios.post(`${API_BASE_URL}/admin/create-offers`, payload);

      setMessage(res.data?.message || "Offer saved successfully.");
      setShowOfferModal(false);
      setOfferForm(initialOfferForm);
      setEditingOfferId(null);
      await loadAllData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Offer save nahi hua. Fields dobara check karo.",
      );
    } finally {
      setSaving(false);
    }
  };

  const createMapping = async (event) => {
    event.preventDefault();
    setMappingSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        offer_id: Number(mappingForm.offer_id),
        category_id: Number(mappingForm.category_id),
        subcategory_id: mappingForm.subcategory_id
          ? Number(mappingForm.subcategory_id)
          : null,
      };

      let res;

      if (mappingForm.brand_id) {
        res = await axios.post(`${API_BASE_URL}/admin/offer-mapping-brand`, {
          offer_id: Number(mappingForm.offer_id),
          brand_id: Number(mappingForm.brand_id),
        });
      } else {
        res = await axios.post(`${API_BASE_URL}/admin/offer-mapping-category`, {
          offer_id: Number(mappingForm.offer_id),
          category_id: Number(mappingForm.category_id),
          subcategory_id: mappingForm.subcategory_id
            ? Number(mappingForm.subcategory_id)
            : null,
        });
      }

      setMessage(res.data?.message || "Offer mapped successfully.");
      setShowMappingModal(false);
      setMappingForm(initialMappingForm);
      await loadAllData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Offer mapping nahi hua. Offer/category select karo.",
      );
    } finally {
      setMappingSaving(false);
    }
  };

  const deleteMapping = async (mappingId) => {
    if (!mappingId) return;

    const confirmed = window.confirm("Delete this offer mapping?");
    if (!confirmed) return;

    setMappingDeletingId(mappingId);
    setError("");
    setMessage("");

    try {
      await axios.delete(`${API_BASE_URL}/admin/offer-mappings/${mappingId}`);
      setMessage("Mapping deleted successfully.");
      await loadAllData();
    } catch (err) {
      setError(err.response?.data?.message || "Mapping delete nahi hua.");
    } finally {
      setMappingDeletingId(null);
    }
  };

  const toggleOffer = async (id, currentStatus) => {
    setTogglingId(id);
    setError("");
    setMessage("");

    try {
      await axios.put(`${API_BASE_URL}/admin/offers/toggle/${id}`, {
        is_active: Number(currentStatus) ? 0 : 1,
      });

      setMessage(
        `Offer ${Number(currentStatus) ? "disabled" : "enabled"} successfully.`,
      );
      await loadAllData();
    } catch (err) {
      setError(err.response?.data?.message || "Offer status update nahi hua.");
    } finally {
      setTogglingId(null);
    }
  };

  const deleteOffer = async () => {
    if (!deletingOffer?.id) return;

    const id = deletingOffer.id;
    setDeleteLoading(true);
    setError("");
    setMessage("");

    try {
      await axios.delete(`${API_BASE_URL}/admin/offers/${id}`);
      setMessage("Offer deleted successfully.");
      setShowDeleteModal(false);
      setDeletingOffer(null);
      await loadAllData();
    } catch (err) {
      setError(err.response?.data?.message || "Offer delete nahi hua.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden px-6 py-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(8,27,69,0.08),transparent_24%)]" />

      <div className="relative grid gap-6">
        <div className="flex flex-col gap-4 rounded-[28px] bg-[#081b45] p-6 text-white shadow-[0_20px_50px_rgba(8,27,69,0.24)] md:flex-row md:items-end md:justify-between md:p-8">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.32em] text-[#c6d5f7]">
              Offers
            </span>
            <h1 className="mt-2 text-4xl font-black md:text-5xl">
              Manage live discounts
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#d6def2]">
              Create offers , map them to categories or brands, and toggle them live
              without leaving the page.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadAllData}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-black transition hover:bg-white/15"
            >
              <FiRefreshCw />
              Refresh
            </button>
            <button
              type="button"
              onClick={openMappingModal}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#081b45] transition hover:bg-slate-100"
            >
              <FiLink />
              Map Offer
            </button>
            <button
              type="button"
              onClick={openOfferModal}
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-black text-[#081b45] transition hover:bg-amber-300"
            >
              <FiPlus />
              Create Offer
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] bg-white p-5 shadow-[0_12px_30px_rgba(12,28,59,0.08)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Total Offers
            </p>
            <strong className="mt-2 block text-3xl font-black text-[#081b45]">
              {offers.length}
            </strong>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-[0_12px_30px_rgba(12,28,59,0.08)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Live Offers
            </p>
            <strong className="mt-2 block text-3xl font-black text-emerald-600">
              {activeCount}
            </strong>
          </div>
          <div className="rounded-[24px] bg-white p-5 shadow-[0_12px_30px_rgba(12,28,59,0.08)]">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Offer Mappings
            </p>
            <strong className="mt-2 block text-3xl font-black text-[#081b45]">
              {mappings.length}
            </strong>
          </div>
        </div>

        {message ? (
          <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-[22px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-[28px] bg-white p-8 text-center text-slate-600 shadow-[0_16px_40px_rgba(12,28,59,0.08)]">
            Loading offers...
          </div>
        ) : (
          <div className="grid gap-5">
            {offers.length === 0 ? (
              <div className="rounded-[28px] bg-white p-8 shadow-[0_16px_40px_rgba(12,28,59,0.08)]">
                <h2 className="text-2xl font-black text-[#081b45]">
                  No offers found
                </h2>
                <p className="mt-3 text-slate-600">
                  Create your first offer to start showing discounts.
                </p>
              </div>
            ) : (
              offers.map((offer) => {
                const isActive = Number(offer.is_active) === 1;

                return (
                  <article
                    key={offer.id}
                    className="rounded-[28px] bg-white p-6 shadow-[0_16px_40px_rgba(12,28,59,0.08)] md:p-7"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#081b45]">
                          <FiTag className="text-2xl" />
                        </div>

                        <div className="grid gap-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-2xl font-black text-[#081b45]">
                              {offer.name}
                            </h3>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${
                                isActive
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {isActive ? "Live" : "Paused"}
                            </span>
                          </div>

                          <p className="text-4xl font-black text-[#2563eb]">
                            {offer.discount_type === "percentage"
                              ? `${offer.discount_value}% OFF`
                              : `₹${offer.discount_value} OFF`}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
                            <span>Start: {formatDate(offer.start_date)}</span>
                            <span>End: {formatDate(offer.end_date)}</span>
                            <span>Priority: {offer.priority ?? 0}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <label className="flex items-center gap-3">
                          <span className="text-sm font-bold text-slate-500">
                            Live
                          </span>
                          <button
                            type="button"
                            disabled={togglingId === offer.id}
                            onClick={() =>
                              toggleOffer(offer.id, offer.is_active)
                            }
                            className={`relative h-7 w-14 rounded-full transition ${
                              isActive ? "bg-emerald-500" : "bg-slate-300"
                            } ${togglingId === offer.id ? "opacity-70" : ""}`}
                          >
                            <span
                              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                                isActive ? "left-8" : "left-1"
                              }`}
                            />
                          </button>
                        </label>

                        <p className="text-xs font-medium text-slate-500">
                          {togglingId === offer.id
                            ? "Updating..."
                            : isActive
                              ? "Offer is visible to customers"
                              : "Offer is hidden from customers"}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(offer)}
                            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-black text-[#081b45] transition hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteModal(offer)}
                            className="rounded-full border border-rose-200 px-4 py-2 text-xs font-black text-rose-600 transition hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        )}

        <div className="rounded-[28px] bg-white p-6 shadow-[0_16px_40px_rgba(12,28,59,0.08)] md:p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">
                Mappings
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#081b45]">
                Offer to Category/Brand mapping
              </h2>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {mappings.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                No mappings yet. Use Map Offer to link an offer with a category
                or subcategory.
              </div>
            ) : (
              mappings.map((mapping) => (
                <div
                  key={mapping.id}
                  className="rounded-[22px] border border-slate-100 bg-[#fcfbf7] px-5 py-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <strong className="text-lg text-[#081b45]">
                        {mapping.offer_name}
                      </strong>
                      <p className="text-sm text-slate-600">
                        {mapping.type === "brand" ? (
                          <>Brand / {mapping.brand_name}</>
                        ) : (
                          <>
                            Category / {mapping.category_name}
                            {mapping.subcategory_name
                              ? ` / ${mapping.subcategory_name}`
                              : ""}
                          </>
                        )}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-slate-500">
                      {mapping.discount_type === "percentage"
                        ? `${mapping.discount_value}% OFF`
                        : `₹${mapping.discount_value} OFF`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showOfferModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[32px] bg-white shadow-[0_24px_80px_rgba(8,27,69,0.3)]">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">
                  {editingOfferId ? "Edit Offer" : "New Offer"}
                </p>
                <h2 className="mt-2 text-3xl font-black text-[#081b45]">
                  {editingOfferId
                    ? "Update discount offer"
                    : "Create discount offer"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModals}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            <form onSubmit={createOffer} className="grid gap-5 px-6 py-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-600">
                    Offer Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={offerForm.name}
                    onChange={handleOfferChange}
                    className="rounded-2xl border border-slate-200 bg-[#fffdf9] px-4 py-3 font-medium text-[#081b45] outline-none transition focus:border-blue-400"
                    placeholder="Example: Diwali Sale"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-bold text-slate-600">
                    Discount Type *
                  </label>
                  <select
                    name="discount_type"
                    value={offerForm.discount_type}
                    onChange={handleOfferChange}
                    className="rounded-2xl border border-slate-200 bg-[#fffdf9] px-4 py-3 font-medium text-[#081b45] outline-none transition focus:border-blue-400"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-bold text-slate-600">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    name="discount_value"
                    value={offerForm.discount_value}
                    onChange={handleOfferChange}
                    className="rounded-2xl border border-slate-200 bg-[#fffdf9] px-4 py-3 font-medium text-[#081b45] outline-none transition focus:border-blue-400"
                    placeholder="10"
                    min="1"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-bold text-slate-600">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={offerForm.start_date}
                    onChange={handleOfferChange}
                    className="rounded-2xl border border-slate-200 bg-[#fffdf9] px-4 py-3 font-medium text-[#081b45] outline-none transition focus:border-blue-400"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-bold text-slate-600">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={offerForm.end_date}
                    onChange={handleOfferChange}
                    className="rounded-2xl border border-slate-200 bg-[#fffdf9] px-4 py-3 font-medium text-[#081b45] outline-none transition focus:border-blue-400"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-bold text-slate-600">
                    Priority
                  </label>
                  <input
                    type="number"
                    name="priority"
                    value={offerForm.priority}
                    onChange={handleOfferChange}
                    className="rounded-2xl border border-slate-200 bg-[#fffdf9] px-4 py-3 font-medium text-[#081b45] outline-none transition focus:border-blue-400"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="grid gap-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-600">
                    Live Offer
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setOfferForm((current) => ({
                        ...current,
                        is_active: !current.is_active,
                      }))
                    }
                    className={`relative h-8 w-16 rounded-full transition ${
                      offerForm.is_active ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                        offerForm.is_active ? "left-9" : "left-1"
                      }`}
                    />
                  </button>
                  <p className="text-xs font-medium text-slate-500">
                    {offerForm.is_active
                      ? "Offer will be live immediately."
                      : "Offer will be saved as inactive."}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-[#081b45] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0c255d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingOfferId
                      ? "Update Offer"
                      : "Create Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showMappingModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[32px] bg-white shadow-[0_24px_80px_rgba(8,27,69,0.3)]">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">
                  Mapping
                </p>
                <h2 className="mt-2 text-3xl font-black text-[#081b45]">
                  Map offer to category
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModals}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            <form onSubmit={createMapping} className="grid gap-5 px-6 py-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="grid gap-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-600">
                    Offer *
                  </label>
                  <select
                    name="offer_id"
                    value={mappingForm.offer_id}
                    onChange={handleMappingChange}
                    className="rounded-2xl border border-slate-200 bg-[#fffdf9] px-4 py-3 font-medium text-[#081b45] outline-none transition focus:border-blue-400"
                    required
                  >
                    <option value="">Select offer</option>
                    {offers
                      .filter((offer) => Number(offer.is_active) === 1)
                      .map((offer) => (
                        <option key={offer.id} value={offer.id}>
                          {offer.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-600">
                    Brand (Optional)
                  </label>
                  <select
                    name="brand_id"
                    value={mappingForm.brand_id}
                    onChange={handleMappingChange}
                    className="rounded-2xl border border-slate-200 bg-[#fffdf9] px-4 py-3 font-medium text-[#081b45]"
                  >
                    <option value="">Select brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-slate-600">
                    Category *
                  </label>
                  <select
                    name="category_id"
                    disabled={!!mappingForm.brand_id}
                    required={!mappingForm.brand_id}
                    value={mappingForm.category_id}
                    onChange={handleMappingChange}
                    className="rounded-2xl border border-slate-200 bg-[#fffdf9] px-4 py-3 font-medium text-[#081b45] outline-none transition focus:border-blue-400"
                    
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.cid} value={category.cid}>
                        {category.cname}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-bold text-slate-600">
                    Subcategory
                  </label>
                  <select
                    name="subcategory_id"
                    disabled={!!mappingForm.brand_id}
                    value={mappingForm.subcategory_id}
                    onChange={handleMappingChange}
                    className="rounded-2xl border border-slate-200 bg-[#fffdf9] px-4 py-3 font-medium text-[#081b45] outline-none transition focus:border-blue-400"
                  >
                    <option value="">All subcategories</option>
                    {filteredSubcategories.map((sub) => (
                      <option key={sub.sid} value={sub.sid}>
                        {sub.sname}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={mappingSaving}
                  className="rounded-full bg-[#081b45] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0c255d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {mappingSaving ? "Saving..." : "Save Mapping"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showDeleteModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] bg-white shadow-[0_24px_80px_rgba(8,27,69,0.3)]">
            <div className="border-b border-slate-100 px-6 py-5">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-rose-500">
                Delete Offer
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#081b45]">
                Are you sure?
              </h2>
            </div>

            <div className="grid gap-4 px-6 py-6">
              <p className="text-sm leading-6 text-slate-600">
                This will permanently delete{" "}
                <strong className="font-black text-[#081b45]">
                  {deletingOffer?.name || "this offer"}
                </strong>{" "}
                and remove its mappings too. This action cannot be undone.
              </p>

              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={deleteOffer}
                  disabled={deleteLoading}
                  className="rounded-full bg-rose-600 px-5 py-3 text-sm font-black text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default Offers;

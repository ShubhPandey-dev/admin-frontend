import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { TbUsers } from "react-icons/tb";
import { BsBoxSeam } from "react-icons/bs";
import { FaTags } from "react-icons/fa";
import {
  FiShoppingCart,
  FiCreditCard,
  FiLogOut,
} from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FaFileLines } from "react-icons/fa6";
import { IoSettingsOutline, IoChevronDownOutline } from "react-icons/io5";
import { AiOutlineBarChart } from "react-icons/ai";

function Sidebar({ isOpen = false, onClose }) {
  const location = useLocation();
  const [isCategoryOpen, setIsCategoryOpen] = useState(
    location.pathname === "/categories" || location.pathname === "/subCategory",
  );

  useEffect(() => {
    if (location.pathname === "/categories" || location.pathname === "/subCategory") {
      setIsCategoryOpen(true);
    }
  }, [location.pathname]);

  const topMenu = [
    { name: "Dashboard", icon: <AiOutlineBarChart />, path: "/dashboard" },
    { name: "Users", icon: <TbUsers />, path: "/users" },
  ];

  const bottomMenu = [
    { name: "Products", icon: <BsBoxSeam />, path: "/products" },
    { name: "Orders", icon: <FiShoppingCart />, path: "/orders" },
    { name: "Payments", icon: <FiCreditCard />, path: "/payments" },
    { name: "Offers", icon: <MdOutlineLocalOffer />, path: "/offers" },
    { name: "Reports", icon: <FaFileLines />, path: "/reports" },
    { name: "Settings", icon: <IoSettingsOutline />, path: "/settings" },
    { name: "Logout", icon: <FiLogOut />, path: "/logout" },
  ];

  const navClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
      isActive
        ? "bg-white text-[#081b45] shadow-[0_10px_30px_rgba(255,255,255,0.12)] ring-1 ring-white/10"
        : "text-[#d5dff5] hover:bg-white/8 hover:text-white"
    }`;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 h-screen w-[min(86vw,300px)] shrink-0 border-r border-white/10 bg-gradient-to-b from-[#081b45] via-[#06163a] to-[#050e26] p-3 text-white shadow-[0_24px_80px_rgba(8,27,69,0.24)] transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:w-[300px] lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div className="flex items-center gap-3 border-b border-white/10 px-1 pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg">
            <AiOutlineBarChart className="text-2xl" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#a8bce8]">
              Admin Panel
            </p>
            <h1 className="text-lg font-black tracking-tight">tnpLab Pvt Ltd</h1>
          </div>
        </div>

        <div className="scrollbar-hidden mt-6 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
          <p className="px-4 text-[11px] font-black uppercase tracking-[0.28em] text-[#8ea4d1]">
            
          </p>

          {topMenu.map((item) => (
            <NavLink key={item.name} to={item.path} className={navClass} onClick={onClose}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-[15px] font-semibold">{item.name}</span>
            </NavLink>
          ))}

          <button
            type="button"
            onClick={() => setIsCategoryOpen((prev) => !prev)}
            className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
              location.pathname === "/categories" || location.pathname === "/subCategory"
                ? "bg-white text-[#081b45] shadow-[0_10px_30px_rgba(255,255,255,0.12)]"
                : "text-[#d5dff5] hover:bg-white/8 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="text-xl">
                <FaTags />
              </span>
              <span className="text-[15px] font-semibold">Categories</span>
            </span>
            <IoChevronDownOutline
              className={`transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isCategoryOpen ? (
            <div className="ml-5 flex flex-col gap-1 border-l border-white/10 pl-4">
              <NavLink
                to="/categories"
                onClick={onClose}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-sky-500 text-white shadow-md"
                      : "text-[#d5dff5] hover:bg-white/8 hover:text-white"
                  }`
                }
              >
                Category List
              </NavLink>
              <NavLink
                to="/subCategory"
                onClick={onClose}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-sky-500 text-white shadow-md"
                      : "text-[#d5dff5] hover:bg-white/8 hover:text-white"
                  }`
                }
              >
                Subcategories
              </NavLink>
            </div>
          ) : null}

          <p className="mt-2 px-4 text-[11px] font-black uppercase tracking-[0.28em] text-[#8ea4d1]">
            
          </p>

          {bottomMenu.map((item) => (
            <NavLink key={item.name} to={item.path} className={navClass} onClick={onClose}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-[15px] font-semibold">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

import React from "react";
import { FiBell, FiSearch } from "react-icons/fi";

function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="flex h-[76px] items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
          <FiSearch className="text-xl text-slate-400" />
          <input
            type="search"
            placeholder="Search dashboard, users, offers..."
            className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <FiBell className="text-xl" />
          </button>

          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-sm font-black text-white">
              A
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Signed in
              </p>
              <p className="text-sm font-semibold text-slate-700">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

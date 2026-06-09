import React, { useEffect, useState } from "react";
import { FiBell, FiMenu, FiSearch } from "react-icons/fi";

function Navbar({ onMenuClick }) {
  const [isMobileChromeHidden, setIsMobileChromeHidden] = useState(false);

  useEffect(() => {
    const scrollTarget = document.querySelector("[data-shell-scroll]") || window;
    let lastScrollY =
      scrollTarget === window ? window.scrollY : scrollTarget.scrollTop;

    function handleScroll() {
      const currentScrollY =
        scrollTarget === window ? window.scrollY : scrollTarget.scrollTop;
      const isSmallScreen = window.innerWidth < 640;

      if (!isSmallScreen || currentScrollY < 24) {
        setIsMobileChromeHidden(false);
      } else if (currentScrollY > lastScrollY + 8) {
        setIsMobileChromeHidden(true);
      } else if (currentScrollY < lastScrollY - 8) {
        setIsMobileChromeHidden(false);
      }

      lastScrollY = Math.max(currentScrollY, 0);
    }

    scrollTarget.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      scrollTarget.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="flex min-h-[64px] flex-wrap items-center justify-between gap-2 px-3 py-2 sm:min-h-[72px] sm:flex-nowrap sm:gap-3 sm:py-3 md:px-6">
        <button
          type="button"
          aria-label="Open sidebar"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition duration-200 sm:h-11 sm:w-11 lg:hidden ${
            isMobileChromeHidden
              ? "pointer-events-none -translate-y-10 opacity-0 sm:pointer-events-auto sm:translate-y-0 sm:opacity-100"
              : ""
          }`}
          onClick={onMenuClick}
        >
          <FiMenu className="text-xl" />
        </button>

        <div className="order-3 flex min-w-0 flex-1 basis-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm sm:order-none sm:basis-auto sm:gap-3 sm:rounded-full sm:px-4 sm:py-3">
          <FiSearch className="shrink-0 text-lg text-slate-400 sm:text-xl" />
          <input
            type="search"
            placeholder="Search admin"
            className="min-w-0 w-full bg-transparent text-[13px] font-medium text-slate-700 outline-none placeholder:text-slate-400 sm:text-sm"
          />
        </div>

        <div
          className={`ml-auto flex items-center gap-2 transition duration-200 sm:gap-3 ${
            isMobileChromeHidden
              ? "pointer-events-none -translate-y-10 opacity-0 sm:pointer-events-auto sm:translate-y-0 sm:opacity-100"
              : ""
          }`}
        >
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

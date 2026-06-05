import React from "react";
import { FiLogOut } from "react-icons/fi";

function Logout({ onCancel, onLogout }) {
  return (
    <div
      className="
        fixed
        top-[45%]
        left-1/2
        -translate-x-1/2
        -translate-y-1/2
        z-40
      "
    >
     
      <div
        className="
          bg-white
          w-105
          rounded-xl
          shadow-lg
          px-10
          py-8
          text-center
          border border-gray-200
        "
      >
 
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <FiLogOut className="text-red-500 text-3xl" />
          </div>
        </div>


        <h2 className="text-[22px] font-bold text-gray-900 mb-2">
          Are you sure you want to logout?
        </h2>


        <p className="text-sm text-gray-500 mb-7">
          You will be redirected to the login page
        </p>


        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="
              px-6
              py-2.5
              rounded-lg
              bg-gray-200
              text-gray-800
              font-medium
              hover:bg-gray-300
            "
          >
            Cancel
          </button>

          <button
            onClick={onLogout}
            className="
              px-6
              py-2.5
              rounded-lg
              bg-red-500
              text-white
              font-semibold
              hover:bg-red-600
            "
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logout;

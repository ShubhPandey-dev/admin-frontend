import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import AdminLogin from "./Pages/AdminLogin";   // ✅ NEW

import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/Users";
import Products from "./Pages/Products";
import Categories from "./Pages/Categories";
import SubCategory from "./Pages/SubCategory";
import Orders from "./Pages/Orders";
import Payments from "./Pages/Payments";
import Offers from "./Pages/Offers";
import Reports from "./Pages/Reports";
import Setting from "./Pages/Setting";
import Logout from "./Pages/Logout";

/* ✅ Protected Layout */
const ProtectedLayout = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7fb]">
      <Sidebar />

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0">
          <Navbar />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>

      {/* ✅ Default → Login */}
      <Route
        path="/"
        element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
      />

      {/* ✅ Login Page */}
      <Route path="/login" element={<AdminLogin />} />

      {/* ✅ Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedLayout>
            <Users />
          </ProtectedLayout>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedLayout>
            <Products />
          </ProtectedLayout>
        }
      />

      <Route
        path="/categories"
        element={
          <ProtectedLayout>
            <Categories />
          </ProtectedLayout>
        }
      />

      <Route
        path="/subCategory"
        element={
          <ProtectedLayout>
            <SubCategory />
          </ProtectedLayout>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedLayout>
            <Orders />
          </ProtectedLayout>
        }
      />

      <Route
        path="/payments"
        element={
          <ProtectedLayout>
            <Payments />
          </ProtectedLayout>
        }
      />

      <Route
        path="/offers"
        element={
          <ProtectedLayout>
            <Offers />
          </ProtectedLayout>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedLayout>
            <Reports />
          </ProtectedLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedLayout>
            <Setting />
          </ProtectedLayout>
        }
      />

      <Route
        path="/logout"
        element={
          <ProtectedLayout>
            <Logout />
          </ProtectedLayout>
        }
      />

    </Routes>
  );
}

export default App;

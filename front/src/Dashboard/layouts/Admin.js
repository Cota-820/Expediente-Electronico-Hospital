import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// components

import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import Sidebar from "../components/Sidebar/Sidebar.js";
import HeaderStats from "../components/Headers/HeaderStats.js";

// views

import Settings from "../views/Settings.js";
import Tables from "../views/Tables.js";
import NewUser from "../views/AltaUsuarios.js";

import "../assets/styles/tailwind.css";

export default function Admin() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Routes>
            <Route path="settings" element={<Settings />} />
            <Route path="tables" element={<Tables />} />
            <Route path="new-user" element={<NewUser />} />
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />
          </Routes>
        </div>
      </div>
    </>
  );
}

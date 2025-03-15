import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar stays fixed at the top */}
      <Navbar />

      {/* Main content will be placed below the Navbar */}
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

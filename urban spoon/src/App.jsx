import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import ReservationPage from "./pages/ReservationPage";
import MenuCardPage from "./pages/MenuCardPage";
import MyReservationsPage from "./pages/MyReservationsPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import CreateCouponPage from "./pages/CreateCouponPage";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingCart from "./components/FloatingCart";

export default function App() {
  const location = useLocation();
  const hideSharedFooter =
    location.pathname === "/menu" ||
    location.pathname === "/register" ||
    location.pathname === "/login" ||
    location.pathname === "/dashboard" ||
    location.pathname === "/profile" ||
    location.pathname === "/reservations" ||
    location.pathname === "/menu-card" ||
    location.pathname === "/my-reservations" ||
    location.pathname === "/my-orders" ||
    location.pathname === "/create-coupon";

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu-card" element={<MenuCardPage />} />
        <Route path="/reservations" element={<ReservationPage />} />
        <Route path="/my-reservations" element={
          <ProtectedRoute>
            <MyReservationsPage />
          </ProtectedRoute>
        } />
        <Route path="/my-orders" element={
          <ProtectedRoute>
            <MyOrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/create-coupon" element={
          <ProtectedRoute>
            <CreateCouponPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <FloatingCart />
      {!hideSharedFooter && <Footer />}
    </div>
  );
}

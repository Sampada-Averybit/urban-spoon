import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminMenuManagementPage from "./pages/AdminMenuManagementPage";
import AdminAddMenuPage from "./pages/AdminAddMenuPage";
import AdminUpdateMenuPage from "./pages/AdminUpdateMenuPage";
import AdminCouponsPage from "./pages/AdminCouponsPage";
import AdminReservationsPage from "./pages/AdminReservationsPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import ReservationPage from "./pages/ReservationPage";
import MenuCardPage from "./pages/MenuCardPage";
import MyReservationsPage from "./pages/MyReservationsPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import CreateCouponPage from "./pages/CreateCouponPage";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingCart from "./components/FloatingCart";
import { useAuth } from "./context/AuthContext";

function HomeRedirectRoute() {
  const { isLoggedIn, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[rgba(234,46,96,0.2)] border-t-[#ea2e60]"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <HomePage />;
  }

  const role = String(user?.role || "user").toLowerCase();
  return <Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace />;
}

export default function App() {
  const location = useLocation();
  const { user } = useAuth();
  const isAdminUser = String(user?.role || "").toLowerCase() === "admin";
  const isAdminPage = location.pathname.startsWith("/admin");
  const isAdminProfilePage = location.pathname === "/profile" && isAdminUser;
  const useAdminLayout = isAdminPage || isAdminProfilePage;
  const hideSharedFooter =
    location.pathname === "/menu" ||
    location.pathname === "/register" ||
    location.pathname === "/login" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/reset-password/") ||
    location.pathname === "/dashboard" ||
    location.pathname === "/profile" ||
    location.pathname === "/reservations" ||
    location.pathname === "/menu-card" ||
    location.pathname === "/my-reservations" ||
    location.pathname === "/my-orders" ||
    location.pathname === "/create-coupon" ||
    useAdminLayout;

  return (
    <div className="min-h-screen">
      {!useAdminLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<HomeRedirectRoute />} />
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
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateCouponPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/coupons" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminCouponsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/coupons/create" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateCouponPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["user"]}>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/menu" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminMenuManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/menu/add" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminAddMenuPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/menu/edit/:id" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUpdateMenuPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/reservations" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminReservationsPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminOrdersPage />
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
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!useAdminLayout && <FloatingCart />}
      {!hideSharedFooter && <Footer />}
    </div>
  );
}

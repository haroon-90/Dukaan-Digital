// src/router/AppRouter.jsx
import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute.jsx"

// Layouts
import DashboardLayout from "./layout/DashboardLayout.jsx"
import AuthLayout from "./layout/AuthLayout.jsx"

// Auth Pages
import LoginPage from "../pages/auth/LoginPage.jsx"
import RegisterPage from "../pages/auth/RegisterPage.jsx"

// Dashboard
import DashboardPage from "../pages/dashboard/DashboardPage.jsx"

// Profile
import ProfilePage from "../pages/profile/ProfilePage.jsx"
import EditProfilePage from "../pages/profile/EditProfilePage.jsx"

// Products
import ProductListPage from "../pages/products/ProductListPage.jsx"
import ProductFormPage from "../pages/products/ProductFormPage.jsx"

// Sales
import SalesListPage from "../pages/sales/SalesListPage.jsx"
import AddSalePage from "../pages/sales/AddSalePage.jsx"
import SaleDetailPage from "../pages/sales/SaleDetailPage.jsx"

// Udhaar
import UdhaarListPage from "../pages/udhaar/UdhaarListPage.jsx"
import UdhaarFormPage from "../pages/udhaar/UdhaarFormPage.jsx"

// Expenses
import ExpenseListPage from "../pages/expenses/ExpenseListPage.jsx"
import ExpenseFormPage from "../pages/expenses/ExpenseFormPage.jsx"

// Reports
import Reporthomepage from "../pages/reports/Reporthomepage.jsx"
import DailyReportPage from "../pages/reports/DailyReportPage.jsx"
import MonthlyReportPage from "../pages/reports/MonthlyReportPage.jsx"
import CustomReportPage from "../pages/reports/CustomReportPage.jsx"

export default function AppRouter() {

  return (
    <Routes>

      {/* Auth Layout Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>

          {/* Dashboard */}
          <Route path="/" element={<DashboardPage />} />

          {/* Profile */}
          <Route path="profile">
            <Route index element={<ProfilePage />} />
            <Route path="edit" element={<EditProfilePage />} />
          </Route>

          {/* Products */}
          <Route path="products">
            <Route index element={<ProductListPage />} />
            <Route path="new" element={<ProductFormPage />} />
            <Route path="edit/:id" element={<ProductFormPage />} />
          </Route>

          {/* Sales */}
          <Route path="sales">
            <Route index element={<SalesListPage />} />
            <Route path="new" element={<ProductListPage />} />
          </Route>

          {/* Udhaar */}
          <Route path="udhaar">
            <Route index element={<UdhaarListPage />} />
            <Route path="new" element={<UdhaarFormPage />} />
            <Route path="edit/:id" element={<UdhaarFormPage />} />
          </Route>

          {/* Expenses */}
          <Route path="expenses">
            <Route index element={<ExpenseListPage />} />
            <Route path="new" element={<ExpenseFormPage />} />
            <Route path="edit/:id" element={<ExpenseFormPage />} />
          </Route>

          {/* Reports */}
          <Route path="reports">
            <Route index element={<Reporthomepage />} />
            <Route path="daily" element={<DailyReportPage />} />
            <Route path="monthly" element={<MonthlyReportPage />} />
            <Route path="custom" element={<CustomReportPage />} />
          </Route>

        </Route>
      </Route>
    </Routes>
  )
}

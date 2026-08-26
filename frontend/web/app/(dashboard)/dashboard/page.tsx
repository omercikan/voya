"use client";

import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";
import EmployeeDashboard from "@/components/dashboard/employee/EmployeeDashboard";
import useAuth from "@/hooks/useAuth";
import { UserRole } from "@/types/user";

const DashboardPage = () => {
  const { user } = useAuth();

  if (user?.role === UserRole.ADMIN) {
    return <AdminDashboard />;
  }

  if (user?.role === UserRole.EMPLOYEE) {
    return <EmployeeDashboard />;
  }
};

export default DashboardPage;

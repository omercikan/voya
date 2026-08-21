"use client";

import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";
import useAuth from "@/hooks/useAuth";
import { UserRole } from "@/types/user";

const DashboardPage = () => {
  const { user } = useAuth();

  if (user?.role === UserRole.ADMIN) {
    return <AdminDashboard />;
  }
};

export default DashboardPage;

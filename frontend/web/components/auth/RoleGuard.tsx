"use client";

import useAuth from "@/hooks/useAuth";
import { UserRole } from "@/types/user";
import { redirect } from "next/navigation";

const RoleGuard = ({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return redirect("/login");
  }

  if (user?.role !== role) {
    return redirect("/dashboard");
  }

  return <div>{children}</div>;
};

export default RoleGuard;

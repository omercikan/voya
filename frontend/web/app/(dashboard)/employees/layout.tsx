import RoleGuard from "@/components/auth/RoleGuard";
import Header from "@/components/dashboard/Header";
import { UserRole } from "@/types/user";

export default function EmployeesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard role={UserRole.ADMIN}>
      <Header
        title="Çalışanlar"
        description="Şirket araçlarını talep edebilecek iç hesaplar."
      />

      {children}
    </RoleGuard>
  );
}

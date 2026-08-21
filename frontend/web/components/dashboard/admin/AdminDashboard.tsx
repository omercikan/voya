import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/types/user";
import Header from "../Header";

const AdminDashboard = () => {
  return (
    <RoleGuard role={UserRole.ADMIN}>
      <Header
        title="Yönetici Paneli"
        description="YALTES araç randevu süreçlerini, araçları ve çalışanları tek bir yerden kolayca yönetin."
      />
    </RoleGuard>
  );
};

export default AdminDashboard;

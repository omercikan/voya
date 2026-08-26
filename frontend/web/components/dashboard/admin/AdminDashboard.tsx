import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/types/user";
import Header from "../Header";
import { useGetAppointmentsQuery } from "@/store/api/appointmentApi";
import { AppointmentStatus } from "@/types/appointment";
import AppointmentTableBody from "./AppointmentTableBody";
import { useState } from "react";
import AppointmentsModalManagement from "../modal/AppointmentsModalManagement";
import Table from "@/components/ui/Table";

const AdminDashboard = () => {
  const { data: allAppointments } = useGetAppointmentsQuery();
  const filterPendingAppointments = allAppointments?.filter(
    (appointment) => appointment.status === AppointmentStatus.PENDING,
  );
  const [deleteAppointmentInfo, setDeleteAppointmentInfo] = useState({
    state: false,
    appointmentId: "",
    type: "",
  });

  return (
    <RoleGuard role={UserRole.ADMIN}>
      <Header
        title="Yönetici Paneli"
        description="YALTES araç randevu süreçlerini, araçları ve çalışanları tek bir yerden kolayca yönetin."
      />

      <Table
        title="Bekleyen Randevu Talepleri"
        theadTrClassName="grid-cols-8 gap-12"
        theads={[
          "Çalışan",
          "Araç",
          "Plaka",
          "Tarih",
          "Zaman",
          "Gidilecek Yer",
          "Durum",
          "Eylemler",
        ]}
      >
        {filterPendingAppointments?.map((appointment) => (
          <AppointmentTableBody
            key={appointment.id}
            appointment={appointment}
            setDeleteAppointmentInfo={setDeleteAppointmentInfo}
          />
        ))}
      </Table>

      <AppointmentsModalManagement
        setDeleteAppointmentInfo={setDeleteAppointmentInfo}
        deleteAppointmentInfo={deleteAppointmentInfo}
      />
    </RoleGuard>
  );
};

export default AdminDashboard;

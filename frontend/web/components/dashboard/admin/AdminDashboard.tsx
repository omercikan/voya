import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/types/user";
import Header from "../Header";
import { useGetAppointmentsQuery } from "@/store/api/appointmentApi";
import { AppointmentStatus } from "@/types/appointment";
import AppointmentTableBody from "./AppointmentTableBody";
import { useState } from "react";
import AppointmentsModalManagement from "../modal/AppointmentsModalManagement";
import Table from "@/components/ui/Table";
import EmptyState from "@/components/ui/EmptyState";
import dayjs from "dayjs";
import {
  LuClock,
  LuCalendarDays,
  LuCarFront,
  LuCalendarX,
} from "react-icons/lu";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { IconType } from "react-icons";
import { useGetVehiclesQuery } from "@/store/api/vehicleApi";
import { VehicleStatus } from "@/types/vehicle";

const InformationCardItem = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: IconType;
}) => {
  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground shadow-none">
      <div className="flex items-start justify-between gap-4 p-5">
        <div>
          <h2 className="text-xs font-bold truncate uppercase tracking-wider text-muted-foreground">
            {title}
          </h2>
          <span className="font-display mt-2 text-3xl font-bold leading-none block">
            {value}
          </span>
        </div>

        <div className="flex size-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { data: allAppointments } = useGetAppointmentsQuery();
  const { data: allVehicles } = useGetVehiclesQuery();
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

      <div className="m-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InformationCardItem
          title="Bekleyen talepler"
          value={
            allAppointments?.filter(
              (appointment) => appointment.status === AppointmentStatus.PENDING,
            ).length ?? 0
          }
          icon={LuClock}
        />

        <InformationCardItem
          title="Onaylanmış rezervasyonlar"
          value={
            allAppointments?.filter(
              (appointment) =>
                appointment.status === AppointmentStatus.CONFIRMED,
            ).length ?? 0
          }
          icon={IoCheckmarkCircleOutline}
        />

        <InformationCardItem
          title="Bugünkü rezervasyonlar"
          value={
            allAppointments?.filter((appointment) =>
              dayjs(appointment.dateStart).isSame(dayjs(), "day"),
            ).length ?? 0
          }
          icon={LuCalendarDays}
        />

        <InformationCardItem
          title="Müsait Araçlar"
          value={
            allVehicles?.filter(
              (vehicles) => vehicles.status === VehicleStatus.AVAILABLE,
            ).length ?? 0
          }
          icon={LuCarFront}
        />
      </div>

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
        {filterPendingAppointments?.length === 0 ? (
          <tr>
            <td colSpan={8}>
              <EmptyState
                icon={LuCalendarX}
                title="Bekleyen randevu talebi yok"
                description="Çalışanlar yeni bir talep oluşturduğunda burada görünecek."
              />
            </td>
          </tr>
        ) : (
          filterPendingAppointments?.map((appointment) => (
            <AppointmentTableBody
              key={appointment.id}
              appointment={appointment}
              setDeleteAppointmentInfo={setDeleteAppointmentInfo}
            />
          ))
        )}
      </Table>

      <AppointmentsModalManagement
        setDeleteAppointmentInfo={setDeleteAppointmentInfo}
        deleteAppointmentInfo={deleteAppointmentInfo}
      />
    </RoleGuard>
  );
};

export default AdminDashboard;

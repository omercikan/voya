import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/types/user";
import Header from "../Header";
import { useGetAppointmentMeQuery } from "@/store/api/appointmentApi";
import { useState } from "react";
import AppointmentsModalManagement from "../modal/AppointmentsModalManagement";
import Table from "@/components/ui/Table";
import EmptyState from "@/components/ui/EmptyState";
import AppointmentTableBody from "./appointment/AppointmentTableBody";
import useAuth from "@/hooks/useAuth";
import { LuPlus, LuClock, LuCalendarX } from "react-icons/lu";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { RiCalendarScheduleLine } from "react-icons/ri";

import { IconType } from "react-icons";
import { AppointmentStatus } from "@/types/appointment";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import CustomButton from "@/components/ui/CustomButton";
import { redirect } from "next/navigation";

dayjs.extend(isSameOrAfter);

const InformationCardItem = ({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: IconType;
}) => {
  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground shadow-none">
      <div className="flex items-start justify-between gap-4 p-5">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {title}
          </h2>
          <span className="font-display mt-2 text-3xl font-bold leading-none block">
            {value}
          </span>

          <p className="mt-2 text-xs text-muted-foreground">{description}</p>
        </div>

        <div className="flex size-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { data: appointments } = useGetAppointmentMeQuery();
  const [deleteAppointmentInfo, setDeleteAppointmentInfo] = useState({
    state: false,
    appointmentId: "",
    type: "",
  });

  return (
    <RoleGuard role={UserRole.EMPLOYEE}>
      <Header
        title={`Hoşgeldin, ${user?.fullName.split(" ").at(0)}`}
        description="İşte araç rezervasyonlarınızın güncel durumu."
      >
        <CustomButton
          className="w-max"
          handleClick={() => redirect("/appointments/new")}
        >
          <LuPlus />
          Yeni Randevu
        </CustomButton>
      </Header>

      <div className="m-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <InformationCardItem
          title="Bekleyen talepler"
          value={
            appointments?.filter(
              (appointment) => appointment.status === AppointmentStatus.PENDING,
            ).length ?? 0
          }
          description="Yönetici onayı bekleniyor"
          icon={LuClock}
        />

        <InformationCardItem
          title="Onaylanmış rezervasyonlar"
          value={
            appointments?.filter(
              (appointment) =>
                appointment.status === AppointmentStatus.CONFIRMED,
            ).length ?? 0
          }
          description="Yönetici tarafından onaylandı"
          icon={IoCheckmarkCircleOutline}
        />

        <InformationCardItem
          title="Yaklaşan rezervasyonlar"
          value={
            appointments?.filter(
              (appointment) =>
                appointment.status === AppointmentStatus.CONFIRMED &&
                dayjs(appointment.dateStart).isSameOrAfter(dayjs(), "day"),
            ).length ?? 0
          }
          description="Onaylanan ve tarihi geçmemiş randevular"
          icon={RiCalendarScheduleLine}
        />
      </div>

      <Table
        title="Son Rezervasyonlarınız"
        theadTrClassName="grid-cols-7 gap-12"
        theads={[
          "Araç",
          "Tarih",
          "Saat",
          "Gidelecek Yer",
          "Durum",
          "İptal Sebebi",
          "Eylemler",
        ]}
      >
        {appointments?.length === 0 ? (
          <tr>
            <td colSpan={7}>
              <EmptyState
                icon={LuCalendarX}
                title="Henüz randevunuz yok"
                description="Yeni bir randevu oluşturarak başlayabilirsiniz."
                actionText="Yeni Randevu"
                onAction={() => redirect("/appointments/new")}
              />
            </td>
          </tr>
        ) : (
          appointments?.map((appointment) => (
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

export default EmployeeDashboard;

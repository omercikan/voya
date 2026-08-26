"use client";

import AppointmentTableBodyAdmin from "@/components/dashboard/admin/AppointmentTableBody";
import AppointmentTableBodyEmployee from "@/components/dashboard/employee/appointment/AppointmentTableBody";
import Header from "@/components/dashboard/Header";
import AppointmentsModalManagement from "@/components/dashboard/modal/AppointmentsModalManagement";
import Table from "@/components/ui/Table";
import useAuth from "@/hooks/useAuth";
import {
  useGetAppointmentMeQuery,
  useGetAppointmentsQuery,
} from "@/store/api/appointmentApi";
import { UserRole } from "@/types/user";
import { useState } from "react";

const tableTheadsEmployee = [
  "Araç",
  "Tarih",
  "Saat",
  "Gidelecek Yer",
  "Durum",
  "Eylemler",
];

const tableTheadsAdmin = [
  "Çalışan",
  "Araç",
  "Plaka",
  "Tarih",
  "Zaman",
  "Gidilecek Yer",
  "Durum",
  "Eylemler",
];

export default function AppointmentsPage() {
  const { user } = useAuth();
  const { data: appointments } = useGetAppointmentMeQuery();
  const { data: allAppointments } = useGetAppointmentsQuery();
  const [deleteAppointmentInfo, setDeleteAppointmentInfo] = useState({
    state: false,
    appointmentId: "",
    type: "",
  });

  return (
    <>
      <Header
        title={
          user?.role === UserRole.EMPLOYEE
            ? "Randevularım"
            : "Randevuları Yönetin"
        }
        description={
          user?.role === UserRole.EMPLOYEE
            ? "Oluşturduğunuz tüm randevu talepleri."
            : "Çalışanların taleplerini inceleyin ve araç kullanımına ilişkin karar verin."
        }
      />

      <Table
        theadTrClassName={`${user?.role === UserRole.EMPLOYEE ? "grid-cols-6" : "grid-cols-8"} gap-12`}
        theads={
          user?.role === UserRole.EMPLOYEE
            ? tableTheadsEmployee
            : tableTheadsAdmin
        }
      >
        {user?.role === UserRole.EMPLOYEE &&
          appointments?.map((appointment) => (
            <AppointmentTableBodyEmployee
              key={appointment.id}
              appointment={appointment}
              setDeleteAppointmentInfo={setDeleteAppointmentInfo}
            />
          ))}

        {user?.role === UserRole.ADMIN &&
          allAppointments?.map((appointment) => (
            <AppointmentTableBodyAdmin
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
    </>
  );
}

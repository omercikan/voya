"use client";

import AppointmentTableBodyAdmin from "@/components/dashboard/admin/AppointmentTableBody";
import AppointmentTableBodyEmployee from "@/components/dashboard/employee/appointment/AppointmentTableBody";
import Header from "@/components/dashboard/Header";
import AppointmentsModalManagement from "@/components/dashboard/modal/AppointmentsModalManagement";
import Table from "@/components/ui/Table";
import EmptyState from "@/components/ui/EmptyState";
import useAuth from "@/hooks/useAuth";
import {
  useGetAppointmentMeQuery,
  useGetAppointmentsQuery,
} from "@/store/api/appointmentApi";
import { UserRole } from "@/types/user";
import { useState } from "react";
import { LuCalendarX } from "react-icons/lu";
import { redirect } from "next/navigation";

const tableTheadsEmployee = [
  "Araç",
  "Tarih",
  "Saat",
  "Gidelecek Yer",
  "Durum",
  "İptal Sebebi",
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

  const isEmployee = user?.role === UserRole.EMPLOYEE;
  const isEmpty = isEmployee
    ? (appointments?.length ?? 0) === 0
    : (allAppointments?.length ?? 0) === 0;

  return (
    <>
      <Header
        title={isEmployee ? "Randevularım" : "Randevuları Yönetin"}
        description={
          isEmployee
            ? "Oluşturduğunuz tüm randevu talepleri."
            : "Çalışanların taleplerini inceleyin ve araç kullanımına ilişkin karar verin."
        }
      />

      <Table
        theadTrClassName={`${isEmployee ? "grid-cols-7" : "grid-cols-8"} gap-12`}
        theads={isEmployee ? tableTheadsEmployee : tableTheadsAdmin}
      >
        {isEmpty ? (
          <tr>
            <td colSpan={isEmployee ? 7 : 8}>
              <EmptyState
                icon={LuCalendarX}
                title={
                  isEmployee
                    ? "Henüz randevunuz yok"
                    : "Bekleyen randevu bulunmuyor"
                }
                description={
                  isEmployee
                    ? "Yeni bir randevu oluşturarak başlayabilirsiniz."
                    : "Çalışanlar randevu talebi oluşturduğunda burada listelenecek."
                }
                actionText={isEmployee ? "Yeni Randevu" : undefined}
                onAction={
                  isEmployee ? () => redirect("/appointments/new") : undefined
                }
              />
            </td>
          </tr>
        ) : (
          <>
            {isEmployee &&
              appointments?.map((appointment) => (
                <AppointmentTableBodyEmployee
                  key={appointment.id}
                  appointment={appointment}
                  setDeleteAppointmentInfo={setDeleteAppointmentInfo}
                />
              ))}

            {!isEmployee &&
              allAppointments?.map((appointment) => (
                <AppointmentTableBodyAdmin
                  key={appointment.id}
                  appointment={appointment}
                  setDeleteAppointmentInfo={setDeleteAppointmentInfo}
                />
              ))}
          </>
        )}
      </Table>

      <AppointmentsModalManagement
        setDeleteAppointmentInfo={setDeleteAppointmentInfo}
        deleteAppointmentInfo={deleteAppointmentInfo}
      />
    </>
  );
}

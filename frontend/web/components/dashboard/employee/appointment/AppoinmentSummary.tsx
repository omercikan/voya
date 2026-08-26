import useAuth from "@/hooks/useAuth";
import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import AppointmentActions from "./AppointmentActions";

const SummaryItem = ({
  title,
  value,
}: {
  title: string;
  value: string | undefined;
}) => {
  return (
    <div className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{title}</span>
      <span className="text-sm font-semibold">{value} </span>
    </div>
  );
};

const AppoinmentSummary = () => {
  const { user } = useAuth();
  const { appointment, vehicle } = useSelector(
    (state: RootState) => state.appointmentSlice,
  );

  return (
    <>
      <div className="flex flex-col space-y-1.5 pb-6">
        <h3 className="font-semibold tracking-tight text-base flex items-center gap-2">
          Randevu özeti
        </h3>
      </div>

      <div>
        <SummaryItem title="Çalışan" value={user?.fullName} />
        <SummaryItem title="Departman" value={user?.department} />
        <SummaryItem title="Araç Markası" value={vehicle.brand} />
        <SummaryItem title="Araç Modeli" value={vehicle.model} />
        <SummaryItem title="Plaka" value={vehicle.plate} />

        {appointment.dateStart !== appointment.dateEnd && (
          <>
            <SummaryItem
              title="Başlangıç Tarihi"
              value={appointment.dateStart}
            />

            <SummaryItem title="Bitiş Tarihi" value={appointment.dateEnd} />
          </>
        )}

        {appointment.dateStart === appointment.dateEnd && (
          <SummaryItem title="Tarih" value={appointment.dateStart} />
        )}

        <SummaryItem title="Gidilecek Yer" value={appointment.purpose} />

        {appointment.note && (
          <SummaryItem title="Note" value={appointment.note} />
        )}
      </div>

      <AppointmentActions isError={false} />
    </>
  );
};

export default AppoinmentSummary;

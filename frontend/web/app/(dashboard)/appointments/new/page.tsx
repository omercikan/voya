"use client";

import AppointmentSelectDate from "@/components/dashboard/employee/appointment/AppointmentSelectDate";
import AppointmentSelectTime from "@/components/dashboard/employee/appointment/AppointmentSelectTime";
import AppointmentStep from "@/components/dashboard/employee/appointment/AppointmentStep";
import { RootState } from "@/store/store";
import { Activity } from "react";
import { useSelector } from "react-redux";

const NewAppointmentPage = () => {
  const { step } = useSelector((state: RootState) => state.appointmentSlice);

  return (
    <>
      <AppointmentStep />

      <div className="rounded-xl border border-border bg-card text-card-foreground shadow-none p-6">
        {
          <Activity mode={step === 1 ? "visible" : "hidden"}>
            <AppointmentSelectDate />
          </Activity>
        }
        {step === 2 && <AppointmentSelectTime />}
      </div>
    </>
  );
};

export default NewAppointmentPage;

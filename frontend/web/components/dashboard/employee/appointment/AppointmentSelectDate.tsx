"use client";

import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import DateProvider from "@/components/ui/DateProvider";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setAppointment } from "@/store/slices/appointmentSlice";
import { PickerValue } from "@mui/x-date-pickers/internals";
import AppointmentActions from "./AppointmentActions";

const mockData = {
  range: { from: "2026-08-01", to: "2026-08-31" },
  totalVehicles: 5,
  days: [
    {
      date: "2026-08-01",
      status: "available",
      minFreeVehicles: 5,
      hourly: [
        { time: "08:00-09:00", free: 5 },
        { time: "09:00-10:00", free: 5 },
        { time: "10:00-11:00", free: 5 },
        { time: "11:00-12:00", free: 5 },
        { time: "13:00-14:00", free: 5 },
        { time: "14:00-15:00", free: 5 },
        { time: "15:00-16:00", free: 5 },
        { time: "16:00-17:00", free: 5 },
      ],
    },
    {
      date: "2026-08-25",
      status: "available",
      minFreeVehicles: 3,
      hourly: [
        { time: "08:00-09:00", free: 4 },
        { time: "09:00-10:00", free: 3 },
        { time: "10:00-11:00", free: 5 },
        { time: "11:00-12:00", free: 4 },
        { time: "13:00-14:00", free: 4 },
        { time: "14:00-15:00", free: 4 },
        { time: "15:00-16:00", free: 4 },
        { time: "16:00-17:00", free: 4 },
      ],
    },
    {
      date: "2026-08-26",
      status: "full",
      minFreeVehicles: 0,
      hourly: [
        { time: "08:00-09:00", free: 0 },
        { time: "09:00-10:00", free: 0 },
        { time: "10:00-11:00", free: 0 },
        { time: "11:00-12:00", free: 0 },
        { time: "13:00-14:00", free: 0 },
        { time: "14:00-15:00", free: 0 },
        { time: "15:00-16:00", free: 0 },
        { time: "16:00-17:00", free: 0 },
      ],
    },
    {
      date: "2026-08-27",
      status: "limited",
      minFreeVehicles: 0,
      hourly: [
        { time: "08:00-09:00", free: 1 },
        { time: "09:00-10:00", free: 1 },
        { time: "10:00-11:00", free: 0 },
        { time: "11:00-12:00", free: 1 },
        { time: "13:00-14:00", free: 2 },
        { time: "14:00-15:00", free: 1 },
        { time: "15:00-16:00", free: 1 },
        { time: "16:00-17:00", free: 1 },
      ],
    },
    {
      date: "2026-08-28",
      status: "available",
      minFreeVehicles: 5,
      hourly: [
        { time: "08:00-09:00", free: 5 },
        { time: "09:00-10:00", free: 5 },
        { time: "10:00-11:00", free: 5 },
        { time: "11:00-12:00", free: 5 },
        { time: "13:00-14:00", free: 5 },
        { time: "14:00-15:00", free: 5 },
        { time: "15:00-16:00", free: 5 },
        { time: "16:00-17:00", free: 5 },
      ],
    },
    {
      date: "2026-08-29",
      status: "full",
      minFreeVehicles: 0,
      hourly: [
        { time: "08:00-09:00", free: 0 },
        { time: "09:00-10:00", free: 0 },
        { time: "10:00-11:00", free: 0 },
        { time: "11:00-12:00", free: 0 },
        { time: "13:00-14:00", free: 0 },
        { time: "14:00-15:00", free: 0 },
        { time: "15:00-16:00", free: 0 },
        { time: "16:00-17:00", free: 0 },
      ],
    },
    {
      date: "2026-08-31",
      status: "available",
      minFreeVehicles: 5,
      hourly: [
        { time: "08:00-09:00", free: 5 },
        { time: "09:00-10:00", free: 5 },
        { time: "10:00-11:00", free: 5 },
        { time: "11:00-12:00", free: 5 },
        { time: "13:00-14:00", free: 5 },
        { time: "14:00-15:00", free: 5 },
        { time: "15:00-16:00", free: 5 },
        { time: "16:00-17:00", free: 5 },
      ],
    },
  ],
};

const AppointmentSelectDate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointment } = useSelector(
    (state: RootState) => state.appointmentSlice,
  );
  const [selectedStartDate, setSelectedStartDate] = useState<Dayjs | null>(
    null,
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Dayjs | null>(null);

  const handleSelectDate = (value: PickerValue, at: "start" | "end") => {
    const format = value?.format("YYYY-MM-DD");

    dispatch(
      setAppointment(
        at === "start" ? { dateStart: format } : { dateEnd: format },
      ),
    );

    return at === "start"
      ? setSelectedStartDate(value)
      : setSelectedEndDate(value);
  };

  return (
    <>
      <div className="flex flex-col space-y-1.5 pb-6">
        <h3 className="font-bold tracking-tight text-base">
          Randevu tarihini seçin
        </h3>
      </div>

      <div className="pt-0">
        <div className="flex justify-center gap-4">
          <DateProvider>
            <div>
              <label className="font-semibold mb-1.5 block">
                Başlangıç Tarihi
              </label>

              <DateCalendar
                className="bg-background rounded-md border border-border mx-0!"
                value={selectedStartDate}
                onChange={(newValue) => handleSelectDate(newValue, "start")}
                shouldDisableDate={(date) =>
                  mockData.days.find(
                    (day) => day.date === date.format("YYYY-MM-DD"),
                  )?.status === "full"
                }
                disablePast
              />
            </div>
          </DateProvider>

          <DateProvider>
            <div>
              <label className="font-semibold mb-1.5 block">Bitiş Tarihi</label>

              <DateCalendar
                className="bg-background rounded-md border border-border mx-0!"
                value={selectedEndDate}
                onChange={(newValue) => handleSelectDate(newValue, "end")}
                shouldDisableDate={(date) =>
                  date.isBefore(dayjs(selectedStartDate).startOf("day")) ||
                  mockData.days.find(
                    (day) => day.date === date.format("YYYY-MM-DD"),
                  )?.status === "full" ||
                  selectedStartDate === null
                }
                disablePast
              />
            </div>
          </DateProvider>
        </div>

        <AppointmentActions
          isError={appointment.dateStart === "" || appointment.dateEnd === ""}
        />
      </div>
    </>
  );
};

export default AppointmentSelectDate;

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
                  date.isBefore(dayjs(selectedStartDate).startOf("day"))
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

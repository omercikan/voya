import { AppDispatch, RootState } from "@/store/store";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import AppointmentActions from "./AppointmentActions";
import Table from "@/components/ui/Table";
import { slots } from "@/constants/hourSlots";
import CustomButton from "@/components/ui/CustomButton";
import { setAppointment } from "@/store/slices/appointmentSlice";
import { useEffect } from "react";

const AppointmentSelectTime = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointment } = useSelector(
    (state: RootState) => state.appointmentSlice,
  );
  const isSameDate = appointment.dateStart === appointment.dateEnd;

  const handleSelectStartTime = (time: string) => {
    if (isSameDate) {
      if (!appointment.hourStart) {
        dispatch(setAppointment({ hourStart: time }));
      } else if (!appointment.hourEnd) {
        dispatch(setAppointment({ hourEnd: time }));
      } else if (appointment.hourStart && appointment.hourEnd) {
        dispatch(setAppointment({ hourEnd: time }));
      }

      return;
    }

    dispatch(setAppointment({ hourStart: time }));
  };

  const handleSelectEndTime = (time: string) => {
    dispatch(setAppointment({ hourEnd: time }));
  };

  useEffect(() => {
    if (isSameDate) return;

    if (appointment.hourStart > appointment.hourEnd) {
      dispatch(setAppointment({ hourEnd: appointment.hourStart }));
    }
  }, [isSameDate, appointment.hourEnd, appointment.hourStart, dispatch]);

  return (
    <>
      <div className="flex flex-col space-y-1.5 pb-6">
        <h3 className="font-semibold tracking-tight text-base flex items-center gap-2">
          Müsait zaman aralıkları ·{" "}
          {dayjs(appointment.dateStart).locale("tr").format("DD MMMM YYYY")}{" "}
          <span className="text-xs">→</span>{" "}
          {dayjs(appointment.dateEnd).locale("tr").format("DD MMMM YYYY")}
        </h3>
      </div>

      <div>
        <Table
          theadTrClassName={isSameDate ? "grid-cols-1" : "grid-cols-2"}
          theads={[
            `${appointment.dateStart.toUpperCase()} · BAŞLANGIÇ ${isSameDate ? "- BİTİŞ" : ""}`,
            isSameDate ? "" : `${appointment.dateEnd.toUpperCase()} · BİTİŞ`,
          ]}
        >
          {isSameDate
            ? slots.map((slot, index) => (
                <tr
                  key={index}
                  className="grid grid-cols-1 not-last:border-b border-border"
                >
                  <td className="px-2 py-1.5">
                    <CustomButton
                      text={slot}
                      className={`bg-card! justify-start shadow-none border border-border text-foreground! hover:bg-accent! hover:text-accent-foreground! font-bold! px-3! py-1.5! text-xs! ${isSameDate && appointment.hourStart > slot ? "bg-gray-400! text-white! pointer-events-none!" : ""} ${
                        appointment.hourStart === `${slot}` ||
                        appointment.hourEnd === `${slot}`
                          ? "bg-primary! hover:bg-primary! hover:text-primary-foreground! border-primary! text-primary-foreground!"
                          : ""
                      }`}
                      handleClick={() => handleSelectStartTime(`${slot}`)}
                    />
                  </td>
                </tr>
              ))
            : slots.map((time, index) => (
                <tr
                  key={index}
                  className="grid grid-cols-2 not-last:border-b border-border"
                >
                  <td className="px-2 py-1.5">
                    <CustomButton
                      text={time}
                      className={`bg-card! justify-start shadow-none border border-border text-foreground! hover:bg-accent! hover:text-accent-foreground! font-bold! px-3! py-1.5! text-xs! ${
                        appointment.hourStart === time
                          ? "bg-primary! hover:bg-primary! hover:text-primary-foreground! border-primary! text-primary-foreground!"
                          : ""
                      }`}
                      handleClick={() => handleSelectStartTime(time)}
                    />
                  </td>

                  <td className="px-2 py-1.5">
                    <CustomButton
                      text={time}
                      className={`bg-card! justify-start shadow-none border border-border text-foreground! hover:bg-accent! hover:text-accent-foreground! font-bold! px-3! py-1.5! text-xs! ${appointment.hourStart > time ? "bg-gray-400! text-white! pointer-events-none!" : ""} ${
                        appointment.hourEnd === time
                          ? "bg-primary! hover:bg-primary! hover:text-primary-foreground! border-primary! text-primary-foreground!"
                          : ""
                      }`}
                      handleClick={() => handleSelectEndTime(time)}
                    />
                  </td>
                </tr>
              ))}
        </Table>

        <AppointmentActions
          isError={appointment.hourStart === "" || appointment.hourEnd === ""}
        />
      </div>
    </>
  );
};

export default AppointmentSelectTime;

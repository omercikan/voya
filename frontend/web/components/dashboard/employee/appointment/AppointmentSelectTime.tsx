import { AppDispatch, RootState } from "@/store/store";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import AppointmentActions from "./AppointmentActions";
import Table from "@/components/ui/Table";
import { hourSlots } from "@/constants/hourSlots";
import CustomButton from "@/components/ui/CustomButton";
import { setAppointment } from "@/store/slices/appointmentSlice";

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

  console.log(appointment);

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
            `${appointment.dateStart.toUpperCase()} · BAŞLANGIÇ`,
            isSameDate ? "" : `${appointment.dateEnd.toUpperCase()} · BİTİŞ`,
          ]}
        >
          {hourSlots.map((slot, index) => (
            <tr
              key={index}
              className={`grid ${isSameDate ? "grid-cols-1" : "grid-cols-2"} not-last:border-b border-border`}
            >
              <td className="px-2 py-1.5">
                <CustomButton
                  text={isSameDate ? `${slot.start} - ${slot.end}` : slot.start}
                  className={`bg-card! justify-start shadow-none border border-border text-foreground! hover:bg-accent! hover:text-accent-foreground! font-bold! px-3! py-1.5! text-xs! ${
                    isSameDate
                      ? appointment.hourStart ===
                          `${slot.start} - ${slot.end}` ||
                        appointment.hourEnd === `${slot.start} - ${slot.end}`
                        ? "bg-primary! hover:bg-primary! hover:text-primary-foreground! border-primary! text-primary-foreground!"
                        : ""
                      : appointment.hourStart === slot.start
                        ? "bg-primary! hover:bg-primary! hover:text-primary-foreground! border-primary! text-primary-foreground!"
                        : ""
                  } ${isSameDate ? (appointment.hourStart.length > 0 && appointment.hourEnd === `${slot.start} - ${slot.end}` ? "bg-primary! hover:bg-primary! hover:text-primary-foreground! border-primary! text-primary-foreground!" : "") : ""}`}
                  handleClick={() =>
                    handleSelectStartTime(
                      isSameDate ? `${slot.start} - ${slot.end}` : slot.start,
                    )
                  }
                />
              </td>

              {!isSameDate && (
                <td className="px-2 py-1.5">
                  <CustomButton
                    text={slot.end}
                    className={`bg-card! justify-start shadow-none border border-border text-foreground! hover:bg-accent! hover:text-accent-foreground! font-bold! px-3! py-1.5! text-xs! ${
                      appointment.hourEnd === slot.end
                        ? "bg-primary! hover:bg-primary! hover:text-primary-foreground! border-primary! text-primary-foreground!"
                        : ""
                    }`}
                    handleClick={() => handleSelectEndTime(slot.end)}
                  />
                </td>
              )}
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

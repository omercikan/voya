import CustomButton from "@/components/ui/CustomButton";
import { appointmentStatusMap } from "@/constants/appointmentStatusMap";
import useAuth from "@/hooks/useAuth";
import { AppointmentResponse, AppointmentStatus } from "@/types/appointment";
import { UserRole } from "@/types/user";
import { SetStateAction } from "react";

const TableData = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => {
  return (
    <td
      className={`py-2 align-middle truncate font-medium self-center ${className}`}
    >
      {text}
    </td>
  );
};

const AppointmentTableBody = ({
  appointment,
  setDeleteAppointmentInfo,
}: {
  appointment: AppointmentResponse;
  setDeleteAppointmentInfo: (
    value: SetStateAction<{
      state: boolean;
      appointmentId: string;
      type: string;
    }>,
  ) => void;
}) => {
  const { user } = useAuth();

  return (
    <tr
      key={appointment.id}
      className={`grid ${user?.role === UserRole.EMPLOYEE ? "grid-cols-6" : "grid-cols-8"} gap-12 px-6 py-1 not-last:border-b border-b-border transition-colors hover:bg-muted/50`}
    >
      <TableData text={appointment.customer.fullName} />

      {appointment.vehicle ? (
        <TableData
          text={appointment.vehicle.brand + " " + appointment.vehicle.model}
        />
      ) : (
        <TableData text={"-"} />
      )}

      {appointment.vehicle ? (
        <TableData text={appointment.vehicle.plate} />
      ) : (
        <TableData text={"-"} />
      )}

      <td className="py-2 align-middle truncate self-center font-medium">
        <span className="block">{appointment.dateStart}</span>
        <span className="block">{appointment.dateEnd}</span>
      </td>

      <TableData text={`${appointment.hourStart} - ${appointment.hourEnd}`} />

      <TableData text={appointment.purpose} />

      <TableData
        text={
          appointmentStatusMap[appointment.status]?.label || appointment.status
        }
        className={
          appointmentStatusMap[appointment.status]?.className +
          " px-2 text-[11px] font-semibold self-center rounded-md w-max"
        }
      />

      <td className="self-center">
        <div className="flex justify-end gap-2">
          <CustomButton
            text="Onayla"
            className={`w-max h-8! shadow-sm! text-xs font-semibold ${appointment.status === AppointmentStatus.CONFIRMED ? "opacity-50! bg-gray-400! pointer-events-none!" : ""}`}
            handleClick={() =>
              setDeleteAppointmentInfo({
                state: true,
                appointmentId: appointment.id,
                type: "ADMIN_APPROVE",
              })
            }
          />

          <CustomButton
            text="Reddet"
            className="bg-background! border border-input hover:bg-accent! hover:text-accent-foreground! text-foreground! w-max h-8! shadow-sm! text-xs font-semibold"
            handleClick={() =>
              setDeleteAppointmentInfo({
                state: true,
                appointmentId: appointment.id,
                type: "ADMIN_CANCEL",
              })
            }
          />
        </div>
      </td>
    </tr>
  );
};

export default AppointmentTableBody;

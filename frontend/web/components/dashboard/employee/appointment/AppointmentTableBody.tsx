import CustomButton from "@/components/ui/CustomButton";
import { appointmentStatusMap } from "@/constants/appointmentStatusMap";
import useAuth from "@/hooks/useAuth";
import { AppointmentResponse, AppointmentStatus } from "@/types/appointment";
import { UserRole } from "@/types/user";
import { SetStateAction } from "react";

import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import dayjs from "dayjs";
import { usePathname, useRouter } from "next/navigation";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);


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
  const router = useRouter();
  const pathname = usePathname();
  const canComplete =
    appointment.status === AppointmentStatus.CONFIRMED &&
    dayjs().isSameOrAfter(dayjs(appointment.dateStart), "day") &&
    dayjs().isSameOrBefore(dayjs(appointment.dateEnd), "day");

  return (
    <tr
      key={appointment.id}
      className={`grid ${user?.role === UserRole.EMPLOYEE ? "grid-cols-7" : "grid-cols-9"} gap-12 px-6 py-1 not-last:border-b border-b-border transition-colors hover:bg-muted/50`}
    >
      {appointment?.vehicle ? (
        <td className="py-2 align-middle truncate font-bold w-max self-center">
          {appointment.vehicle.brand} {appointment.vehicle.model}
          <span className="block text-xs text-muted-foreground">
            {appointment.vehicle.plate}
          </span>
        </td>
      ) : (
        <TableData text="—" className="py-0!" />
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

      <TableData
        text={appointment.rejectNote ? appointment.rejectNote : "-"}
        className={`text-xs ${appointment.rejectNote ? "text-destructive" : ""}`}
      />

      <td className="self-center">
        <div className="flex flex-wrap gap-3">
          <CustomButton
            text="İptal Et"
            className="bg-background! border border-input hover:bg-accent! hover:text-accent-foreground! text-foreground! w-max h-8! shadow-sm! text-xs font-semibold flex-1"
            handleClick={() =>
              setDeleteAppointmentInfo({
                state: true,
                appointmentId: appointment.id,
                type: "EMPLOYEE_CANCEL",
              })
            }
          />

          <CustomButton
            text="Randevuyu Bitir"
            className={`bg-background! border border-input hover:bg-accent! hover:text-accent-foreground! text-foreground! w-max h-8! shadow-sm! text-xs font-semibold flex-1 ${!canComplete ? "opacity-50! bg-gray-400! text-white! pointer-events-none!" : ""}`}
            handleClick={() => {
              router.replace(
                `${pathname.startsWith("/appointments") ? "/appointments" : ""}?long=${appointment.vehicle.id}&vehicle=${appointment.vehicle.brand} ${appointment.vehicle.model}&plate=${appointment.vehicle.plate}&dateEnd=${appointment.dateEnd}&hourEnd=${appointment.hourEnd}`,
              );
              setDeleteAppointmentInfo({
                state: true,
                appointmentId: appointment.id,
                type: "EMPLOYEE_COMPLETE",
              });
            }}
          />
        </div>
      </td>
    </tr>
  );
};

export default AppointmentTableBody;

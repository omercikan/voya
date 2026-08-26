import { SetStateAction, useState } from "react";
import CancelAppointment from "./CancelAppointment";
import useAppointmentAction from "@/hooks/useAppointmentAction";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setAppointment } from "@/store/slices/appointmentSlice";
import CustomInput from "@/components/ui/CustomInput";
import { useSearchParams } from "next/navigation";

import dayjs from "dayjs";
import "dayjs/locale/tr";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const AppointmentsModalManagement = ({
  deleteAppointmentInfo,
  setDeleteAppointmentInfo,
}: {
  deleteAppointmentInfo: {
    state: boolean;
    appointmentId: string;
    type: string;
  };
  setDeleteAppointmentInfo: (
    value: SetStateAction<{
      state: boolean;
      appointmentId: string;
      type: string;
    }>,
  ) => void;
}) => {
  const { appointment } = useSelector(
    (state: RootState) => state.appointmentSlice,
  );
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const [locationNote, setLocationNote] = useState("");
  const [kmNote, setKmNote] = useState(0);

  const {
    employeeDeleteAppointment: { handleDelete, isLoadingDeleteAppointment },
    adminApproveAppointment: {
      handleUpdateAppointmentStatus,
      isLoadingUpdateStatusAppointment,
    },
    adminRejectAppointment: {
      handleAppointmentReject,
      isLoadingRejectAppointment,
    },
    employeeCompleteAppointment: {
      handleUpdateVehicleKmAndLocation,
      isLoadingVehicleKmAndLocation,
    },
  } = useAppointmentAction(setDeleteAppointmentInfo);

  if (!deleteAppointmentInfo.state) return null;

  return (
    <>
      {deleteAppointmentInfo.type === "EMPLOYEE_CANCEL" && (
        <CancelAppointment
          title="Bu randevu talebini iptal etmek ister misiniz?"
          description="Araç ve zaman aralığı diğer çalışanların kullanımına açılacaktır."
          closeModalText="Vazgeç"
          actionButtonText="Randevuyu İptal Et"
          closeModelClick={() =>
            setDeleteAppointmentInfo({
              state: false,
              appointmentId: "",
              type: "",
            })
          }
          actionButtonClick={() =>
            handleDelete(deleteAppointmentInfo.appointmentId)
          }
          isSubmitting={isLoadingDeleteAppointment}
        />
      )}

      {deleteAppointmentInfo.type === "ADMIN_APPROVE" && (
        <CancelAppointment
          title="Bu randevuyu onaylayacak mısınız?"
          description="Çalışan, talep edilen zaman aralığı boyunca aracı kullanabilecektir.."
          closeModalText="Vazgeç"
          actionButtonText="Randevuyu Onayla"
          closeModelClick={() =>
            setDeleteAppointmentInfo({
              state: false,
              appointmentId: "",
              type: "",
            })
          }
          actionButtonClick={() =>
            handleUpdateAppointmentStatus(deleteAppointmentInfo.appointmentId)
          }
          isSubmitting={isLoadingUpdateStatusAppointment}
        />
      )}

      {deleteAppointmentInfo.type === "ADMIN_CANCEL" && (
        <CancelAppointment
          title="Randevu talebini reddet?"
          description="Çalışanın görebileceği isteğe bağlı bir neden ekleyebilirsiniz."
          closeModalText="Vazgeç"
          actionButtonText="Randevuyu Reddet"
          actionButtonClass="bg-destructive! text-destructive-foreground! hover:bg-destructive/90!"
          closeModelClick={() =>
            setDeleteAppointmentInfo({
              state: false,
              appointmentId: "",
              type: "",
            })
          }
          actionButtonClick={() =>
            handleAppointmentReject(
              deleteAppointmentInfo.appointmentId,
              appointment.rejectNote,
            )
          }
          isSubmitting={isLoadingRejectAppointment}
        >
          <div className="space-y-2">
            <label
              htmlFor="reject"
              className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Reddedilme nedeni (isteğe bağlı)
            </label>

            <textarea
              rows={3}
              onChange={(e) =>
                dispatch(setAppointment({ rejectNote: e.target.value }))
              }
              className="flex min-h-15 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Başka bir görev için araca ihtiyaç var."
            />
          </div>
        </CancelAppointment>
      )}

      {deleteAppointmentInfo.type === "EMPLOYEE_COMPLETE" && (
        <CancelAppointment
          title="Rezervasyonu Tamamla"
          description={`${searchParams.get("vehicle")} ${searchParams.get("plate")} — ${dayjs(searchParams.get("dateEnd")).locale("tr").format("DD MMMM YYYY")} ${dayjs(searchParams.get("hourEnd"), "HH:mm:ss").format("HH:mm")}`}
          closeModalText="Vazgeç"
          actionButtonText="Randevuyu Tamamla"
          actionButtonClass=""
          closeModelClick={() =>
            setDeleteAppointmentInfo({
              state: false,
              appointmentId: "",
              type: "",
            })
          }
          actionButtonClick={() =>
            handleUpdateVehicleKmAndLocation(
              deleteAppointmentInfo.appointmentId,
              Number(searchParams.get("long")),
              kmNote,
              locationNote,
            )
          }
          isSubmitting={isLoadingVehicleKmAndLocation}
        >
          <CustomInput
            value={locationNote}
            onChange={(e) => setLocationNote(e.target.value)}
            label="Aracı nereye bıraktınız?"
            placeholder="Örneğin: A otoparkı, -1. kat"
          />

          <CustomInput
            type="number"
            min={0}
            value={kmNote}
            onChange={(e) => setKmNote(Number(e.target.value))}
            label="KM kaçta bıraktınız?"
            placeholder="Örneğin: 100.000"
          />
        </CancelAppointment>
      )}
    </>
  );
};

export default AppointmentsModalManagement;

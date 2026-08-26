import { SetStateAction } from "react";
import CancelAppointment from "./CancelAppointment";
import useAppointmentAction from "@/hooks/useAppointmentAction";

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
  const {
    employeeDeleteAppointment: { handleDelete, isLoadingDeleteAppointment },
    adminApproveAppointment: {
      handleUpdateAppointmentStatus,
      isLoadingUpdateStatusAppointment,
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
            handleUpdateAppointmentStatus(deleteAppointmentInfo.appointmentId)
          }
          isSubmitting={isLoadingUpdateStatusAppointment}
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
              className="flex min-h-15 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Başka bir görev için araca ihtiyaç var."
            />
          </div>
        </CancelAppointment>
      )}
    </>
  );
};

export default AppointmentsModalManagement;

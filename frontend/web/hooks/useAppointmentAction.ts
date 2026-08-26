import {
  useDeleteAppointmentMutation,
  useUpdateAppointmentStatusMutation,
} from "@/store/api/appointmentApi";
import { getErrorMessage } from "@/utils/error";
import { SetStateAction } from "react";
import toast from "react-hot-toast";

const useAppointmentAction = (
  setDeleteAppointmentInfo: (
    value: SetStateAction<{
      state: boolean;
      appointmentId: string;
      type: string;
    }>,
  ) => void,
) => {
  const [deleteAppointment, { isLoading: isLoadingDeleteAppointment }] =
    useDeleteAppointmentMutation();

  const [
    updateAppointmentStatus,
    { isLoading: isLoadingUpdateStatusAppointment },
  ] = useUpdateAppointmentStatusMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteAppointment(id).unwrap();
      setDeleteAppointmentInfo({ state: false, appointmentId: "", type: "" });
      toast.success("Randevu başarıyla silindi!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleUpdateAppointmentStatus = async (id: string) => {
    try {
      await updateAppointmentStatus(id).unwrap();
      setDeleteAppointmentInfo({ state: false, appointmentId: "", type: "" });
      toast.success("Randevu başarıyla onaylandı!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return {
    employeeDeleteAppointment: {
      handleDelete,
      isLoadingDeleteAppointment,
    },
    adminApproveAppointment: {
      handleUpdateAppointmentStatus,
      isLoadingUpdateStatusAppointment,
    },
  };
};

export default useAppointmentAction;

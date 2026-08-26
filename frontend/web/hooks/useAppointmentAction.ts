import {
  useDeleteAppointmentMutation,
  useRejectAppointmentMutation,
  useUpdateAppointmentStatusMutation,
} from "@/store/api/appointmentApi";
import { useUpdateVehicleKmAndLocationMutation } from "@/store/api/vehicleApi";
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

  const [rejectAppointment, { isLoading: isLoadingRejectAppointment }] =
    useRejectAppointmentMutation();

  const [
    updateVehicleKmAndLocation,
    { isLoading: isLoadingVehicleKmAndLocation },
  ] = useUpdateVehicleKmAndLocationMutation();

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

  const handleAppointmentReject = async (
    appointmentId: string,
    rejectNote: string,
  ) => {
    try {
      await rejectAppointment({ appointmentId, rejectNote }).unwrap();
      setDeleteAppointmentInfo({ state: false, appointmentId: "", type: "" });
      toast.success("Randevu başarıyla reddeldi!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleUpdateVehicleKmAndLocation = async (
    appointmentId: string,
    vehicleId: number,
    km: number,
    location: string,
  ) => {
    try {
      await updateVehicleKmAndLocation({
        vehicleId,
        km,
        location,
      }).unwrap();
      setDeleteAppointmentInfo({ state: false, appointmentId: "", type: "" });
      handleDelete(appointmentId);
      toast.success("Randevu başarıyla tamamlandı!");
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
    adminRejectAppointment: {
      handleAppointmentReject,
      isLoadingRejectAppointment,
    },
    employeeCompleteAppointment: {
      handleUpdateVehicleKmAndLocation,
      isLoadingVehicleKmAndLocation,
    },
  };
};

export default useAppointmentAction;

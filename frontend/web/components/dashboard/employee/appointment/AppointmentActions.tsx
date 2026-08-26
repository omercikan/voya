import CustomButton from "@/components/ui/CustomButton";
import useAuth from "@/hooks/useAuth";
import { useCreateAppointmentMutation } from "@/store/api/appointmentApi";
import { clearAppointment, setStep } from "@/store/slices/appointmentSlice";
import { AppDispatch, RootState } from "@/store/store";
import { getErrorMessage } from "@/utils/error";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

interface AppointmentActionsProps {
  isError: boolean;
}

const AppointmentActions = ({ isError }: AppointmentActionsProps) => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { step, appointment } = useSelector(
    (state: RootState) => state.appointmentSlice,
  );
  const [createAppointment] = useCreateAppointmentMutation();
  const router = useRouter();

  const handleCreateAppointment = async () => {
    if (!user) return;

    try {
      const response = await createAppointment({
        ...appointment,
        customerId: user.id,
      }).unwrap();

      if (response) {
        toast.success("Randevu talebiniz başarıyla gönderildi.");
        dispatch(clearAppointment());
        router.replace("/appointments");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-5">
      <CustomButton
        text="Geri"
        className={`w-max border border-border hover:bg-accent! hover:text-accent-foreground! ${step === 1 ? "pointer-events-none bg-background! text-muted-foreground!" : "bg-background! text-muted-foreground!"}`}
        handleClick={() => dispatch(setStep("PREV"))}
      />

      <CustomButton
        text={step === 5 ? "Randevu Talebini Gönder" : "Devam"}
        className={`w-max ${isError ? "pointer-events-none! cursor-not-allowed! opacity-50!" : ""}`}
        handleClick={() =>
          step === 5 ? handleCreateAppointment() : dispatch(setStep("NEXT"))
        }
      />
    </div>
  );
};

export default AppointmentActions;

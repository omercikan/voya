import CustomButton from "@/components/ui/CustomButton";
import { setStep } from "@/store/slices/appointmentSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

interface AppointmentActionsProps {
  isError: boolean;
}

const AppointmentActions = ({ isError }: AppointmentActionsProps) => {
  const { step } = useSelector((state: RootState) => state.appointmentSlice);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-5">
      <CustomButton
        text="Geri"
        className={`w-max border border-border hover:bg-accent! hover:text-accent-foreground! ${step === 1 ? "pointer-events-none bg-background! text-muted-foreground!" : "bg-background! text-muted-foreground!"}`}
        handleClick={() => dispatch(setStep("PREV"))}
      />

      <CustomButton
        text="Devam"
        className={`w-max ${isError ? "pointer-events-none! cursor-not-allowed! opacity-50!" : ""}`}
        handleClick={() => dispatch(setStep("NEXT"))}
      />
    </div>
  );
};

export default AppointmentActions;

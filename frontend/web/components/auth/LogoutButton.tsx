import CustomButton from "@/components/ui/CustomButton";
import useAuth from "@/hooks/useAuth";
import { useLogoutMutation } from "@/store/api/authApi";
import { baseApi } from "@/store/api/baseApi";
import { resetAppointment } from "@/store/slices/appointmentSlice";
import { resetLink } from "@/store/slices/linkSlice";
import { AppDispatch } from "@/store/store";
import { getErrorMessage } from "@/utils/error";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuLogOut } from "react-icons/lu";
import { useDispatch } from "react-redux";

const LogoutButton = () => {
  const [logout] = useLogoutMutation();
  const router = useRouter();
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(baseApi.util.resetApiState());
      router.replace("/login");
      dispatch(resetAppointment());
      dispatch(resetLink());
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="border-t border-sidebar-border p-4">
      <strong className="text-sm font-semibold text-sidebar-foreground">
        {user?.fullName}
      </strong>

      <p className="text-[11px] text-sidebar-foreground/60">
        {user?.department} · {user?.role}
      </p>

      <CustomButton
        className="bg-transparent justify-start px-2! py-1.5! h-auto mt-3 text-sidebar-foreground/70 font-bold! text-xs hover:bg-sidebar-accent hover:text-sidebar-accent-foreground!"
        handleClick={handleLogout}
      >
        <LuLogOut />
        Çıkış Yap
      </CustomButton>
    </div>
  );
};

export default LogoutButton;

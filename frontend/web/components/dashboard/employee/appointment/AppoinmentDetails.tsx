import CustomInput from "@/components/ui/CustomInput";
import { setAppointment } from "@/store/slices/appointmentSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import AppointmentActions from "./AppointmentActions";
import useAuth from "@/hooks/useAuth";

const AppoinmentDetails = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { appointment } = useSelector(
    (state: RootState) => state.appointmentSlice,
  );

  return (
    <>
      <div className="flex flex-col space-y-1.5 pb-6">
        <h3 className="font-bold tracking-tight text-base">
          Seyahat bilgileri
        </h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <CustomInput
            label="Gidilecek yer"
            placeholder="Seyahat başlangıç noktasını giriniz"
            onChange={(e) =>
              dispatch(setAppointment({ purpose: e.target.value }))
            }
          />

          <div>
            <label
              htmlFor="description"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Not / İş Tanımı
            </label>

            <textarea
              rows={4}
              className="flex min-h-15 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Örn: Müşteri tesisine ziyaret"
              onChange={(e) =>
                dispatch(setAppointment({ note: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="rounded-md border border-border bg-muted/40 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Talep eden
          </h3>

          <strong className="mt-2 font-bold block">{user?.fullName}</strong>
          <p className="text-sm text-muted-foreground">{user?.department}</p>

          <p className="mt-4 text-xs text-muted-foreground">
            Kişisel bilgileriniz kurumsal hesabınızdan otomatik olarak
            alınmaktadır.
          </p>
        </div>
      </div>

      <AppointmentActions isError={appointment.purpose.length < 3} />
    </>
  );
};

export default AppoinmentDetails;

import { useGetVehiclesQuery } from "@/store/api/vehicleApi";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { LuFuel } from "react-icons/lu";
import { CgOptions } from "react-icons/cg";
import { RiSpeedUpLine } from "react-icons/ri";
import AppointmentActions from "./AppointmentActions";
import { setAppointment, setVehicle } from "@/store/slices/appointmentSlice";

const AppoinmentVehicles = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointment } = useSelector(
    (state: RootState) => state.appointmentSlice,
  );
  const { data: vehicles } = useGetVehiclesQuery();

  const handleSelectVehicle = (vehicleId: string) => {
    const vehicle = vehicles?.find((v) => String(v.id) === vehicleId);

    dispatch(setAppointment({ vehicleId }));
    dispatch(
      setVehicle({
        brand: vehicle?.brand || "",
        model: vehicle?.model || "",
        plate: vehicle?.plate || "",
      }),
    );
  };

  return (
    <>
      <div className="flex flex-col space-y-1.5 pb-6">
        <h3 className="font-semibold tracking-tight text-base flex items-center gap-2">
          {appointment.hourStart} - {appointment.hourEnd} saatleri arasında
          mevcut araçlar
        </h3>
      </div>

      <div className="px-6">
        <div className="grid gap-3 md:grid-cols-2">
          {vehicles?.map((vehicle) => (
            <button
              key={vehicle.id}
              className={`rounded-md cursor-pointer border p-4 text-left transition-colors ${appointment.vehicleId === String(vehicle.id) ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/60"}`}
              onClick={() => handleSelectVehicle(String(vehicle.id))}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <strong className="font-display font-bold">
                    {vehicle.brand} {vehicle.model}
                  </strong>

                  <span className="text-sm text-muted-foreground block">
                    {vehicle.plate}
                  </span>
                </div>

                <div className="inline-flex items-center border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide bg-success/12 text-success border-success/40">
                  {vehicle.status}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <LuFuel />
                  <span>{vehicle.fuel}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CgOptions />
                  <span>{vehicle.gear}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <RiSpeedUpLine />
                  <span>{new Intl.NumberFormat().format(vehicle.km)} km/h</span>
                </span>
              </div>
            </button>
          ))}
        </div>

        <AppointmentActions isError={appointment.vehicleId === ""} />
      </div>
    </>
  );
};

export default AppoinmentVehicles;

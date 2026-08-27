"use client";

import CustomButton from "@/components/ui/CustomButton";
import Table from "@/components/ui/Table";
import EmptyState from "@/components/ui/EmptyState";
import useAuth from "@/hooks/useAuth";
import {
  useGetVehiclesQuery,
  useUpdateVehicleStatusMutation,
} from "@/store/api/vehicleApi";
import { UserRole } from "@/types/user";
import { VehicleStatus } from "@/types/vehicle";
import { PiCarProfile } from "react-icons/pi";

const tableTheads = [
  "Plaka",
  "Marka",
  "Model",
  "Yıl",
  "Yakıt",
  "Vites",
  "KM",
  "Lokasyon",
  "Durum",
];

const TableData = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => {
  return (
    <td className={`py-2 align-middle truncate font-medium ${className}`}>
      {text}
    </td>
  );
};

const vehicleStatusMap = {
  AVAILABLE: {
    label: "Müsait",
    className:
      "inline-flex items-center rounded-md border px-2.5 py-0.5 font-extrabold! transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-success/40 bg-success/12 text-[11px] text-success",
  },
  OUT_OF_SERVICE: {
    label: "Servis Dışı",
    className:
      "inline-flex items-center rounded-md border border-border px-2.5 py-0.5 font-extrabold! transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-[11px] text-muted-foreground",
  },
};

const VehiclesPage = () => {
  const { user } = useAuth();
  const { data: vehicles } = useGetVehiclesQuery();
  const [updateStatus] = useUpdateVehicleStatusMutation();
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <Table
      theads={isAdmin ? tableTheads.concat("Eylemler") : tableTheads}
      theadTrClassName={`${isAdmin ? "grid-cols-10" : "grid-cols-9"} gap-8`}
    >
      {vehicles?.length === 0 ? (
        <tr>
          <td colSpan={isAdmin ? 10 : 9}>
            <EmptyState
              icon={PiCarProfile}
              title="Kayıtlı araç bulunamadı"
              description="Sistemde henüz tanımlı bir araç yok."
            />
          </td>
        </tr>
      ) : (
        vehicles?.map((vehicle) => (
          <tr
            key={vehicle.id}
            className={`grid ${isAdmin ? "grid-cols-10" : "grid-cols-9"} gap-8 px-6 py-1 not-last:border-b border-b-border transition-colors hover:bg-muted/50`}
          >
            <TableData text={vehicle.plate} className="font-bold!" />
            <TableData text={vehicle.brand} className="text-muted-foreground" />
            <TableData text={vehicle.model} />
            <TableData text={String(vehicle.year)} />
            <TableData text={vehicle.fuel} />
            <TableData text={vehicle.gear} />
            <TableData text={String(vehicle.km)} />
            <TableData text={vehicle.location} />

            <TableData
              text={vehicleStatusMap[vehicle.status].label}
              className={
                vehicleStatusMap[vehicle.status].className +
                " py-0.5! self-center w-max"
              }
            />

            {isAdmin && (
              <td className="self-center">
                <CustomButton
                  circularColor="#000"
                  className="border border-input bg-background! shadow-sm! hover:bg-accent! font-bold! text-foreground! hover:text-accent-foreground! h-8! px-3! text-xs w-28.5!"
                  handleClick={() =>
                    updateStatus({
                      vehicleId: vehicle.id,
                      status:
                        vehicle.status === VehicleStatus.AVAILABLE
                          ? VehicleStatus.OUT_OF_SERVICE
                          : VehicleStatus.AVAILABLE,
                    })
                  }
                  text={
                    vehicle.status == VehicleStatus.AVAILABLE
                      ? "Devre dışı bırak"
                      : "Etkinleştir"
                  }
                />
              </td>
            )}
          </tr>
        ))
      )}
    </Table>
  );
};

export default VehiclesPage;

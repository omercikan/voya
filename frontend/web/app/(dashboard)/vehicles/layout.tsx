"use client";

import Header from "@/components/dashboard/Header";
import AddVehicle from "@/components/dashboard/modal/AddVehicle";
import CustomButton from "@/components/ui/CustomButton";
import useAuth from "@/hooks/useAuth";
import { UserRole } from "@/types/user";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";

export default function VehiclesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [isShowModal, setIsShowModal] = useState(false);

  return (
    <>
      <Header
        title="Şirket Araçları"
        description="Şirket araçları, kurum içi rezervasyonlar için kullanılabilir."
      >
        {user?.role === UserRole.ADMIN && (
          <CustomButton
            className="w-max"
            handleClick={() => setIsShowModal(!isShowModal)}
          >
            <LuPlus />
            Araç Ekle
          </CustomButton>
        )}
      </Header>

      {isShowModal && <AddVehicle setIsShowModal={setIsShowModal} />}

      <main>{children}</main>
    </>
  );
}

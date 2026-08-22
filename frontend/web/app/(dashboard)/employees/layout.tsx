"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import Header from "@/components/dashboard/Header";
import AddEmployee from "@/components/dashboard/modal/AddEmployee";
import CustomButton from "@/components/ui/CustomButton";
import { UserRole } from "@/types/user";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";

export default function EmployeesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isShowModal, setIsShowModal] = useState(false);

  return (
    <RoleGuard role={UserRole.ADMIN}>
      <Header
        title="Çalışanlar"
        description="Şirket araçlarını talep edebilecek iç hesaplar."
      >
        <CustomButton
          className="w-max"
          handleClick={() => setIsShowModal(!isShowModal)}
        >
          <LuPlus />
          Çalışan Ekle
        </CustomButton>
      </Header>

      {isShowModal && <AddEmployee setIsShowModal={setIsShowModal} />}

      {children}
    </RoleGuard>
  );
}

"use client";

import { MdOutlineDashboard } from "react-icons/md";
import { LuCalendarPlus, LuNotepadText } from "react-icons/lu";
import { PiCarProfile } from "react-icons/pi";
import { FiUsers, FiUser } from "react-icons/fi";
import Links from "./Links";
import { UserRole } from "@/types/user";

const Sidebar = () => {
  return (
    <aside className="flex-col bg-sidebar sticky top-0 hidden h-screen w-64 shrink-0 md:block">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
        <div className="flex size-9 items-center justify-center rounded-md bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
          YT
        </div>

        <div className="leading-tight">
          <strong className="font-display text-sm font-bold tracking-widest text-sidebar-foreground">
            YALTES
          </strong>

          <p className="text-[11px] text-sidebar-foreground/60">Araç Randevu</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <Links
          links={[
            {
              label: "Ana Sayfa",
              href: "/dashboard",
              icon: MdOutlineDashboard,
              role: "ALL",
            },
            {
              label: "Randevular",
              href: "/appointments",
              icon: LuNotepadText,
              role: UserRole.ADMIN,
            },
            {
              label: "Randevularım",
              href: "/appointments",
              icon: LuNotepadText,
              role: UserRole.EMPLOYEE,
            },
            {
              label: "Yeni Randevu",
              href: "/appointments/new",
              icon: LuCalendarPlus,
              role: UserRole.EMPLOYEE,
            },
            {
              label: "Araçlar",
              href: "/vehicles",
              icon: PiCarProfile,
              role: "ALL",
            },
            {
              label: "Çalışanlar",
              href: "/employees",
              icon: FiUsers,
              role: UserRole.ADMIN,
            },
            {
              label: "Profil",
              href: "/profile",
              icon: FiUser,
              role: "ALL",
            },
          ]}
        />
      </nav>
    </aside>
  );
};

export default Sidebar;

"use client";

import CustomButton from "@/components/ui/CustomButton";
import Table from "@/components/ui/Table";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateStatusMutation,
} from "@/store/api/userApi";
import { AccountStatus } from "@/types/user";

const tableTheads = [
  "İsim",
  "E-posta",
  "Departman",
  "Yetki",
  "Hesap Durumu",
  "Eylemler",
];

const accountStatusMap = {
  ACTIVE: {
    label: "Aktif",
    className:
      "inline-flex items-center rounded-md border px-2.5 py-0.5 font-extrabold! transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-success/40 bg-success/12 text-[11px] text-success",
  },
  INACTIVE: {
    label: "Aktif Değil",
    className:
      "inline-flex items-center rounded-md border border-border px-2.5 py-0.5 font-extrabold! transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-[11px] text-muted-foreground",
  },
};

const roleMap = {
  ADMIN: "Admin",
  EMPLOYEE: "Çalışan",
};

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

const EmployeesPage = () => {
  const { data: users } = useGetUsersQuery();
  const [updateStatus] = useUpdateStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  return (
    <Table theads={tableTheads} theadTrClassName="grid-cols-6 gap-12">
      {users?.data?.map((user) => (
        <tr
          key={user.id}
          className="grid grid-cols-6 gap-12 px-6 py-1 not-last:border-b border-b-border transition-colors hover:bg-muted/50"
        >
          <TableData text={user.fullName} className="font-bold!" />
          <TableData text={user.email} className="text-muted-foreground" />
          <TableData text={user.department} />

          <TableData
            text={roleMap[user.role]}
            className="inline-flex items-center rounded-md border border-border px-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-[11px] font-black! flex-none! py-0.5! self-center w-max"
          />

          <TableData
            text={accountStatusMap[user.status].label}
            className={
              accountStatusMap[user.status].className +
              " py-0.5! self-center w-max"
            }
          />

          <td className="self-center">
            <div className="flex max-xl:flex-wrap gap-x-3 gap-y-1">
              <CustomButton
                circularColor="#000"
                className="border border-input bg-background! shadow-sm! hover:bg-accent! font-bold! text-foreground! hover:text-accent-foreground! h-8! px-3! text-xs flex-1"
                handleClick={() =>
                  updateStatus({
                    userId: user.id,
                    status:
                      user.status === AccountStatus.ACTIVE
                        ? AccountStatus.INACTIVE
                        : AccountStatus.ACTIVE,
                  })
                }
                text={
                  user.status == AccountStatus.ACTIVE
                    ? "Devre dışı bırak"
                    : "Etkinleştir"
                }
              />

              <CustomButton
                circularColor="#000"
                className="border border-destructive/50 bg-destructive! shadow-sm! hover:bg-destructive/90! font-bold! text-destructive-foreground! h-8! px-3! text-xs flex-1"
                text="Sil"
                handleClick={() => deleteUser(user.id)}
              />
            </div>
          </td>
        </tr>
      ))}
    </Table>
  );
};

export default EmployeesPage;

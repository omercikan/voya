import Header from "@/components/dashboard/Header";

export default function NewAppointmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header
        title="Yeni Randevu"
        description="Beş basit adımda şirket aracı talebinde bulunun."
      />

      <main className="flex-1 space-y-6 p-5 lg:p-7">{children}</main>
    </>
  );
}

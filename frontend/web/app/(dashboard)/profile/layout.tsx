import Header from "@/components/dashboard/Header";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header title="Profil" description="Şirket içi hesap bilgileriniz." />

      <main className="flex-1 space-y-6 p-5 lg:p-7">{children}</main>
    </>
  );
}

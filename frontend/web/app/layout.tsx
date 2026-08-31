import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/providers/ReduxProvider";
import { Toaster } from "react-hot-toast";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Voya | Araç Randevu Sistemi",
    template: "%s | Voya",
  },
  description: "Voya araç bakım ve servis randevu yönetim platformu.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={manrope.variable}>
      <body>
        <Toaster position="top-right" reverseOrder={false} />
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}

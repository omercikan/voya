import { AppointmentStatus } from "@/types/appointment";

export const appointmentStatusMap = {
  [AppointmentStatus.PENDING]: {
    label: "Beklemede",
    className: "bg-warning/15 text-warning-foreground border border-warning/40",
  },
  [AppointmentStatus.CONFIRMED]: {
    label: "Onaylandı",
    className: "bg-success/12 text-success border border-success/40",
  },
  [AppointmentStatus.CANCELLED]: {
    label: "İptal Edildi",
    className: "bg-destructive/12 text-destructive border border-destructive/40",
  },
  [AppointmentStatus.COMPLETED]: {
    label: "Tamamlandı",
    className: "bg-blue-100 text-blue-800 border border-blue-300",
  },
};
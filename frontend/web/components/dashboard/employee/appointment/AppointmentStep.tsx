"use client";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { LuCheck } from "react-icons/lu";

const appointmentSteps = [
  {
    id: 1,
    label: "Tarih",
  },
  {
    id: 2,
    label: "Zaman",
  },
  {
    id: 3,
    label: "Araç",
  },
  {
    id: 4,
    label: "Randevu Detayları",
  },
  {
    id: 5,
    label: "İncele",
  },
];

const AppointmentStep = () => {
  const { step: currentStep } = useSelector(
    (state: RootState) => state.appointmentSlice,
  );

  return (
    <div>
      <ol className="flex flex-wrap items-center gap-2">
        {appointmentSteps.map((step) => (
          <li key={step.id} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm ${currentStep === step.id ? "border-primary bg-primary text-primary-foreground" : currentStep > step.id ? "border-success/40 bg-success/10 text-success" : "border-border text-muted-foreground"}`}
            >
              {currentStep > step.id ? (
                <span className="flex size-5 items-center justify-center rounded-full font-bold bg-success/20">
                  <LuCheck className="text-xs!" size={12} />
                </span>
              ) : (
                <span
                  className={`flex size-5 items-center justify-center rounded-full text-[11px] font-bold ${currentStep === step.id ? "bg-primary-foreground/20" : currentStep > step.id ? "bg-success/40" : "bg-muted"}`}
                >
                  {step.id}
                </span>
              )}

              <span className="font-semibold">{step.label}</span>
            </div>

            {step.id !== 5 && (
              <span className="hidden h-px w-4 bg-border sm:block" />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default AppointmentStep;

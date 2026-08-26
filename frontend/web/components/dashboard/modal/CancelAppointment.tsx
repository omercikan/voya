import CustomButton from "@/components/ui/CustomButton";

export interface CancelAppointmentProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  closeModalText: string;
  actionButtonText: string;
  actionButtonClass?: string;
  closeModelClick: () => void;
  actionButtonClick: () => void;
  isSubmitting: boolean;
}

const CancelAppointment = ({
  title,
  description,
  closeModalText,
  actionButtonText,
  actionButtonClass,
  children,
  closeModelClick,
  actionButtonClick,
  isSubmitting,
}: CancelAppointmentProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {children}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <CustomButton
            text={closeModalText}
            className="border border-input bg-background! hover:bg-accent! hover:text-accent-foreground! text-foreground! w-max"
            handleClick={closeModelClick}
          />

          <CustomButton
            text={actionButtonText}
            className={`w-max ${actionButtonClass}`}
            handleClick={actionButtonClick}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default CancelAppointment;

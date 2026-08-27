import { IconType } from "react-icons";
import CustomButton from "@/components/ui/CustomButton";

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}: {
  icon: IconType;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Icon size={22} />
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>

        {description && (
          <p className="text-xs text-muted-foreground max-w-xs">
            {description}
          </p>
        )}
      </div>

      {actionText && onAction && (
        <CustomButton
          text={actionText}
          className="mt-2 w-max h-8! text-xs font-semibold"
          handleClick={onAction}
        />
      )}
    </div>
  );
};

export default EmptyState;

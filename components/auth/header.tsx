import { cn } from "@/lib/utils";
import { APP_NAME } from "@/data/constants";
import { FormInput } from "lucide-react";

interface HeaderProps {
  label: string;
};

export const Header = ({
  label,
}: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={cn(
        "text-3xl font-semibold flex flex-row items-center justify-center gap-x-2",
      )}>
        <span><FormInput size={20} /></span>
        {APP_NAME}
      </h1>
      <p className="text-muted-foreground text-sm">
        {label}
      </p>
    </div>
  );
};

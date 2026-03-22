import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DashboardButtonProps = Omit<React.ComponentProps<typeof Button>, "variant"> & {
  variant?: "primary" | "destructive" | "secondary" | "outline" | "ghost";
};

export function DashboardButton({
  children,
  className,
  variant = "primary",
  ...props
}: DashboardButtonProps) {
  let variantClass = "";
  switch (variant) {
    case "destructive": {
      variantClass = "bg-red-500 text-white hover:bg-red-600";
      break;
    }
    case "secondary": {
      variantClass = "bg-gray-200 text-gray-800 hover:bg-gray-300";
      break;
    }
    case "outline": {
      variantClass = "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50";
      break;
    }
    case "ghost": {
      variantClass = "bg-transparent text-gray-700 hover:bg-gray-50";
      break;
    }
    default: {
      variantClass =
        "bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold" +
        " hover:from-emerald-600 hover:to-teal-600";
      break;
    }
  }
  return (
    <Button
      className={cn("rounded-lg shadow transition-colors", variantClass, className)}
      {...props}
      variant={variant === "primary" ? "default" : variant}
    >
      {children}
    </Button>
  );
}

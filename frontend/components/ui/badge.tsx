import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      primary: "bg-primary-500 text-white",
      accent: "bg-accent-100 text-accent-600",
      success: "bg-green-100 text-success-500",
      warning: "bg-amber-100 text-warning-500",
      neutral: "bg-slate-100 text-slate-600",
    },
  },
  defaultVariants: { variant: "neutral" },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

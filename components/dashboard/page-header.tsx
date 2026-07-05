import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GradientDivider } from "@/components/ui/premium-primitives";

interface PageHeaderBreadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  breadcrumbs?: PageHeaderBreadcrumb[];
  actions?: ReactNode;
  meta?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  icon: Icon,
  iconClassName,
  breadcrumbs,
  actions,
  meta,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:p-5 lg:p-6",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/40 before:to-transparent",
        className
      )}
    >
      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              {breadcrumbs.map((item, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
                    {item.href && !isLast ? (
                      <Link href={item.href} className="font-medium hover:text-foreground">
                        {item.label}
                      </Link>
                    ) : (
                      <span className={cn(isLast && "font-medium text-foreground")}>{item.label}</span>
                    )}
                    {!isLast && <ChevronRight className="h-3 w-3" aria-hidden="true" />}
                  </span>
                );
              })}
            </nav>
          )}

          <div className="flex min-w-0 items-start gap-3">
            {Icon && (
              <div
                className={cn(
                  "mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/[0.12] text-primary shadow-[0_0_40px_rgba(91,121,255,0.16)]",
                  iconClassName
                )}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div className="min-w-0 max-w-full">
              {eyebrow && (
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/85">
                  {eyebrow}
                </p>
              )}
              <h1 className="mt-1 text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {title}
              </h1>
              {description && (
                <p className="mt-2 max-w-full break-words text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere] sm:max-w-3xl sm:text-[15px]">
                  {description}
                </p>
              )}
              {meta && <div className="mt-4">{meta}</div>}
            </div>
          </div>
        </div>

        {actions && (
          <div className="flex min-w-0 w-full flex-wrap items-center gap-2 lg:w-auto lg:shrink-0 lg:justify-end">
            {actions}
          </div>
        )}
      </div>
      <GradientDivider className="relative z-10 mt-5 opacity-60" />
    </header>
  );
}

export const PremiumPageHeader = PageHeader;

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        <h2 className="text-base font-semibold leading-snug">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

"use client";

import type { ReactNode } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface PremiumTabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
  description?: string;
  badge?: string | number;
}

export function PremiumTabs({
  tabs,
  defaultValue,
  className,
  listClassName,
  contentClassName,
}: {
  tabs: PremiumTabItem[];
  defaultValue?: string;
  className?: string;
  listClassName?: string;
  contentClassName?: string;
}) {
  return (
    <Tabs defaultValue={defaultValue ?? tabs[0]?.value} className={cn("space-y-4", className)}>
      <div className="safe-scroll-x rounded-2xl border border-white/10 bg-white/[0.035] p-1">
        <TabsList className={cn("inline-flex h-auto min-w-max gap-1 bg-transparent p-0", listClassName)}>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="h-9 rounded-xl px-3 text-xs sm:text-sm"
            >
              <span className="flex items-center gap-1.5">
                {tab.label}
                {tab.badge != null && (
                  <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                    {tab.badge}
                  </Badge>
                )}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className={cn("outline-none", contentClassName)}>
          {tab.description && (
            <p className="mb-3 text-sm leading-6 text-muted-foreground">{tab.description}</p>
          )}
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

interface DetailDrawerProps {
  title: string;
  description?: ReactNode;
  trigger: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function DetailDrawer({
  title,
  description,
  trigger,
  children,
  footer,
  className,
  contentClassName,
}: DetailDrawerProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-hidden rounded-t-3xl border border-white/10 bg-background shadow-2xl outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-4",
            "sm:inset-y-3 sm:left-auto sm:right-3 sm:w-[min(520px,calc(100vw-2rem))] sm:max-h-none sm:rounded-3xl sm:data-[state=open]:slide-in-from-right-6 sm:data-[state=closed]:slide-out-to-right-6",
            className
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
            <div className="min-w-0">
              <Dialog.Title className="text-base font-semibold tracking-tight">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="mt-1 text-sm leading-6 text-muted-foreground">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" aria-label="Close drawer">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>
          <div className={cn("max-h-[calc(92dvh-8rem)] overflow-y-auto p-5 sm:max-h-[calc(100dvh-9.5rem)]", contentClassName)}>
            {children}
          </div>
          {footer && <div className="border-t border-white/10 px-5 py-4">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function InsightDrawer(props: DetailDrawerProps) {
  return <DetailDrawer {...props} />;
}

export function MetricDrilldownDrawer(props: DetailDrawerProps) {
  return <DetailDrawer {...props} />;
}

export function NewsEventDrawer(props: DetailDrawerProps) {
  return <DetailDrawer {...props} />;
}

export function ReportPreviewDrawer(props: DetailDrawerProps) {
  return <DetailDrawer {...props} />;
}

export function MobileFilterSheet(props: DetailDrawerProps) {
  return <DetailDrawer {...props} />;
}

export function CommandModal({
  title,
  description,
  trigger,
  children,
  footer,
}: DetailDrawerProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-background p-0 shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:zoom-in-95">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
            <div className="min-w-0">
              <Dialog.Title className="text-base font-semibold tracking-tight">{title}</Dialog.Title>
              {description && (
                <Dialog.Description className="mt-1 text-sm leading-6 text-muted-foreground">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" aria-label="Close modal">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>
          <div className="p-5">{children}</div>
          {footer && <div className="border-t border-white/10 px-5 py-4">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ExpandableSection({
  title,
  description,
  children,
  defaultOpen = false,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <Accordion.Root type="single" collapsible defaultValue={defaultOpen ? "content" : undefined}>
      <Accordion.Item value="content" className={cn("rounded-2xl border border-white/10 bg-white/[0.025]", className)}>
        <Accordion.Header>
          <Accordion.Trigger className="flex w-full items-start justify-between gap-4 px-4 py-3 text-left">
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{title}</span>
              {description && (
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {description}
                </span>
              )}
            </span>
            <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="overflow-hidden border-t border-white/10 px-4 py-4 text-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          {children}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

export function MethodologyPopover({
  label = "Methodology",
  children,
}: {
  label?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Info className="h-3.5 w-3.5" />
          {label}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          className="z-50 max-w-xs rounded-2xl border border-white/10 bg-popover p-4 text-xs leading-5 text-popover-foreground shadow-xl"
        >
          {children}
          <Popover.Arrow className="fill-popover" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function TooltipInfo({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
          {label}
          <Info className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}

export function SectionSummaryCard({
  eyebrow,
  title,
  description,
  action,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-3xl border border-white/10 bg-white/[0.035] p-5", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-1 text-base font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </section>
  );
}

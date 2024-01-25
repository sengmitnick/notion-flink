import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "~lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "nf-inline-flex nf-h-9 nf-items-center nf-justify-center nf-rounded-lg nf-bg-muted nf-p-1 nf-text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "nf-inline-flex nf-items-center nf-justify-center nf-whitespace-nowrap nf-rounded-md nf-px-3 nf-py-1 nf-text-sm nf-font-medium nf-ring-offset-background nf-transition-all focus-visible:nf-outline-none focus-visible:nf-ring-2 focus-visible:nf-ring-ring focus-visible:nf-ring-offset-2 disabled:nf-pointer-events-none disabled:nf-opacity-50 data-[state=active]:nf-bg-background data-[state=active]:nf-text-foreground data-[state=active]:nf-shadow",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "nf-mt-2 nf-ring-offset-background focus-visible:nf-outline-none focus-visible:nf-ring-2 focus-visible:nf-ring-ring focus-visible:nf-ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

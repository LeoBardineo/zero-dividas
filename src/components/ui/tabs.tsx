import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps {
    defaultValue: string
    children: React.ReactNode
    className?: string
}

const TabsContext = React.createContext<{
    value: string
    setValue: (value: string) => void
} | null>(null)

export function Tabs({ defaultValue, children, className }: TabsProps) {
    const [value, setValue] = React.useState(defaultValue)

    return (
        <TabsContext.Provider value={{ value, setValue }}>
            <div className={cn("w-full", className)}>{children}</div>
        </TabsContext.Provider>
    )
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div
            className={cn(
                "inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500",
                className
            )}
        >
            {children}
        </div>
    )
}

export function TabsTrigger({
    value,
    children,
    className,
}: {
    value: string
    children: React.ReactNode
    className?: string
}) {
    const context = React.useContext(TabsContext)
    if (!context) throw new Error("TabsTrigger must be used within Tabs")

    const isActive = context.value === value

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive
                    ? "bg-white text-slate-950 shadow-sm"
                    : "hover:bg-slate-200 hover:text-slate-900",
                className
            )}
            onClick={() => context.setValue(value)}
        >
            {children}
        </button>
    )
}

export function TabsContent({
    value,
    children,
    className,
}: {
    value: string
    children: React.ReactNode
    className?: string
}) {
    const context = React.useContext(TabsContext)
    if (!context) throw new Error("TabsContent must be used within Tabs")

    if (context.value !== value) return null

    return (
        <div
            className={cn(
                "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
        >
            {children}
        </div>
    )
}

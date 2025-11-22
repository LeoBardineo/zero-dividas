import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Account } from "@/utils/mockData"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface AccountCardProps {
    account: Account
    className?: string
}

export function AccountCard({ account, className }: AccountCardProps) {
    return (
        <Card
            className={cn("min-w-[280px] text-white border-none shadow-md", className)}
            style={{ backgroundColor: account.color }}
        >
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium opacity-90">
                    {account.bankName}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {formatCurrency(account.balance)}
                </div>
                <div className="text-sm opacity-80 mt-1">
                    Conta Corrente
                </div>
            </CardContent>
        </Card>
    )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Account } from "@/utils/mockData"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Pencil, Trash2 } from "lucide-react"

interface AccountCardProps {
    account: Account
    className?: string
    onEdit?: (account: Account) => void
    onDelete?: (id: string) => void
}

export function AccountCard({ account, className, onEdit, onDelete }: AccountCardProps) {
    return (
        <Card
            className={cn("min-w-[280px] text-white border-none shadow-md relative group", className)}
            style={{ backgroundColor: account.color }}
        >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                {onEdit && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
                        onClick={(e) => {
                            e.stopPropagation()
                            onEdit(account)
                        }}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
                {onDelete && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/20"
                        onClick={(e) => {
                            e.stopPropagation()
                            onDelete(account.id)
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>
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
                    {account.type === 'checking' ? 'Conta Corrente' :
                        account.type === 'savings' ? 'Poupança' : 'Investimento'}
                </div>
            </CardContent>
        </Card>
    )
}

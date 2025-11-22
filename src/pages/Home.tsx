import { useStore } from '@/store/useStore'
import { formatCurrency, formatDate } from '@/lib/utils'
import { AccountCard } from '@/components/AccountCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Minus, CreditCard, Settings, LogOut, Bell } from 'lucide-react'
import { startOfMonth, endOfMonth, isAfter, isBefore } from 'date-fns'

export default function Home() {
    const { user, accounts, transactions, logout } = useStore()

    if (!user) return null

    const today = new Date()
    const currentMonthStart = startOfMonth(today)
    const currentMonthEnd = endOfMonth(today)

    // Calculate totals
    const monthlyIncome = transactions
        .filter(t => t.type === 'income' && t.date >= currentMonthStart.toISOString() && t.date <= currentMonthEnd.toISOString())
        .reduce((acc, t) => acc + t.amount, 0)

    const monthlyExpenses = transactions
        .filter(t => t.type === 'expense' && t.date >= currentMonthStart.toISOString() && t.date <= currentMonthEnd.toISOString())
        .reduce((acc, t) => acc + t.amount, 0)

    const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0)

    const pendingBills = transactions
        .filter(t => t.type === 'expense' && t.status === 'pending' && t.date <= currentMonthEnd.toISOString())
        .reduce((acc, t) => acc + t.amount, 0)

    const remainingToSpend = totalBalance - pendingBills

    const upcomingBills = transactions
        .filter(t => t.type === 'expense' && t.status === 'pending' && isAfter(new Date(t.date), today))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5)

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Bom dia'
        if (hour < 18) return 'Boa tarde'
        return 'Boa noite'
    }

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-10 w-10 rounded-full border border-slate-200"
                    />
                    <div>
                        <p className="text-sm text-slate-500">{getGreeting()},</p>
                        <h2 className="font-semibold text-slate-900">{user.name.split(' ')[0]}</h2>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={logout}>
                    <LogOut className="h-5 w-5 text-slate-500" />
                </Button>
            </div>

            {/* Monthly Balance */}
            <Card className={remainingToSpend >= 0 ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                        Restante para gastar
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={remainingToSpend >= 0 ? "text-3xl font-bold text-emerald-600" : "text-3xl font-bold text-red-600"}>
                        {formatCurrency(remainingToSpend)}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        Saldo atual ({formatCurrency(totalBalance)}) - Contas a pagar ({formatCurrency(pendingBills)})
                    </p>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex justify-around">
                <div className="flex flex-col items-center space-y-2">
                    <Button size="icon" className="h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-md">
                        <Plus className="h-6 w-6 text-white" />
                    </Button>
                    <span className="text-xs font-medium text-slate-600">Receita</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                    <Button size="icon" className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600 shadow-md">
                        <Minus className="h-6 w-6 text-white" />
                    </Button>
                    <span className="text-xs font-medium text-slate-600">Gasto</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                    <Button size="icon" className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 shadow-md">
                        <CreditCard className="h-6 w-6 text-white" />
                    </Button>
                    <span className="text-xs font-medium text-slate-600">Pagar</span>
                </div>
            </div>

            {/* Cash Flow Summary */}
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="p-1.5 bg-emerald-100 rounded-full">
                                <Plus className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="text-xs font-medium text-slate-500">Entradas</span>
                        </div>
                        <div className="text-lg font-bold text-slate-900">
                            {formatCurrency(monthlyIncome)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="p-1.5 bg-red-100 rounded-full">
                                <Minus className="h-4 w-4 text-red-600" />
                            </div>
                            <span className="text-xs font-medium text-slate-500">Saídas</span>
                        </div>
                        <div className="text-lg font-bold text-slate-900">
                            {formatCurrency(monthlyExpenses)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Accounts */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">Minhas Contas</h3>
                    <Button variant="ghost" size="sm" className="text-xs h-8">
                        Adicionar
                    </Button>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                    {accounts.map(account => (
                        <AccountCard key={account.id} account={account} />
                    ))}
                </div>
            </div>

            {/* Bill Alerts */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">Próximas Contas</h3>
                    <Button variant="ghost" size="sm" className="text-xs h-8">
                        Ver todas
                    </Button>
                </div>
                <div className="space-y-3">
                    {upcomingBills.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-4">Nenhuma conta próxima.</p>
                    ) : (
                        upcomingBills.map(bill => (
                            <Card key={bill.id} className="border-l-4 border-l-red-500">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-900">{bill.description}</p>
                                        <p className="text-xs text-slate-500">Vence em {formatDate(bill.date)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">{formatCurrency(bill.amount)}</p>
                                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">
                                            Pendente
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

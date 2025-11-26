import { useStore } from '@/store/useStore'
import { formatCurrency, formatDate } from '@/lib/utils'
import { AccountCard } from '@/components/AccountCard'
import { AddAccountModal } from '@/components/AddAccountModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Minus, LogOut } from 'lucide-react'
import { startOfMonth, endOfMonth, isAfter } from 'date-fns'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function Home() {
    const {
        user,
        accounts,
        transactions,
        logout,
        setActiveTab,
        openTransactionModal,
        setAccountsSortOrder,
        isAddAccountModalOpen,
        openAddAccountModal,
        closeAddAccountModal
    } = useStore()

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

    const pendingIncome = transactions
        .filter(t => t.type === 'income' && t.status === 'pending' && t.date <= currentMonthEnd.toISOString())
        .reduce((acc, t) => acc + t.amount, 0)

    const remainingToSpend = totalBalance + pendingIncome - pendingBills

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
                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-200 flex items-center justify-center border border-slate-300 dark:border-slate-600">
                        <span className="text-lg font-bold text-slate-600">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-white">{getGreeting()},</p>
                        <h2 className="font-semibold text-slate-900 dark:text-white">{user.name.split(' ')[0]}</h2>
                    </div>
                </div>
                <ThemeToggle /> {/*provavelmente mudar posição*/}
                <Button variant="ghost" size="icon" onClick={logout}>
                    <LogOut className="h-5 w-5 text-slate-500 dark:text-white" />
                </Button>
            </div>

            {/* Monthly Balance */}
            <Card className={remainingToSpend >= 0 ? "bg-emerald-50 border-emerald-100 dark:bg-[#0B494F] dark:border-[#072F33]" : "bg-red-50 border-red-100 dark:bg-[#881C1C] dark:border-[#611414]"}>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-100">
                        Restante para gastar
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={remainingToSpend >= 0 ? "text-3xl font-bold text-emerald-600 dark:text-emerald-300" : "text-3xl font-bold text-red-600 dark:text-red-300"}>
                        {formatCurrency(remainingToSpend)}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 dark:text-slate-50">
                        Saldo atual ({formatCurrency(pendingIncome)}) - Contas a pagar ({formatCurrency(pendingBills)})
                    </p>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex justify-center gap-8">
                <div className="flex flex-col items-center space-y-2">
                    <Button
                        size="icon"
                        className="h-14 w-14 rounded-full bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-900 shadow-md"
                        onClick={() => {
                            setActiveTab('accounts') /* reclamaram que não gostaram de serem guiados para aba de contas*/
                            openTransactionModal('income')
                        }}
                    >
                        <Plus className="h-7 w-7 text-white" />
                    </Button>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-100">Receita</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                    <Button
                        size="icon"
                        className="h-14 w-14 rounded-full bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-800 shadow-md"
                        onClick={() => {
                            setActiveTab('accounts') /* reclamaram que não gostaram de serem guiados para aba de contas*/
                            openTransactionModal('expense')
                        }}
                    >
                        <Minus className="h-7 w-7 text-white" />
                    </Button>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-100">Gasto</span>
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
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-50">Entradas</span>
                        </div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
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
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-50">Saídas</span>
                        </div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                            {formatCurrency(monthlyExpenses)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Accounts */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50">Minhas Contas</h3>
                    <Button variant="ghost" size="sm" className="text-xs h-8 dark:hover:bg-slate-800 dark:hover:text-white" onClick={openAddAccountModal}>
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
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Próximas Contas</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8 dark:hover:bg-slate-800 dark:hover:text-white"
                        onClick={() => {
                            setAccountsSortOrder('default')
                            setActiveTab('accounts')
                        }}
                    >
                        Ver todas
                    </Button>
                </div>
                <div className="space-y-3">
                    {upcomingBills.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-100 text-center py-4">Nenhuma conta próxima.</p>
                    ) : (
                        upcomingBills.map(bill => (
                            <Card key={bill.id} className="border-l-4 border-l-red-500">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-slate-100">{bill.description}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-50">Vence em {formatDate(bill.date)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(bill.amount)}</p>
                                        <span className="text-[10px] bg-red-100 dark:bg-red-500 text-red-700 dark:text-red-900 px-1.5 py-0.5 rounded-full">
                                            Pendente
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            <AddAccountModal
                isOpen={isAddAccountModalOpen}
                onClose={closeAddAccountModal}
            />
        </div>
    )
}

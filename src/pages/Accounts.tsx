import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Calendar as CalendarIcon, List, ChevronDown, ChevronRight, Filter } from 'lucide-react'
import { AddTransactionModal } from '@/components/AddTransactionModal'
import { FilterModal } from '@/components/FilterModal'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { isSameDay, parseISO } from 'date-fns'

export default function Accounts() {
    const {
        transactions,
        categories,
        payBill,
        isTransactionModalOpen,
        transactionModalType,
        openTransactionModal,
        closeTransactionModal,
        accountsSortOrder,
        setAccountsSortOrder
    } = useStore()
    // const [isAddModalOpen, setIsAddModalOpen] = useState(false) // Removed local state
    const [isSearching, setIsSearching] = useState(false)
    const [view, setView] = useState<'list' | 'calendar'>('list')
    const [date, setDate] = useState(new Date())
    // const [sortOrder, setSortOrder] = useState<'default' | 'date-asc' | 'date-desc' | 'amount-asc' | 'amount-desc'>('default') // Removed local state
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedAccount, setSelectedAccount] = useState('all')

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

    const [visibleExpensesCount, setVisibleExpensesCount] = useState(5)
    const [visibleIncomeCount, setVisibleIncomeCount] = useState(5)
    const [isExpensesExpanded, setIsExpensesExpanded] = useState(true)
    const [isIncomeExpanded, setIsIncomeExpanded] = useState(true)

    const sortTransactions = (txs: typeof transactions) => {
        return [...txs].sort((a, b) => {
            // Always prioritize unpaid expenses first
            if (a.type === 'expense' && b.type === 'expense') {
                if (a.status === 'pending' && b.status === 'paid') return -1
                if (a.status === 'paid' && b.status === 'pending') return 1
            }

            // Then apply the selected sort order
            if (accountsSortOrder === 'default') {
                return new Date(a.date).getTime() - new Date(b.date).getTime()
            }
            if (accountsSortOrder === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime()
            if (accountsSortOrder === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime()
            if (accountsSortOrder === 'amount-asc') return a.amount - b.amount
            if (accountsSortOrder === 'amount-desc') return b.amount - a.amount
            return 0
        })
    }

    const filterTransactions = (txs: typeof transactions) => {
        return txs.filter(t => {
            if (selectedCategory !== 'all' && t.categoryId !== selectedCategory) return false
            if (selectedAccount !== 'all' && t.accountId !== selectedAccount) return false
            return true
        })
    }

    const allExpenses = sortTransactions(filterTransactions(transactions.filter(t => t.type === 'expense')))
    const allIncome = sortTransactions(filterTransactions(transactions.filter(t => t.type === 'income')))

    const expenses = allExpenses.slice(0, visibleExpensesCount)
    const income = allIncome.slice(0, visibleIncomeCount)

    const handleSearchBoletos = () => {
        setIsSearching(true)
        setTimeout(() => {
            setIsSearching(false)
            alert("Nenhum boleto encontrado no CPF (Simulação).")
        }, 3000)
    }

    const getCategoryColor = (id: string) => {
        return categories.find(c => c.id === id)?.color || '#ccc'
    }

    const getCategoryName = (id: string) => {
        return categories.find(c => c.id === id)?.name || 'Outros'
    }

    const TransactionItem = ({ transaction }: { transaction: typeof transactions[0] }) => (
        <Card key={transaction.id} className="overflow-hidden mb-3">
            <div className="flex items-center p-4">
                <div
                    className="h-10 w-1 rounded-full mr-4"
                    style={{ backgroundColor: getCategoryColor(transaction.categoryId) }}
                />
                <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-slate-50">{transaction.description}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-100">
                        {getCategoryName(transaction.categoryId)} • {formatDate(transaction.date)}
                    </p>
                </div>
                <div className="text-right">
                    <p className={`font-bold ${transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    {transaction.type === 'expense' && (
                        <div className="mt-1">
                            {transaction.status === 'paid' ? (
                                <Badge variant="success" className="text-[10px] px-1.5 py-0">Pago</Badge>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-[10px] px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => payBill(transaction.id)}
                                >
                                    Pagar
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )

    return (
        <div className="space-y-4 pb-24">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#39D2C0]">Minhas Contas</h2>
                <Button variant="outline" size="icon" onClick={() => setView(view === 'list' ? 'calendar' : 'list')}>
                    {view === 'list' ? <CalendarIcon className="h-4 w-4" /> : <List className="h-4 w-4" />}
                </Button>
            </div>

            <Button
                variant="secondary"
                className="w-full justify-between"
                onClick={handleSearchBoletos}
                disabled={isSearching}
            >
                <span>{isSearching ? "Buscando..." : "Buscar Boletos"}</span>
                <Search className="h-4 w-4" />
            </Button>

            <div className="flex justify-end">
                <select
                    className="text-sm border rounded-md px-2 py-1 bg-white dark:text-slate-900 w-full md:w-auto"
                    value={accountsSortOrder}
                    onChange={(e) => setAccountsSortOrder(e.target.value as any)}
                >
                    <option value="default">Padrão (A vencer)</option>
                    <option value="date-asc">Data (Antigas)</option>
                    <option value="date-desc">Data (Recentes)</option>
                    <option value="amount-asc">Valor (Menor)</option>
                    <option value="amount-desc">Valor (Maior)</option>
                </select>
            </div>

            {view === 'list' ? (
                <div className="space-y-6">
                    <div>
                        <h3
                            className="text-lg font-semibold mb-3 text-red-600 flex items-center cursor-pointer select-none"
                            onClick={() => setIsExpensesExpanded(!isExpensesExpanded)}
                        >
                            {isExpensesExpanded ? <ChevronDown className="h-5 w-5 mr-1" /> : <ChevronRight className="h-5 w-5 mr-1" />}
                            Saídas (Despesas)
                            <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{allExpenses.length}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-100"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setIsFilterModalOpen(true)
                                }}
                            >
                                <Filter className="h-4 w-4" />
                            </Button>
                        </h3>
                        {isExpensesExpanded && (
                            <div className="space-y-3">
                                {expenses.length > 0 ? (
                                    <>
                                        {expenses.map((transaction) => (
                                            <TransactionItem key={transaction.id} transaction={transaction} />
                                        ))}
                                        {visibleExpensesCount < allExpenses.length && (
                                            <Button
                                                variant="outline"
                                                className="w-full text-sm text-slate-600 dark:text-slate-100 hover:text-slate-900 border-slate-200"
                                                onClick={() => setVisibleExpensesCount(prev => prev + 5)}
                                            >
                                                Carregar mais
                                            </Button>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-slate-500 text-center py-4">Nenhuma despesa encontrada.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <h3
                            className="text-lg font-semibold mb-3 text-emerald-600 flex items-center cursor-pointer select-none"
                            onClick={() => setIsIncomeExpanded(!isIncomeExpanded)}
                        >
                            {isIncomeExpanded ? <ChevronDown className="h-5 w-5 mr-1" /> : <ChevronRight className="h-5 w-5 mr-1" />}
                            Entradas (Receitas)
                            <span className="ml-2 text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">{allIncome.length}</span>
                        </h3>
                        {isIncomeExpanded && (
                            <div className="space-y-3">
                                {income.length > 0 ? (
                                    <>
                                        {income.map((transaction) => (
                                            <TransactionItem key={transaction.id} transaction={transaction} />
                                        ))}
                                        {visibleIncomeCount < allIncome.length && (
                                            <Button
                                                variant="outline"
                                                className="w-full text-sm text-slate-600 hover:text-slate-900 border-slate-200"
                                                onClick={() => setVisibleIncomeCount(prev => prev + 5)}
                                            >
                                                Carregar mais
                                            </Button>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-slate-500 text-center py-4">Nenhuma receita encontrada.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <Calendar
                        onChange={(val) => setDate(val as Date)}
                        value={date}
                        tileContent={({ date: tileDate }) => {
                            // Check for actual transactions on this day
                            const dayTransactions = transactions.filter(t => isSameDay(parseISO(t.date), tileDate))

                            // Check for recurring transactions
                            const recurringTransactions = transactions.filter(t =>
                                t.isRecurring &&
                                t.recurrence === 'monthly' &&
                                parseISO(t.date).getDate() === tileDate.getDate() &&
                                tileDate >= parseISO(t.date)
                            )

                            const hasExpense = dayTransactions.some(t => t.type === 'expense') || recurringTransactions.some(t => t.type === 'expense')
                            const hasIncome = dayTransactions.some(t => t.type === 'income') || recurringTransactions.some(t => t.type === 'income')

                            if (!hasExpense && !hasIncome) return null

                            return (
                                <div className="flex justify-center space-x-0.5 mt-1">
                                    {hasExpense && <div className="h-1.5 w-1.5 rounded-full bg-red-500" />}
                                    {hasIncome && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                                </div>
                            )
                        }}
                    />
                    <div className="mt-4">
                        <h3 className="font-medium mb-2">Transações em {formatDate(date)}</h3>
                        <div className="space-y-2">
                            {(() => {
                                // Get actual transactions for this day
                                const dayTransactions = transactions.filter(t => isSameDay(parseISO(t.date), date))

                                // Get recurring transactions that fall on this day
                                const recurringTransactions = transactions.filter(t =>
                                    t.isRecurring &&
                                    t.recurrence === 'monthly' &&
                                    parseISO(t.date).getDate() === date.getDate() &&
                                    date >= parseISO(t.date) &&
                                    !dayTransactions.some(dt => dt.id === t.id) // Avoid duplicates if the actual transaction is already there
                                )

                                const allDayTransactions = [...dayTransactions, ...recurringTransactions]

                                if (allDayTransactions.length === 0) {
                                    return <p className="text-sm text-slate-500">Nenhuma transação neste dia.</p>
                                }

                                return allDayTransactions.map(t => (
                                    <div key={t.id} className="flex justify-between text-sm border-b pb-2">
                                        <span>{t.description} {t.isRecurring && '(Recorrente)'}</span>
                                        <span className={t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}>
                                            {formatCurrency(t.amount)}
                                        </span>
                                    </div>
                                ))
                            })()}
                        </div>
                    </div>
                </div>
            )}

            <Button
                className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg bg-[#39D2C0] hover:bg-[#0D57636C]"
                onClick={() => openTransactionModal()}
            >
                <Plus className="h-6 w-6" />
            </Button>

            <AddTransactionModal
                isOpen={isTransactionModalOpen}
                onClose={closeTransactionModal}
                defaultType={transactionModalType}
            />

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedAccount={selectedAccount}
                setSelectedAccount={setSelectedAccount}
            />
        </div>
    )
}

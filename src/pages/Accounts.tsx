import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Calendar as CalendarIcon, List } from 'lucide-react'
import { AddTransactionModal } from '@/components/AddTransactionModal'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { isSameDay, parseISO } from 'date-fns'

export default function Accounts() {
    const { transactions, categories, payBill } = useStore()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [view, setView] = useState<'list' | 'calendar'>('list')
    const [date, setDate] = useState(new Date())

    const sortedTransactions = [...transactions].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )

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

    return (
        <div className="space-y-4 pb-24">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Minhas Contas</h2>
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
                <span>{isSearching ? "Buscando..." : "Buscar Boletos (DDA)"}</span>
                <Search className="h-4 w-4" />
            </Button>

            {view === 'list' ? (
                <div className="space-y-3">
                    {sortedTransactions.map((transaction) => (
                        <Card key={transaction.id} className="overflow-hidden">
                            <div className="flex items-center p-4">
                                <div
                                    className="h-10 w-1 rounded-full mr-4"
                                    style={{ backgroundColor: getCategoryColor(transaction.categoryId) }}
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-slate-900">{transaction.description}</p>
                                    <p className="text-xs text-slate-500">
                                        {getCategoryName(transaction.categoryId)} • {formatDate(transaction.date)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
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
                    ))}
                </div>
            ) : (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <Calendar
                        onChange={(val) => setDate(val as Date)}
                        value={date}
                        tileContent={({ date: tileDate }) => {
                            const dayTransactions = transactions.filter(t => isSameDay(parseISO(t.date), tileDate))
                            if (dayTransactions.length === 0) return null

                            const hasExpense = dayTransactions.some(t => t.type === 'expense')
                            const hasIncome = dayTransactions.some(t => t.type === 'income')

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
                            {transactions
                                .filter(t => isSameDay(parseISO(t.date), date))
                                .map(t => (
                                    <div key={t.id} className="flex justify-between text-sm border-b pb-2">
                                        <span>{t.description}</span>
                                        <span className={t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}>
                                            {formatCurrency(t.amount)}
                                        </span>
                                    </div>
                                ))}
                            {transactions.filter(t => isSameDay(parseISO(t.date), date)).length === 0 && (
                                <p className="text-sm text-slate-500">Nenhuma transação neste dia.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Button
                className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg bg-slate-900 hover:bg-slate-800"
                onClick={() => setIsAddModalOpen(true)}
            >
                <Plus className="h-6 w-6" />
            </Button>

            <AddTransactionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    )
}

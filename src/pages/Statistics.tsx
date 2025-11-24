import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { startOfMonth, endOfMonth } from 'date-fns'

export default function Statistics() {
    const { transactions, categories } = useStore()
    const [debtAmount, setDebtAmount] = useState('')
    const [monthlyPayment, setMonthlyPayment] = useState('')
    const [monthsToPay, setMonthsToPay] = useState<number | null>(null)

    const today = new Date()
    const currentMonthStart = startOfMonth(today)
    const currentMonthEnd = endOfMonth(today)

    // Filter current month transactions
    const currentMonthTransactions = transactions.filter(t =>
        t.date >= currentMonthStart.toISOString() && t.date <= currentMonthEnd.toISOString()
    )

    // Calculate totals
    const totalEstimated = currentMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0)

    const totalPaid = currentMonthTransactions
        .filter(t => t.type === 'expense' && t.status === 'paid')
        .reduce((acc, t) => acc + t.amount, 0)

    // Chart Data: Expenses by Category
    const expensesByCategory = categories
        .filter(c => c.type === 'expense')
        .map(category => {
            const amount = currentMonthTransactions
                .filter(t => t.categoryId === category.id && t.type === 'expense')
                .reduce((acc, t) => acc + t.amount, 0)
            return { name: category.name, value: amount, color: category.color }
        })
        .filter(item => item.value > 0)

    // Chart Data: Income vs Expense (Mock for previous month comparison)
    const barData = [
        { name: 'Mês Passado', Receitas: 4000, Despesas: 3200 },
        {
            name: 'Atual',
            Receitas: currentMonthTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0),
            Despesas: totalEstimated
        },
    ]

    const calculatePayoff = () => {
        const debt = parseFloat(debtAmount)
        const payment = parseFloat(monthlyPayment)
        if (debt > 0 && payment > 0) {
            setMonthsToPay(Math.ceil(debt / payment))
        }
    }

    return (
        <div className="space-y-6 pb-24">
            <h2 className="text-2xl font-bold text-[#39D2C0]">Análises</h2>

            {/* Scoreboard */}
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-slate-500">Estimado (Mês)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-lg font-bold">{formatCurrency(totalEstimated)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-xs font-medium text-slate-500">Já Pago</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-lg font-bold text-emerald-600">{formatCurrency(totalPaid)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Donut Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Gastos por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expensesByCategory}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {expensesByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {expensesByCategory.map((item, index) => (
                            <div key={index} className="flex items-center text-xs">
                                <div className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                                <span className="truncate">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Comparativo Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis fontSize={12} tickFormatter={(value) => `R$${value / 1000}k`} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="Receitas" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

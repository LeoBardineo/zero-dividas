import { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { faker } from '@faker-js/faker'

interface AddTransactionModalProps {
    isOpen: boolean
    onClose: () => void
    defaultType?: 'income' | 'expense'
}

export function AddTransactionModal({ isOpen, onClose, defaultType = 'expense' }: AddTransactionModalProps) {
    const { addTransaction, categories, accounts } = useStore()
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
    const [accountId, setAccountId] = useState(accounts[0]?.id || '')
    const [type, setType] = useState<'income' | 'expense'>(defaultType)
    const [isRecurring, setIsRecurring] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setType(defaultType)
        }
    }, [isOpen, defaultType])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        addTransaction({
            id: faker.string.uuid(),
            description,
            amount: parseFloat(amount),
            date: new Date(date).toISOString(),
            categoryId,
            accountId,
            type,
            status: 'pending',
            isRecurring: isRecurring,
            recurrence: isRecurring ? 'monthly' : undefined,
        })

        onClose()
        // Reset form
        setDescription('')
        setAmount('')
        setDate(new Date().toISOString().split('T')[0])
        setIsRecurring(false)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nova Transação">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-2">
                    <Button
                        type="button"
                        variant={type === 'expense' ? 'destructive' : 'outline'}
                        className="flex-1"
                        onClick={() => setType('expense')}
                    >
                        Despesa
                    </Button>
                    <Button
                        type="button"
                        variant={type === 'income' ? 'default' : 'outline'}
                        className={type === 'income' ? 'bg-emerald-500 hover:bg-emerald-600 flex-1' : 'flex-1'}
                        onClick={() => setType('income')}
                    >
                        Receita
                    </Button>
                </div>

                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex-1">
                        <label className="text-sm font-medium block mb-1">Frequência</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="recurrence"
                                    checked={isRecurring}
                                    onChange={() => setIsRecurring(true)}
                                    className="text-emerald-500 focus:ring-emerald-500"
                                />
                                <span className="text-sm text-slate-700">Recorrente</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="recurrence"
                                    checked={!isRecurring}
                                    onChange={() => setIsRecurring(false)}
                                    className="text-emerald-500 focus:ring-emerald-500"
                                />
                                <span className="text-sm text-slate-700">Extraordinária</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Descrição</label>
                    <Input
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ex: Supermercado"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Valor</label>
                    <Input
                        required
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0,00"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Data</label>
                    <Input
                        required
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Categoria</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        {categories.filter(c => c.type === type).map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Conta</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                    >
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                                {account.bankName}
                            </option>
                        ))}
                    </select>
                </div>

                <Button type="submit" className="w-full">
                    Salvar
                </Button>
            </form>
        </Modal>
    )
}

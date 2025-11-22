import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { faker } from '@faker-js/faker'

interface AddTransactionModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
    const { addTransaction, categories, accounts } = useStore()
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
    const [accountId, setAccountId] = useState(accounts[0]?.id || '')
    const [type, setType] = useState<'income' | 'expense'>('expense')

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
            isRecurring: false,
        })

        onClose()
        // Reset form
        setDescription('')
        setAmount('')
        setDate(new Date().toISOString().split('T')[0])
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

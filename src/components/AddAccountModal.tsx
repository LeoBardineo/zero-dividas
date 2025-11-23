import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Account } from '@/utils/mockData'

interface AddAccountModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AddAccountModal({ isOpen, onClose }: AddAccountModalProps) {
    const { addAccount } = useStore()
    const [bankName, setBankName] = useState('')
    const [balance, setBalance] = useState('')
    const [type, setType] = useState<Account['type']>('checking')
    const [color, setColor] = useState('#3b82f6') // Default blue

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!bankName || !balance) return

        const newAccount: Account = {
            id: crypto.randomUUID(),
            bankName,
            balance: parseFloat(balance),
            color,
            type
        }

        addAccount(newAccount)

        // Reset form
        setBankName('')
        setBalance('')
        setType('checking')
        setColor('#3b82f6')

        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Nova Conta">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="bankName" className="text-sm font-medium">Nome do Banco / Instituição</label>
                    <Input
                        id="bankName"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="Ex: Nubank, Itaú, Carteira"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="balance" className="text-sm font-medium">Saldo Atual</label>
                    <Input
                        id="balance"
                        type="number"
                        step="0.01"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        placeholder="0,00"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="type" className="text-sm font-medium">Tipo de Conta</label>
                    <select
                        id="type"
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                        value={type}
                        onChange={(e) => setType(e.target.value as Account['type'])}
                    >
                        <option value="checking">Conta Corrente</option>
                        <option value="savings">Poupança</option>
                        <option value="investment">Investimento</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="color" className="text-sm font-medium">Cor do Cartão</label>
                    <div className="flex gap-2 flex-wrap">
                        {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'].map((c) => (
                            <button
                                key={c}
                                type="button"
                                className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-slate-900' : 'border-transparent'}`}
                                style={{ backgroundColor: c }}
                                onClick={() => setColor(c)}
                            />
                        ))}
                    </div>
                </div>

                <div className="pt-4 flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit">
                        Adicionar Conta
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

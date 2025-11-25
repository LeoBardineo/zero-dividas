import { useStore } from '@/store/useStore'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'

interface FilterModalProps {
    isOpen: boolean
    onClose: () => void
    selectedCategory: string
    setSelectedCategory: (value: string) => void
    selectedAccount: string
    setSelectedAccount: (value: string) => void
}

export function FilterModal({
    isOpen,
    onClose,
    selectedCategory,
    setSelectedCategory,
    selectedAccount,
    setSelectedAccount
}: FilterModalProps) {
    const { categories, accounts } = useStore()

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Filtrar Transações">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Categoria</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white dark:bg-slate-200 dark:text-slate-600 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">Todas Categorias</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Conta</label>
                    <select
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white dark:bg-slate-200 dark:text-slate-600 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                        value={selectedAccount}
                        onChange={(e) => setSelectedAccount(e.target.value)}
                    >
                        <option value="all">Todas Contas</option>
                        {accounts.map(a => (
                            <option key={a.id} value={a.id}>{a.bankName}</option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => {
                        setSelectedCategory('all')
                        setSelectedAccount('all')
                    }}>
                        Limpar
                    </Button>
                    <Button onClick={onClose}>
                        Aplicar
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

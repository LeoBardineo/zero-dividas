import { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Category } from '@/utils/mockData'

interface CategoryModalProps {
    isOpen: boolean
    onClose: () => void
    categoryToEdit?: Category | null
}

export function CategoryModal({ isOpen, onClose, categoryToEdit }: CategoryModalProps) {
    const { addCategory, updateCategory } = useStore()
    const [name, setName] = useState('')
    const [color, setColor] = useState('#3b82f6')
    const [type, setType] = useState<Category['type']>('expense')

    useEffect(() => {
        if (categoryToEdit) {
            setName(categoryToEdit.name)
            setColor(categoryToEdit.color)
            setType(categoryToEdit.type)
        } else {
            setName('')
            setColor('#3b82f6')
            setType('expense')
        }
    }, [categoryToEdit, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!name) return

        if (categoryToEdit) {
            updateCategory(categoryToEdit.id, { name, color, type })
        } else {
            const newCategory: Category = {
                id: crypto.randomUUID(),
                name,
                color,
                type
            }
            addCategory(newCategory)
        }

        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={categoryToEdit ? "Editar Categoria" : "Nova Categoria"}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Nome da Categoria</label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Alimentação, Transporte"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="type" className="text-sm font-medium">Tipo</label>
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
                </div>

                <div className="space-y-2">
                    <label htmlFor="color" className="text-sm font-medium">Cor</label>
                    <div className="flex gap-2 flex-wrap">
                        {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6', '#64748b'].map((c) => (
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
                        {categoryToEdit ? 'Salvar Alterações' : 'Criar Categoria'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

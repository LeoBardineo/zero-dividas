import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { CategoryModal } from './CategoryModal'
import { Category } from '@/utils/mockData'
import { formatCurrency } from '@/lib/utils'

export function CategoryList() {
    const { categories, deleteCategory, transactions } = useStore()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)

    const handleEdit = (category: Category) => {
        setEditingCategory(category)
        setIsModalOpen(true)
    }

    const handleDelete = (id: string) => {
        if (categories.length <= 1) {
            alert('Você deve ter pelo menos uma categoria.')
            return
        }

        if (confirm('Tem certeza que deseja excluir esta categoria?')) {
            deleteCategory(id)
        }
    }

    const handleAddNew = () => {
        setEditingCategory(null)
        setIsModalOpen(true)
    }

    const getCategoryTotal = (categoryId: string) => {
        return transactions
            .filter(t => t.categoryId === categoryId)
            .reduce((acc, t) => acc + t.amount, 0)
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Categorias</h3>
                <Button variant="ghost" size="sm" className="text-xs h-8" onClick={handleAddNew}>
                    <Plus className="h-4 w-4 mr-1" />
                    Nova
                </Button>
            </div>

            <div className="space-y-3">
                {categories.map((category) => {
                    const total = getCategoryTotal(category.id)
                    return (
                        <Card key={category.id} className="overflow-hidden">
                            <CardContent className="p-3 flex items-center justify-between">
                                <div className="flex items-center space-x-3 overflow-hidden">
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: category.color }}
                                    />
                                    <div>
                                        <p className="text-sm font-medium truncate dark:text-slate-100">
                                            {category.name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {formatCurrency(total)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-400 hover:text-slate-600"
                                        onClick={() => handleEdit(category)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-400 hover:text-red-500"
                                        onClick={() => handleDelete(category.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                categoryToEdit={editingCategory}
            />
        </div>
    )
}

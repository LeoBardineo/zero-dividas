import { Home, Wallet, PieChart } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomNavProps {
    activeTab: 'home' | 'accounts' | 'statistics'
    onTabChange: (tab: 'home' | 'accounts' | 'statistics') => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white pb-safe pt-2 shadow-lg">
            <div className="flex justify-around pb-2">
                <button
                    onClick={() => onTabChange('home')}
                    className={cn(
                        "flex flex-col items-center justify-center space-y-1 p-2 transition-colors",
                        activeTab === 'home' ? "text-[#39D2C0]" : "text-slate-400 hover:text-[#0D57636C]"
                    )}
                >
                    <Home className="h-6 w-6" />
                    <span className="text-xs font-medium">Início</span>
                </button>
                <button
                    onClick={() => onTabChange('accounts')}
                    className={cn(
                        "flex flex-col items-center justify-center space-y-1 p-2 transition-colors",
                        activeTab === 'accounts' ? "text-[#39D2C0]" : "text-slate-400 hover:text-[#0D57636C]"
                    )}
                >
                    <Wallet className="h-6 w-6" />
                    <span className="text-xs font-medium">Contas</span>
                </button>
                <button
                    onClick={() => onTabChange('statistics')}
                    className={cn(
                        "flex flex-col items-center justify-center space-y-1 p-2 transition-colors",
                        activeTab === 'statistics' ? "text-[#39D2C0]" : "text-slate-400 hover:text-[#0D57636C]"
                    )}
                >
                    <PieChart className="h-6 w-6" />
                    <span className="text-xs font-medium">Análises</span>
                </button>
            </div>
        </div>
    )
}

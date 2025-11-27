import { useEffect } from 'react'
import { useStore } from '@/store/useStore'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import Accounts from '@/pages/Accounts'
import Statistics from '@/pages/Statistics'
import { BottomNav } from '@/components/BottomNav'

function App(): JSX.Element {
    const { isAuthenticated, activeTab, setActiveTab } = useStore()

    // Reset tab on logout
    useEffect(() => {
        if (!isAuthenticated) {
            setActiveTab('home')
        }
    }, [isAuthenticated, setActiveTab])

    if (!isAuthenticated) {
        return <Login />
    }

    return (
        <div className="min-h-screen bg-[#0D57636C] dark:bg-[#0B494F] text-slate-900 dark:text-white font-sans">
            <main className="container max-w-xl mx-auto min-h-screen bg-white dark:bg-[#1C1C1C] shadow-xl relative px-4 pt-6">
                {activeTab === 'home' && <Home />}
                {activeTab === 'accounts' && <Accounts />}
                {activeTab === 'statistics' && <Statistics />}
            </main>
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    )
}

export default App

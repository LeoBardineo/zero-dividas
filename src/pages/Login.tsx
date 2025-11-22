import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet } from 'lucide-react'

export default function Login() {
    const login = useStore((state) => state.login)
    const [loading, setLoading] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            login()
            setLoading(false)
        }, 1000)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-slate-900 p-3">
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Zero Dívidas</CardTitle>
                    <CardDescription>
                        Entre para gerenciar suas finanças
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="seu@email.com"
                                required
                                defaultValue="demo@zerodividas.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Sua senha"
                                required
                                defaultValue="password"
                            />
                        </div>
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? 'Entrando...' : 'Entrar'}
                        </Button>
                        <div className="text-center text-sm text-slate-500">
                            Não tem uma conta?{' '}
                            <a href="#" className="font-semibold text-slate-900 hover:underline">
                                Criar conta
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

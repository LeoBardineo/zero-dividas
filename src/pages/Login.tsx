import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet } from 'lucide-react'

export default function Login() {
    const { login, signup } = useStore()
    const [loading, setLoading] = useState(false)
    const [isLogin, setIsLogin] = useState(true)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        setTimeout(() => {
            if (isLogin) {
                const success = login(email || "demo@zerodividas.com", password || "password")
                if (!success) {
                    alert("Usuário ou senha inválidos!")
                }
            } else {
                const success = signup(name, email, password)
                if (success) {
                    alert("Conta criada com sucesso! Faça login.")
                    setIsLogin(true)
                    setPassword('') // Clear password for security
                } else {
                    alert("Erro ao criar conta. Email já existe?")
                }
            }
            setLoading(false)
        }, 1000)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0D57636C] dark:bg-[#0B494F] p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-[#0D57636C] p-3">
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl text-[#39D2C0]">Zero Dívidas</CardTitle>
                    <CardDescription>
                        {isLogin ? 'Entre para gerenciar suas finanças' : 'Crie sua conta gratuitamente'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    placeholder="Seu nome"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="seu@email.com"
                                required
                                defaultValue={isLogin ? "demo@zerodividas.com" : email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Sua senha"
                                required
                                defaultValue={isLogin ? "password" : password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? (isLogin ? 'Entrando...' : 'Criando conta...') : (isLogin ? 'Entrar' : 'Criar Conta')}
                        </Button>
                        <div className="text-center text-sm text-slate-500">
                            {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="font-semibold text-[#39D2C0] hover:underline"
                            >
                                {isLogin ? 'Criar conta' : 'Entrar'}
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

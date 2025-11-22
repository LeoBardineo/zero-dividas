import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Account, Transaction, Category, generateMockData } from '../utils/mockData';

interface AppState {
    user: User | null;
    accounts: Account[];
    transactions: Transaction[];
    categories: Category[];
    isAuthenticated: boolean;
    registeredUsers: any[]; // In a real app, don't store passwords in plain text!

    login: (email: string, password: string) => boolean;
    signup: (name: string, email: string, password: string) => boolean;
    logout: () => void;
    addTransaction: (transaction: Transaction) => void;
    updateTransaction: (id: string, updates: Partial<Transaction>) => void;
    deleteTransaction: (id: string) => void;
    addAccount: (account: Account) => void;
    addCategory: (category: Category) => void;
    payBill: (transactionId: string) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            user: null,
            accounts: [],
            transactions: [],
            categories: [],
            isAuthenticated: false,
            registeredUsers: [],

            login: (email, password) => {
                const { registeredUsers } = get();

                // Demo login
                if (email === 'demo@zerodividas.com' && password === 'password') {
                    const { user } = get();
                    if (!user || user.email !== 'demo@zerodividas.com') {
                        const data = generateMockData();
                        set({
                            user: { ...data.user, email: 'demo@zerodividas.com' }, // Ensure email matches
                            accounts: data.accounts,
                            transactions: data.transactions,
                            categories: data.categories,
                            isAuthenticated: true,
                        });
                    } else {
                        set({ isAuthenticated: true });
                    }
                    return true;
                }

                // Registered user login
                const registeredUser = registeredUsers.find(u => u.email === email && u.password === password);
                if (registeredUser) {
                    set({
                        user: {
                            id: registeredUser.id,
                            name: registeredUser.name,
                            email: registeredUser.email,
                            avatar: '',
                        },
                        accounts: [], // Empty for new users
                        transactions: [],
                        categories: [], // Should probably have default categories
                        isAuthenticated: true,
                    });
                    return true;
                }

                return false;
            },

            signup: (name, email, password) => {
                const { registeredUsers } = get();
                if (registeredUsers.some(u => u.email === email)) {
                    return false; // Email already exists
                }

                const newUser = {
                    id: crypto.randomUUID(),
                    name,
                    email,
                    password,
                };

                set({
                    registeredUsers: [...registeredUsers, newUser],
                });
                return true;
            },

            logout: () => set({ isAuthenticated: false }),

            addTransaction: (transaction) =>
                set((state) => ({ transactions: [...state.transactions, transaction] })),

            updateTransaction: (id, updates) =>
                set((state) => ({
                    transactions: state.transactions.map((t) =>
                        t.id === id ? { ...t, ...updates } : t
                    ),
                })),

            deleteTransaction: (id) =>
                set((state) => ({
                    transactions: state.transactions.filter((t) => t.id !== id),
                })),

            addAccount: (account) =>
                set((state) => ({ accounts: [...state.accounts, account] })),

            addCategory: (category) =>
                set((state) => ({ categories: [...state.categories, category] })),

            payBill: (transactionId) =>
                set((state) => ({
                    transactions: state.transactions.map((t) =>
                        t.id === transactionId ? { ...t, status: 'paid' } : t
                    ),
                })),
        }),
        {
            name: 'zero-dividas-storage',
        }
    )
);

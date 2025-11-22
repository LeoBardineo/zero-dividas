import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Account, Transaction, Category, generateMockData } from '../utils/mockData';

interface AppState {
    user: User | null;
    accounts: Account[];
    transactions: Transaction[];
    categories: Category[];
    isAuthenticated: boolean;

    login: () => void;
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

            login: () => {
                const { user } = get();
                if (!user) {
                    // First time login, generate mock data
                    const data = generateMockData();
                    set({
                        user: data.user,
                        accounts: data.accounts,
                        transactions: data.transactions,
                        categories: data.categories,
                        isAuthenticated: true,
                    });
                } else {
                    set({ isAuthenticated: true });
                }
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

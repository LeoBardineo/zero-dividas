import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Account, Transaction, Category, generateMockData, CATEGORIES } from '../utils/mockData';

interface AppState {
    user: User | null;
    accounts: Account[];
    transactions: Transaction[];
    categories: Category[];
    isAuthenticated: boolean;
    registeredUsers: any[]; // In a real app, don't store passwords in plain text!

    // Navigation & UI State
    activeTab: 'home' | 'accounts' | 'statistics';
    setActiveTab: (tab: 'home' | 'accounts' | 'statistics') => void;

    // Global Modal State
    isTransactionModalOpen: boolean;
    transactionModalType: 'income' | 'expense';
    openTransactionModal: (type?: 'income' | 'expense') => void;
    closeTransactionModal: () => void;

    isAddAccountModalOpen: boolean;
    openAddAccountModal: () => void;
    closeAddAccountModal: () => void;

    // Accounts Sort State
    accountsSortOrder: 'default' | 'date-asc' | 'date-desc' | 'amount-asc' | 'amount-desc';
    setAccountsSortOrder: (order: 'default' | 'date-asc' | 'date-desc' | 'amount-asc' | 'amount-desc') => void;

    login: (email: string, password: string) => boolean;
    signup: (name: string, email: string, password: string) => boolean;
    logout: () => void;

    addTransaction: (transaction: Transaction) => void;
    updateTransaction: (id: string, updates: Partial<Transaction>) => void;
    deleteTransaction: (id: string) => void;
    addAccount: (account: Account) => void;
    updateAccount: (id: string, updates: Partial<Account>) => void;
    deleteAccount: (id: string) => void;
    addCategory: (category: Category) => void;
    updateCategory: (id: string, updates: Partial<Category>) => void;
    deleteCategory: (id: string) => void;
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

            // Initial UI State
            activeTab: 'home',
            isTransactionModalOpen: false,
            transactionModalType: 'expense',

            setActiveTab: (tab) => set({ activeTab: tab }),

            openTransactionModal: (type = 'expense') => set({
                isTransactionModalOpen: true,
                transactionModalType: type
            }),

            closeTransactionModal: () => set({ isTransactionModalOpen: false }),

            isAddAccountModalOpen: false,
            openAddAccountModal: () => set({ isAddAccountModalOpen: true }),
            closeAddAccountModal: () => set({ isAddAccountModalOpen: false }),

            accountsSortOrder: 'default',
            setAccountsSortOrder: (order) => set({ accountsSortOrder: order }),

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
                        categories: CATEGORIES,
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

            updateAccount: (id, updates) =>
                set((state) => ({
                    accounts: state.accounts.map((a) =>
                        a.id === id ? { ...a, ...updates } : a
                    ),
                })),

            deleteAccount: (id) =>
                set((state) => ({
                    accounts: state.accounts.filter((a) => a.id !== id),
                })),

            addCategory: (category) =>
                set((state) => ({ categories: [...state.categories, category] })),

            updateCategory: (id, updates) =>
                set((state) => ({
                    categories: state.categories.map((c) =>
                        c.id === id ? { ...c, ...updates } : c
                    ),
                })),

            deleteCategory: (id) =>
                set((state) => ({
                    categories: state.categories.filter((c) => c.id !== id),
                })),

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

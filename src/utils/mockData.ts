import { fakerPT_BR as faker } from '@faker-js/faker';
import { addMonths, subMonths, startOfMonth, endOfMonth, isBefore } from 'date-fns';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

export interface Account {
    id: string;
    bankName: string;
    balance: number;
    color: string;
    type: 'checking' | 'savings' | 'investment';
}

export interface Category {
    id: string;
    name: string;
    color: string;
    type: 'income' | 'expense';
}

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string; // ISO string
    categoryId: string;
    accountId: string;
    type: 'income' | 'expense';
    status: 'paid' | 'pending';
    isRecurring: boolean;
    recurrence?: 'monthly' | 'yearly';
}

export const BANKS = [
    { name: 'Nubank', color: '#820AD1' },
    { name: 'Inter', color: '#FF7A00' },
    { name: 'Itaú', color: '#EC7000' },
    { name: 'Bradesco', color: '#CC092F' },
    { name: 'Santander', color: '#EC0000' },
    { name: 'Caixa', color: '#005CA9' },
    { name: 'Banco do Brasil', color: '#F8D117' },
];

export const CATEGORIES: Category[] = [
    { id: '1', name: 'Alimentação', color: '#FF5733', type: 'expense' },
    { id: '2', name: 'Transporte', color: '#33FF57', type: 'expense' },
    { id: '3', name: 'Moradia', color: '#3357FF', type: 'expense' },
    { id: '4', name: 'Lazer', color: '#FF33A1', type: 'expense' },
    { id: '5', name: 'Saúde', color: '#33FFF5', type: 'expense' },
    { id: '6', name: 'Salário', color: '#57FF33', type: 'income' },
    { id: '7', name: 'Freelance', color: '#FFD700', type: 'income' },
];

export const generateMockData = () => {
    const user: User = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
    };

    const accounts: Account[] = Array.from({ length: 3 }).map(() => {
        const bank = faker.helpers.arrayElement(BANKS);
        return {
            id: faker.string.uuid(),
            bankName: bank.name,
            balance: parseFloat(faker.finance.amount({ min: 100, max: 5000, dec: 2 })),
            color: bank.color,
            type: 'checking',
        };
    });

    const transactions: Transaction[] = [];
    const today = new Date();
    const startDate = subMonths(startOfMonth(today), 2); // 3 months ago (current + 2 previous)
    const endDate = addMonths(endOfMonth(today), 1); // Up to next month

    // Generate recurring salary
    for (let i = 0; i < 4; i++) {
        const date = addMonths(startDate, i);
        date.setDate(5); // 5th of each month
        transactions.push({
            id: faker.string.uuid(),
            description: 'Salário Mensal',
            amount: parseFloat(faker.finance.amount({ min: 3000, max: 5000, dec: 2 })),
            date: date.toISOString(),
            categoryId: '6', // Salário
            accountId: accounts[0].id,
            type: 'income',
            status: isBefore(date, today) ? 'paid' : 'pending',
            isRecurring: true,
            recurrence: 'monthly',
        });
    }

    // Generate random expenses
    for (let i = 0; i < 50; i++) {
        const date = faker.date.between({ from: startDate, to: endDate });
        const category = faker.helpers.arrayElement(CATEGORIES.filter(c => c.type === 'expense'));
        const account = faker.helpers.arrayElement(accounts);
        const amount = parseFloat(faker.finance.amount({ min: 10, max: 500, dec: 2 }));

        transactions.push({
            id: faker.string.uuid(),
            description: faker.commerce.productName(),
            amount,
            date: date.toISOString(),
            categoryId: category.id,
            accountId: account.id,
            type: 'expense',
            status: isBefore(date, today) ? 'paid' : 'pending',
            isRecurring: false,
        });
    }

    return { user, accounts, transactions, categories: CATEGORIES };
};

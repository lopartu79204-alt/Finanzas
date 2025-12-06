export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: 'Alimentos' | 'Transporte' | 'Hogar' | 'Entretenimiento' | 'Salud' | 'Ingreso' | 'Deuda';
  type: 'expense' | 'income';
}

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  interestRate: number; // Annual
  monthlyPayment: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  icon?: string; // 'car', 'house', 'vacation'
}

export interface UserProfile {
  name: string;
  email: string;
  monthlyIncome: number;
}

export enum ViewState {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD'
}

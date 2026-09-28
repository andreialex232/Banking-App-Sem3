export type Plan = 'free' | 'premium'

export interface BankAccount {
    $id: string;
    userId: string;
    plan: Plan;
    eur: number;
    dkk: number | null;
    sek: number | null;
    pln: number | null;
    dailyDepositedEur: number | null;
    dailyDepositDate: string | null;
}
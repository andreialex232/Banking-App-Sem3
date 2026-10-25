export type Plan = 'free' | 'premium';

const DAILY_DEPOSIT_LIMIT_EUR: Record<Plan, number> = {
    free: 100_000,
    premium: 500_000,
};

export function dailyDepositLimitFor(plan: Plan | undefined): number {
    return DAILY_DEPOSIT_LIMIT_EUR[plan ?? 'free'] ?? DAILY_DEPOSIT_LIMIT_EUR.free;
}
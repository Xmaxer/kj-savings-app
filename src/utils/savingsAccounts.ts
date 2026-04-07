import slope from './slope';
import intersect from './intersect';

export const BankType = {
	FINTECH: 'FINTECH',
	TRADITIONAL_BANK: 'TRADITIONAL_BANK'
} as const;

export type BankType = keyof typeof BankType;

export interface SavingsAccount {
	name: string;
	interestRate: number;
	tax: number;
	yearlyAccountCost?: number;
	cashLimit?: number;
	paymentFrequency: number;
	color: string;
	dashed?: boolean;
	numberOfYears: number;
	slope: number;
	bankType: BankType;
	interestEarnedOnAmount: (amount: number, options?: InterestEarnedOnAmountOptions) => number;
}

function defaultSlopeCalc(this: SavingsAccount) {
	const defaultCashLimit = 100000;
	return slope(
		[0, -(this.yearlyAccountCost ?? 0)],
		[
			this.cashLimit ?? defaultCashLimit,
			this.interestEarnedOnAmount(this.cashLimit ?? defaultCashLimit)
		]
	);
}

export interface InterestEarnedOnAmountOptions {
	taxEnabled?: boolean;
}

function defaultInterestEarnedOnAmount(
	this: SavingsAccount,
	amount: number,
	options?: InterestEarnedOnAmountOptions
) {
	const effectiveInterestRate =
		this.interestRate - (options?.taxEnabled ? this.interestRate * this.tax : 0);
	const cappedAmount = Math.min(amount, this.cashLimit ?? amount);

	return (
		cappedAmount *
			(1 + effectiveInterestRate / this.paymentFrequency) **
				(this.paymentFrequency * this.numberOfYears) -
		(this.yearlyAccountCost ?? 0) -
		cappedAmount
	);
}

export function savingsIntersect(
	accountA: SavingsAccount,
	accountB: SavingsAccount,
	options: Required<InterestEarnedOnAmountOptions>
) {
	const defaultLimit = 100000;
	const defaultYearlyCost = 0;
	return intersect(
		0,
		-(accountA.yearlyAccountCost ?? defaultYearlyCost),
		accountA.cashLimit ?? defaultLimit,
		accountA.interestEarnedOnAmount(accountA.cashLimit ?? defaultLimit, options),
		0,
		-(accountB.yearlyAccountCost || defaultYearlyCost),
		accountB.cashLimit ?? defaultLimit,
		accountB.interestEarnedOnAmount(accountB.cashLimit ?? defaultLimit, options)
	);
}

export const savingsAccounts: Array<SavingsAccount> = [
	{
		name: 'Revolut Standard',
		interestRate: 0.015,
		tax: 0.33,
		cashLimit: 100000,
		paymentFrequency: 365,
		color: '#dbeafe',
		dashed: true,
		numberOfYears: 1,
		bankType: BankType.FINTECH,
		get slope() {
			return defaultSlopeCalc.call(this);
		},
		interestEarnedOnAmount: defaultInterestEarnedOnAmount
	},
	{
		name: 'Revolut Plus',
		interestRate: 0.015,
		tax: 0.33,
		cashLimit: 100000,
		paymentFrequency: 365,
		yearlyAccountCost: 40,
		color: '#bfdbfe',
		dashed: true,
		numberOfYears: 1,
		bankType: BankType.FINTECH,
		get slope() {
			return defaultSlopeCalc.call(this);
		},
		interestEarnedOnAmount: defaultInterestEarnedOnAmount
	},
	{
		name: 'Revolut Premium',
		interestRate: 0.0175,
		tax: 0.33,
		cashLimit: 100000,
		paymentFrequency: 365,
		yearlyAccountCost: 90,
		color: '#93c5fd',
		dashed: true,
		numberOfYears: 1,
		bankType: BankType.FINTECH,
		get slope() {
			return defaultSlopeCalc.call(this);
		},
		interestEarnedOnAmount: defaultInterestEarnedOnAmount
	},
	{
		name: 'Revolut Metal',
		interestRate: 0.02,
		tax: 0.33,
		cashLimit: 100000,
		paymentFrequency: 365,
		yearlyAccountCost: 155,
		color: '#60a5fa',
		dashed: true,
		numberOfYears: 1,
		bankType: BankType.FINTECH,
		get slope() {
			return defaultSlopeCalc.call(this);
		},
		interestEarnedOnAmount: defaultInterestEarnedOnAmount
	},
	{
		name: 'Revolut Ultra',
		interestRate: 0.0225,
		tax: 0.33,
		cashLimit: 100000,
		paymentFrequency: 365,
		yearlyAccountCost: 540,
		color: '#3b82f6',
		numberOfYears: 1,
		bankType: BankType.FINTECH,
		get slope() {
			return defaultSlopeCalc.call(this);
		},
		interestEarnedOnAmount: defaultInterestEarnedOnAmount
	},
	{
		name: 'Bunq',
		interestRate: 0.0151,
		tax: 0.33,
		cashLimit: 100000,
		paymentFrequency: 365,
		color: '#fb923c',
		numberOfYears: 1,
		bankType: BankType.FINTECH,
		get slope() {
			return defaultSlopeCalc.call(this);
		},
		interestEarnedOnAmount: defaultInterestEarnedOnAmount
	},
	{
		name: 'Trading 212',
		interestRate: 0.03,
		tax: 0.41,
		paymentFrequency: 365,
		color: '#34d399',
		numberOfYears: 1,
		bankType: BankType.FINTECH,
		get slope() {
			return defaultSlopeCalc.call(this);
		},
		interestEarnedOnAmount: defaultInterestEarnedOnAmount
	},
	{
		name: 'Trade Republic',
		interestRate: 0.02,
		tax: 0.33,
		paymentFrequency: 365,
		cashLimit: 50000,
		color: '#a78bfa',
		numberOfYears: 1,
		bankType: BankType.FINTECH,
		get slope() {
			return defaultSlopeCalc.call(this);
		},
		interestEarnedOnAmount: defaultInterestEarnedOnAmount
	},
	{
		name: 'PTSB Regular saver',
		interestRate: 0.02,
		tax: 0.33,
		paymentFrequency: 1,
		cashLimit: 50000,
		color: '#f472b6',
		numberOfYears: 1,
		bankType: BankType.TRADITIONAL_BANK,
		get slope() {
			return defaultSlopeCalc.call(this);
		},
		interestEarnedOnAmount: defaultInterestEarnedOnAmount
	},
	{
		name: 'PTSB Fixed Term 1 year',
		interestRate: 0.02,
		tax: 0.33,
		paymentFrequency: 1,
		color: '#facc15',
		numberOfYears: 1,
		bankType: BankType.TRADITIONAL_BANK,
		get slope() {
			return defaultSlopeCalc.call(this);
		},
		interestEarnedOnAmount: defaultInterestEarnedOnAmount
	}
];

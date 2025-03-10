import slope from "./slope";
import intersect from "./intersect";

interface SavingsAccount {
    name: string;
    interestRate: number;
    tax: number;
    yearlyAccountCost?: number;
    cashLimit?: number;
    paymentCycle: number;
    color: string;
    numberOfYears: number;
    slope: number;
    interestEarnedOnAmount: (amount: number) => number
}


// function getIntercept(accountA: SavingsAccount, accountB: SavingsAccount) {
//     const x1 = 0
//     const y1 = -(accountA.yearlyAccountCost ?? 0)
//     const x2 = 0
//     const y2 = -(accountB.yearlyAccountCost ?? 0)
//
//     const slope1 = accountA.slope
//     const slope2 = accountB.slope
//
//     //y=m(x−x1)+y1
//     //y=m(x-x2)+y2
//     //m(x−x1)+y1
//     /**
//      * y = m1(x-x2)+y2
//      * y = m2(x) - m2(x1) + y2
//      * m2(x) - m2(x2) + y2 = m1(x) - m1(x1) + y1
//      * m2(x) + m1(x) = -m1(x1) + y1 -y2 + m2(x2)
//      * x = ((-m1(x1) + y1 -y2 + m2(x2))/m)/2
//      */
//     const intersectY = ()
// }

export function savingsIntersect(accountA: SavingsAccount, accountB: SavingsAccount) {
    const defaultLimit = 100000
    const defaultYearlyCost = 0;
    return intersect(0,-(accountA.yearlyAccountCost ?? defaultYearlyCost),accountA.cashLimit ?? defaultLimit, accountA.interestEarnedOnAmount(accountA.cashLimit ?? defaultLimit), 0,-(accountB.yearlyAccountCost || defaultYearlyCost), accountB.cashLimit ?? defaultLimit, accountB.interestEarnedOnAmount(accountB.cashLimit ?? defaultLimit))

}
export const savingsAccounts: Array<SavingsAccount> = [
    {
        name: "Revolut Standard",
        interestRate: 0.017,
        tax: 0.33,
        cashLimit: 100000,
        paymentCycle: 365,
        color: '#ff0000',
        numberOfYears: 1,
        get slope() {
            return slope([0,0], [this.cashLimit as number, this.interestEarnedOnAmount(this.cashLimit as number)])
        },
        interestEarnedOnAmount(amount: number) {
            const effectiveInterestRate = this.interestRate - (this.interestRate*this.tax)
            const cappedAmount = Math.min(amount,this.cashLimit as number);

            return (cappedAmount*(1 + (effectiveInterestRate/this.paymentCycle))**(this.paymentCycle*this.numberOfYears))-(this.yearlyAccountCost ?? 0)-cappedAmount
        }
    },
    {
        name: "Revolut Plus",
        interestRate: 0.017,
        tax: 0.33,
        cashLimit: 100000,
        paymentCycle: 365,
        yearlyAccountCost: 40,
        color: '#000eff',
        numberOfYears: 1,
        get slope() {
            return slope([0,-(this.yearlyAccountCost as number)], [this.cashLimit as number, this.interestEarnedOnAmount(this.cashLimit as number)])
        },
        interestEarnedOnAmount(amount: number) {
            const effectiveInterestRate = this.interestRate - (this.interestRate*this.tax)
            const cappedAmount = Math.min(amount,this.cashLimit as number);

            return (cappedAmount*(1 + (effectiveInterestRate/this.paymentCycle))**(this.paymentCycle*this.numberOfYears))-(this.yearlyAccountCost ?? 0)-cappedAmount
        }
    },
    {
        name: "Revolut Premium",
        interestRate: 0.021,
        tax: 0.33,
        cashLimit: 100000,
        paymentCycle: 365,
        yearlyAccountCost: 90,
        color: '#7cff00',
        numberOfYears: 1,
        get slope() {
            return slope([0,-(this.yearlyAccountCost as number)], [this.cashLimit as number, this.interestEarnedOnAmount(this.cashLimit as number)])
        },
        interestEarnedOnAmount(amount: number) {
            const effectiveInterestRate = this.interestRate - (this.interestRate*this.tax)
            const cappedAmount = Math.min(amount,this.cashLimit as number);

            return (cappedAmount*(1 + (effectiveInterestRate/this.paymentCycle))**(this.paymentCycle*this.numberOfYears))-(this.yearlyAccountCost ?? 0)-cappedAmount
        }
    },
    {
        name: "Revolut Metal",
        interestRate: 0.025,
        tax: 0.33,
        cashLimit: 100000,
        paymentCycle: 365,
        yearlyAccountCost: 155,
        color: '#ffb90c',
        numberOfYears: 1,
        get slope() {
            return slope([0,-(this.yearlyAccountCost as number)], [this.cashLimit as number, this.interestEarnedOnAmount(this.cashLimit as number)])
        },
        interestEarnedOnAmount(amount: number) {
            const effectiveInterestRate = this.interestRate - (this.interestRate*this.tax)
            const cappedAmount = Math.min(amount,this.cashLimit as number);

            return (cappedAmount*(1 + (effectiveInterestRate/this.paymentCycle))**(this.paymentCycle*this.numberOfYears))-(this.yearlyAccountCost ?? 0)-cappedAmount
        }
    },
    {
        name: "Revolut Ultra",
        interestRate: 0.03,
        tax: 0.33,
        cashLimit: 100000,
        paymentCycle: 365,
        yearlyAccountCost: 540,
        color: '#787878',
        numberOfYears: 1,
        get slope() {
            return slope([0,-(this.yearlyAccountCost as number)], [this.cashLimit as number, this.interestEarnedOnAmount(this.cashLimit as number)])
        },
        interestEarnedOnAmount(amount: number) {
            const effectiveInterestRate = this.interestRate - (this.interestRate*this.tax)
            const cappedAmount = Math.min(amount,this.cashLimit as number);

            return (cappedAmount*(1 + (effectiveInterestRate/this.paymentCycle))**(this.paymentCycle*this.numberOfYears))-(this.yearlyAccountCost ?? 0)-cappedAmount
        }
    }
]

// const y = intersect(0,0,savingsAccounts[0].cashLimit as number, savingsAccounts[0].interestEarnedOnAmount(savingsAccounts[0].cashLimit as number), 0,-(savingsAccounts[3].yearlyAccountCost as number), savingsAccounts[3].cashLimit as number, savingsAccounts[3].interestEarnedOnAmount(savingsAccounts[3].cashLimit as number))

import { CalculateInstallmentParams } from './interfaces.js';
import { MONTHS_PER_YEAR } from './constants.js';

export const getAnnualRate = () => Number(process.env.ANNUAL_RATE);

export const calculateInstallment = ({
  amount,
  months,
  annualRate,
}: CalculateInstallmentParams): number => {
  const monthlyRate = annualRate / MONTHS_PER_YEAR;
  const factor = (1 + monthlyRate) ** months;
  const installment = (amount * monthlyRate * factor) / (factor - 1);
  return Math.round(installment * 100) / 100;
};

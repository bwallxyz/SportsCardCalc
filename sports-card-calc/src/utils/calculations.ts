import type { Transaction, CalculatorResult } from '../types';

export const calculateFinalValueFee = (
  salePrice: number,
  shippingCharged: number,
  feeRate: number
): number => {
  const totalAmount = salePrice + shippingCharged;
  return totalAmount * feeRate;
};

export const calculatePaymentProcessingFee = (
  salePrice: number,
  shippingCharged: number,
  processingRate: number,
  fixedFee: number
): number => {
  const totalAmount = salePrice + shippingCharged;
  return (totalAmount * processingRate) + fixedFee;
};

export const calculateTransaction = (transaction: Transaction): CalculatorResult => {
  const totalRevenue = transaction.salePrice + transaction.shippingChargedToBuyer;
  
  const totalFees = 
    transaction.listingFee +
    transaction.salesFee +
    transaction.paymentProcessingFee +
    transaction.marketingFee;
  
  const totalCosts = 
    transaction.purchaseCost +
    transaction.actualShippingCost +
    transaction.packagingCost +
    transaction.otherExpenses +
    totalFees;
  
  const netProfit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const roi = transaction.purchaseCost > 0 ? (netProfit / transaction.purchaseCost) * 100 : 0;
  
  return {
    totalRevenue,
    totalCosts,
    totalFees,
    netProfit,
    profitMargin,
    roi
  };
};
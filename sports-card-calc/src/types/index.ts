export interface Transaction {
  id: string;
  platformName: string;
  itemDescription: string;
  salePrice: number;
  purchaseCost: number;
  shippingChargedToBuyer: number;
  actualShippingCost: number;
  packagingCost: number;
  listingFee: number;
  salesFee: number;
  paymentProcessingFee: number;
  marketingFee: number;
  otherExpenses: number;
}

export interface CalculatorResult {
  totalRevenue: number;
  totalCosts: number;
  totalFees: number;
  netProfit: number;
  profitMargin: number;
  roi: number;
}

export interface Platform {
  id: string;
  name: string;
  salesFeeRate: number;
  paymentProcessingFeeRate: number;
  paymentProcessingFixedFee: number;
  hasSubscription: boolean;
  subscriptionCost?: number;
}
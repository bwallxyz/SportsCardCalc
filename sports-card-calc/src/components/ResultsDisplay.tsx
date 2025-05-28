import React from 'react';
import type { CalculatorResult } from '../types';

interface ResultsDisplayProps {
  result: CalculatorResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const profitClass = result.netProfit >= 0 ? 'profit' : 'loss';

  return (
    <div className="results-display">
      <h2>📊 Transaction Results</h2>
      
      <div className="results-grid">
        <div className="result-item">
          <span className="label">Total Revenue:</span>
          <span className="value">{formatCurrency(result.totalRevenue)}</span>
        </div>
        
        <div className="result-item">
          <span className="label">Total Costs:</span>
          <span className="value">{formatCurrency(result.totalCosts)}</span>
        </div>
        
        <div className="result-item">
          <span className="label">Total Fees:</span>
          <span className="value fees">{formatCurrency(result.totalFees)}</span>
        </div>
        
        <div className={`result-item highlight ${profitClass}`}>
          <span className="label">{result.netProfit >= 0 ? '✅' : '❌'} Net Profit:</span>
          <span className="value">{formatCurrency(result.netProfit)}</span>
        </div>
        
        <div className="result-item">
          <span className="label">📈 Profit Margin:</span>
          <span className={`value ${profitClass}`}>{formatPercentage(result.profitMargin)}</span>
        </div>
        
        <div className="result-item">
          <span className="label">💹 ROI:</span>
          <span className={`value ${profitClass}`}>{formatPercentage(result.roi)}</span>
        </div>
      </div>
    </div>
  );
};
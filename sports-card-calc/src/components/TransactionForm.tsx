import React, { useState } from 'react';
import type { Transaction, Platform } from '../types';
import { calculateFinalValueFee, calculatePaymentProcessingFee } from '../utils/calculations';

interface TransactionFormProps {
  platforms: Platform[];
  onSubmit: (transaction: Transaction) => void;
  onOpenPlatformSettings: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ platforms, onSubmit, onOpenPlatformSettings }) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    platformName: platforms[0]?.name || '',
    itemDescription: '',
    salePrice: 0,
    purchaseCost: 0,
    shippingChargedToBuyer: 0,
    actualShippingCost: 0,
    packagingCost: 0,
    listingFee: 0.35,
    marketingFee: 0,
    otherExpenses: 0,
  });

  const selectedPlatform = platforms.find(p => p.name === formData.platformName);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = e.target.type === 'number' ? parseFloat(value) || 0 : value;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: numValue };
      
      if (selectedPlatform && (name === 'salePrice' || name === 'shippingChargedToBuyer')) {
        const salePrice = name === 'salePrice' ? numValue as number : prev.salePrice || 0;
        const shipping = name === 'shippingChargedToBuyer' ? numValue as number : prev.shippingChargedToBuyer || 0;
        
        updated.salesFee = calculateFinalValueFee(
          salePrice,
          shipping,
          selectedPlatform.salesFeeRate
        );
        
        updated.paymentProcessingFee = calculatePaymentProcessingFee(
          salePrice,
          shipping,
          selectedPlatform.paymentProcessingFeeRate,
          selectedPlatform.paymentProcessingFixedFee
        );
      }
      
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transaction: Transaction = {
      ...formData as Transaction,
      id: Date.now().toString(),
    };
    onSubmit(transaction);
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <div className="form-top-section">
        <div className="form-group">
          <label htmlFor="platformName">Platform:</label>
          <div className="input-with-button">
            <select
              id="platformName"
              name="platformName"
              value={formData.platformName}
              onChange={handleInputChange}
              required
            >
              {platforms.map(platform => (
                <option key={platform.id} value={platform.name}>{platform.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={onOpenPlatformSettings}
              className="settings-button"
              title="Manage Platforms"
            >
              ⚙️
            </button>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="itemDescription">Item Description:</label>
          <input
            type="text"
            id="itemDescription"
            name="itemDescription"
            value={formData.itemDescription}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="form-grid">
        <div className="form-section">
          <h3>Revenue</h3>
          <div className="form-group">
            <label htmlFor="salePrice">Sale Price ($):</label>
            <input
              type="number"
              id="salePrice"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="shippingChargedToBuyer">Shipping Charged ($):</label>
            <input
              type="number"
              id="shippingChargedToBuyer"
              name="shippingChargedToBuyer"
              value={formData.shippingChargedToBuyer}
              onChange={handleInputChange}
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Costs</h3>
          <div className="form-group">
            <label htmlFor="purchaseCost">Purchase Cost ($):</label>
            <input
              type="number"
              id="purchaseCost"
              name="purchaseCost"
              value={formData.purchaseCost}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="actualShippingCost">Shipping Cost ($):</label>
            <input
              type="number"
              id="actualShippingCost"
              name="actualShippingCost"
              value={formData.actualShippingCost}
              onChange={handleInputChange}
              step="0.01"
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="packagingCost">Packaging ($):</label>
            <input
              type="number"
              id="packagingCost"
              name="packagingCost"
              value={formData.packagingCost}
              onChange={handleInputChange}
              step="0.01"
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="otherExpenses">Other ($):</label>
            <input
              type="number"
              id="otherExpenses"
              name="otherExpenses"
              value={formData.otherExpenses}
              onChange={handleInputChange}
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="form-section fees-section">
          <h3>Platform Fees</h3>
          <div className="fees-input-grid">
            <div className="form-group">
              <label htmlFor="listingFee">Listing ($):</label>
              <input
                type="number"
                id="listingFee"
                name="listingFee"
                value={formData.listingFee}
                onChange={handleInputChange}
                step="0.01"
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="marketingFee">Marketing ($):</label>
              <input
                type="number"
                id="marketingFee"
                name="marketingFee"
                value={formData.marketingFee}
                onChange={handleInputChange}
                step="0.01"
                min="0"
              />
            </div>
          </div>
          
          <div className="calculated-fees">
            <div className="calculated-fee-item">
              <span className="fee-label">Sales Fee:</span>
              <span className="fee-value">${(formData.salesFee || 0).toFixed(2)}</span>
            </div>
            <div className="calculated-fee-item">
              <span className="fee-label">Processing:</span>
              <span className="fee-value">${(formData.paymentProcessingFee || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="form-section total-section">
          <h3>Summary</h3>
          <div className="total-breakdown">
            <div className="total-item">
              <span className="total-label">Total Revenue:</span>
              <span className="total-value">${((formData.salePrice || 0) + (formData.shippingChargedToBuyer || 0)).toFixed(2)}</span>
            </div>
            <div className="total-item">
              <span className="total-label">Total Costs:</span>
              <span className="total-value costs">${(
                (formData.purchaseCost || 0) + 
                (formData.actualShippingCost || 0) + 
                (formData.packagingCost || 0) + 
                (formData.otherExpenses || 0) +
                (formData.listingFee || 0) +
                (formData.marketingFee || 0) +
                (formData.salesFee || 0) +
                (formData.paymentProcessingFee || 0)
              ).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <button type="submit" className="submit-button">💰 Calculate Profit</button>
    </form>
  );
};
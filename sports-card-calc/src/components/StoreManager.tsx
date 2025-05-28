import React, { useState } from 'react';
import type { Platform } from '../types';

interface StoreManagerProps {
  platforms: Platform[];
  onAddPlatform: (platform: Platform) => void;
  onUpdatePlatform: (platform: Platform) => void;
  onDeletePlatform: (platformId: string) => void;
}

export const StoreManager: React.FC<StoreManagerProps> = ({ 
  platforms, 
  onAddPlatform, 
  onUpdatePlatform, 
  onDeletePlatform 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Platform>>({
    name: '',
    salesFeeRate: 0.10,
    paymentProcessingFeeRate: 0.029,
    paymentProcessingFixedFee: 0.30,
    hasSubscription: false,
    subscriptionCost: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let inputValue: any = value;
    
    if (type === 'checkbox') {
      inputValue = checked;
    } else if (type === 'number') {
      inputValue = parseFloat(value) || 0;
      // Convert percentage fields to decimal
      if (name === 'salesFeeRatePercent' || name === 'paymentProcessingFeeRatePercent') {
        const fieldName = name.replace('Percent', '');
        setFormData(prev => ({ ...prev, [fieldName]: inputValue / 100 }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: inputValue }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      salesFeeRate: 0.10,
      paymentProcessingFeeRate: 0.029,
      paymentProcessingFixedFee: 0.30,
      hasSubscription: false,
      subscriptionCost: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      onUpdatePlatform({ ...formData, id: editingId } as Platform);
      setEditingId(null);
    } else {
      onAddPlatform({ ...formData, id: Date.now().toString() } as Platform);
      setIsAdding(false);
    }
    
    resetForm();
  };

  const handleEdit = (platform: Platform) => {
    setFormData(platform);
    setEditingId(platform.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="store-manager">
      <h2>🏪 Platform Settings</h2>
      
      <div className="stores-list">
        {platforms.map(platform => (
          <div key={platform.id} className="store-item">
            <h3>{platform.name}</h3>
            <div className="store-details">
              <p>Sales Fee: {(platform.salesFeeRate * 100).toFixed(2)}%</p>
              <p>Payment Processing: {(platform.paymentProcessingFeeRate * 100).toFixed(2)}% + ${platform.paymentProcessingFixedFee}</p>
              {platform.hasSubscription && <p>Subscription: ${platform.subscriptionCost}/month</p>}
            </div>
            <div className="store-actions">
              <button onClick={() => handleEdit(platform)}>Edit</button>
              <button onClick={() => onDeletePlatform(platform.id)} className="delete-button">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {!isAdding && (
        <button onClick={() => setIsAdding(true)} className="add-store-button">
          Add New Platform
        </button>
      )}

      {isAdding && (
        <form onSubmit={handleSubmit} className="store-form">
          <h3>{editingId ? 'Edit Platform' : 'Add New Platform'}</h3>
          
          <div className="form-group">
            <label htmlFor="name">Platform Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="salesFeeRatePercent">Sales Fee Rate (%):</label>
            <input
              type="number"
              id="salesFeeRatePercent"
              name="salesFeeRatePercent"
              value={((formData.salesFeeRate || 0) * 100).toFixed(2)}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              max="100"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="paymentProcessingFeeRatePercent">Payment Processing Rate (%):</label>
            <input
              type="number"
              id="paymentProcessingFeeRatePercent"
              name="paymentProcessingFeeRatePercent"
              value={((formData.paymentProcessingFeeRate || 0) * 100).toFixed(2)}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              max="100"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="paymentProcessingFixedFee">Payment Processing Fixed Fee ($):</label>
            <input
              type="number"
              id="paymentProcessingFixedFee"
              name="paymentProcessingFixedFee"
              value={formData.paymentProcessingFixedFee || 0}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="hasSubscription"
                checked={formData.hasSubscription || false}
                onChange={handleInputChange}
              />
              Has Platform Subscription
            </label>
          </div>
          
          {formData.hasSubscription && (
            <div className="form-group">
              <label htmlFor="subscriptionCost">Subscription Cost ($/month):</label>
              <input
                type="number"
                id="subscriptionCost"
                name="subscriptionCost"
                value={formData.subscriptionCost || 0}
                onChange={handleInputChange}
                step="0.01"
                min="0"
              />
            </div>
          )}
          
          <div className="form-actions">
            <button type="submit">{editingId ? 'Update' : 'Add'} Platform</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};
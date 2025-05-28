import { useState, useEffect } from 'react';
import './App.css';
import type { Transaction, Platform, CalculatorResult } from './types';
import { calculateTransaction } from './utils/calculations';
import { TransactionForm } from './components/TransactionForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { StoreManager } from './components/StoreManager';

const DEFAULT_PLATFORMS: Platform[] = [
  {
    id: '1',
    name: 'eBay (Standard)',
    salesFeeRate: 0.1325,
    paymentProcessingFeeRate: 0.0299,
    paymentProcessingFixedFee: 0.49,
    hasSubscription: false,
  },
  {
    id: '2',
    name: 'eBay (Basic Store)',
    salesFeeRate: 0.1235,
    paymentProcessingFeeRate: 0.0299,
    paymentProcessingFixedFee: 0.49,
    hasSubscription: true,
    subscriptionCost: 7.95,
  },
  {
    id: '3',
    name: 'Generic Marketplace',
    salesFeeRate: 0.10,
    paymentProcessingFeeRate: 0.029,
    paymentProcessingFixedFee: 0.30,
    hasSubscription: false,
  },
];

function App() {
  const [platforms, setPlatforms] = useState<Platform[]>(() => {
    const saved = localStorage.getItem('platforms');
    return saved ? JSON.parse(saved) : DEFAULT_PLATFORMS;
  });
  
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showPlatformManager, setShowPlatformManager] = useState(false);

  useEffect(() => {
    localStorage.setItem('platforms', JSON.stringify(platforms));
  }, [platforms]);

  const handleTransactionSubmit = (transaction: Transaction) => {
    const calculationResult = calculateTransaction(transaction);
    setResult(calculationResult);
  };

  const handleAddPlatform = (platform: Platform) => {
    setPlatforms([...platforms, platform]);
  };

  const handleUpdatePlatform = (updatedPlatform: Platform) => {
    setPlatforms(platforms.map(platform => 
      platform.id === updatedPlatform.id ? updatedPlatform : platform
    ));
  };

  const handleDeletePlatform = (platformId: string) => {
    if (platforms.length > 1) {
      setPlatforms(platforms.filter(platform => platform.id !== platformId));
    } else {
      alert('You must have at least one platform configured.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>💰 Profit Calculator</h1>
        <p>Calculate your transaction profitability including all fees and expenses</p>
      </header>

      <main>
        <div className="main-content">

          <div className="content-wrapper">
            {result && (
              <div className="results-container">
                <ResultsDisplay result={result} />
              </div>
            )}

            <div className="calculator-container">
              <TransactionForm 
                platforms={platforms} 
                onSubmit={handleTransactionSubmit}
                onOpenPlatformSettings={() => setShowPlatformManager(true)}
              />
            </div>
          </div>
        </div>
      </main>

      {showPlatformManager && (
        <div className="modal-overlay" onClick={() => setShowPlatformManager(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={() => setShowPlatformManager(false)}
              aria-label="Close"
            >
              ×
            </button>
            <StoreManager
              platforms={platforms}
              onAddPlatform={handleAddPlatform}
              onUpdatePlatform={handleUpdatePlatform}
              onDeletePlatform={handleDeletePlatform}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

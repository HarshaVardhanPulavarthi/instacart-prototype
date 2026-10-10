import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Mandate, BasketItem, DecisionLog, Product } from '../decisionEngine';
import { defaultMandate, defaultBasket } from '../mockData';
import { evaluateSubstitution as evaluateSubstitutionLogic } from '../decisionEngine';

type TransactionStatus = 'DRAFT' | 'VALIDATING' | 'AWAITING_APPROVAL' | 'READY_TO_SUBMIT' | 'SUBMITTED' | 'PENDING_VERIFICATION' | 'CONFIRMED' | 'FAILED' | 'BLOCKED';

interface ShoppingContextType {
  mandate: Mandate;
  updateMandate: (updates: Partial<Mandate>) => void;
  basket: BasketItem[];
  updateBasket: (items: BasketItem[]) => void;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  changeQuantity: (id: string, quantity: number) => void;
  markUnavailable: (id: string, candidate?: Product) => void;
  resolveAsk: (id: string, approved: boolean) => void;
  logs: DecisionLog[];
  addLog: (log: DecisionLog) => void;
  transactionStatus: TransactionStatus;
  setTransactionStatus: (status: TransactionStatus) => void;
  basketTotal: number;
  resetSimulation: () => void;
  activeScenarioStep: number;
  setActiveScenarioStep: (step: number) => void;
  setupScenario: (mandateUpdates: Partial<Mandate>, basketUpdates: BasketItem[]) => void;
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);

export const ShoppingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mandate, setMandate] = useState<Mandate>(defaultMandate);
  const [basket, setBasket] = useState<BasketItem[]>(defaultBasket);
  const [logs, setLogs] = useState<DecisionLog[]>([]);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('DRAFT');
  const [activeScenarioStep, setActiveScenarioStep] = useState<number>(0);

  const updateMandate = (updates: Partial<Mandate>) => {
    setMandate((prev) => ({ ...prev, ...updates }));
  };

  const updateBasket = (items: BasketItem[]) => {
    setBasket(items);
  };

  const addItem = (product: Product) => {
    setBasket(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: `b_${Date.now()}`, product, quantity: 1, isUnavailable: false, status: 'pending' }];
    });
  };

  const removeItem = (id: string) => {
    setBasket(prev => prev.filter(item => item.id !== id));
  };

  const changeQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setBasket(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const markUnavailable = (id: string, candidate?: Product) => {
    setBasket(prev => prev.map(item => {
      if (item.id === id) {
        if (candidate) {
          const log = evaluateSubstitutionLogic(mandate, item.product, candidate);
          addLog(log);
          return { 
            ...item, 
            isUnavailable: true, 
            replacement: candidate, 
            status: log.decision.toLowerCase() as BasketItem['status'],
            decisionLog: log
          };
        }
        return { ...item, isUnavailable: true, status: 'pending' };
      }
      return item;
    }));
  };

  const resolveAsk = (id: string, approved: boolean) => {
    setBasket(prev => prev.map(item => {
      if (item.id === id && item.status === 'ask') {
        const resolutionLog: DecisionLog = {
          action: `User ${approved ? 'approved' : 'rejected'} substitution for ${item.product.name}`,
          decision: approved ? 'ACT' : 'STOP',
          checks: [{ name: "User Override", passed: approved, details: approved ? "User explicitly approved." : "User explicitly rejected."}],
          reason: approved ? "User explicitly approved the pending action." : "User explicitly rejected the pending action.",
          timestamp: Date.now()
        };
        addLog(resolutionLog);
        return { ...item, status: approved ? 'approved' : 'rejected' };
      }
      return item;
    }));
  };

  const addLog = (log: DecisionLog) => {
    setLogs(prev => [log, ...prev]);
  };

  const resetSimulation = () => {
    setMandate(defaultMandate);
    setBasket(defaultBasket);
    setLogs([]);
    setTransactionStatus('DRAFT');
    setActiveScenarioStep(0);
  };

  const setupScenario = (mandateUpdates: Partial<Mandate>, basketUpdates: BasketItem[]) => {
    setMandate({ ...defaultMandate, ...mandateUpdates });
    setBasket(basketUpdates);
    setLogs([]);
    setTransactionStatus('DRAFT');
    setActiveScenarioStep(0);
  };

  const basketTotal = basket.reduce((total, item) => {
    if (item.status === 'stop' || item.status === 'rejected') return total; // Exclude rejected/blocked items
    if (item.isUnavailable && !item.replacement) return total; // Exclude pending stockouts with no candidate
    if (item.isUnavailable && item.replacement && item.status !== 'ask') {
       return total + (item.replacement.price * item.quantity);
    }
    if (item.status === 'ask') return total; // Don't count pending asks towards current total until approved
    
    return total + (item.product.price * item.quantity);
  }, 0);

  return (
    <ShoppingContext.Provider
      value={{
        mandate,
        updateMandate,
        basket,
        updateBasket,
        addItem,
        removeItem,
        changeQuantity,
        markUnavailable,
        resolveAsk,
        logs,
        addLog,
        transactionStatus,
        setTransactionStatus,
        basketTotal,
        resetSimulation,
        activeScenarioStep,
        setActiveScenarioStep,
        setupScenario,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  );
};

export const useShopping = () => {
  const context = useContext(ShoppingContext);
  if (context === undefined) {
    throw new Error('useShopping must be used within a ShoppingProvider');
  }
  return context;
};

import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Car, Home, DollarSign, AlertCircle } from 'lucide-react';
import { Debt, SavingsGoal } from '../types';

// --- DEBT CALCULATOR COMPONENT ---

interface DebtCalcProps {
  onAddDebt: (debt: Debt) => void;
}

export const DebtCalculator: React.FC<DebtCalcProps> = ({ onAddDebt }) => {
  const [debt, setDebt] = useState<Partial<Debt>>({
    name: '',
    totalAmount: 0,
    interestRate: 0,
    monthlyPayment: 0
  });

  const monthsToPayOff = useMemo(() => {
    if (!debt.totalAmount || !debt.monthlyPayment || debt.monthlyPayment <= 0) return 0;
    
    // Simplified formula: N = -log(1 - (r * P) / A) / log(1 + r)
    // where r = monthly rate, P = principal, A = monthly payment
    const r = (debt.interestRate || 0) / 100 / 12;
    const P = debt.totalAmount;
    const A = debt.monthlyPayment;

    if (r * P >= A) return Infinity; // Interest eats payment

    if (r === 0) return P / A;

    const n = -Math.log(1 - (r * P) / A) / Math.log(1 + r);
    return Math.ceil(n);
  }, [debt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debt.name && debt.totalAmount && debt.monthlyPayment) {
      onAddDebt({
        id: Date.now().toString(),
        name: debt.name,
        totalAmount: debt.totalAmount,
        interestRate: debt.interestRate || 0,
        monthlyPayment: debt.monthlyPayment
      });
      setDebt({ name: '', totalAmount: 0, interestRate: 0, monthlyPayment: 0 });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-mx-red" />
        Calculadora de Deuda
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Nombre de la deuda</label>
          <input 
            type="text" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mx-green focus:ring focus:ring-mx-green/20 p-2 border"
            placeholder="Ej. Tarjeta de Crédito BBVA"
            value={debt.name}
            onChange={e => setDebt({...debt, name: e.target.value})}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Monto Total ($)</label>
            <input 
              type="number" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mx-green focus:ring focus:ring-mx-green/20 p-2 border"
              value={debt.totalAmount || ''}
              onChange={e => setDebt({...debt, totalAmount: Number(e.target.value)})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Tasa Anual (%)</label>
            <input 
              type="number" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mx-green focus:ring focus:ring-mx-green/20 p-2 border"
              value={debt.interestRate || ''}
              onChange={e => setDebt({...debt, interestRate: Number(e.target.value)})}
            />
          </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-600">Pago Mensual ($)</label>
            <input 
              type="number" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mx-green focus:ring focus:ring-mx-green/20 p-2 border"
              value={debt.monthlyPayment || ''}
              onChange={e => setDebt({...debt, monthlyPayment: Number(e.target.value)})}
              required
            />
        </div>

        {monthsToPayOff > 0 && monthsToPayOff !== Infinity && (
           <div className="bg-blue-50 p-3 rounded-lg text-blue-800 text-sm flex items-start gap-2">
             <TrendingUp className="w-4 h-4 mt-1" />
             <div>
               Serás libre de esta deuda en aproximadamente <strong>{monthsToPayOff} meses</strong> ({Math.floor(monthsToPayOff/12)} años y {monthsToPayOff%12} meses).
             </div>
           </div>
        )}
        
        {monthsToPayOff === Infinity && (
            <div className="bg-red-50 p-3 rounded-lg text-red-800 text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-1" />
                <div>
                    Tu pago mensual no cubre los intereses. La deuda crecerá infinitamente. ¡Aumenta tu pago!
                </div>
            </div>
        )}

        <button type="submit" className="w-full bg-mx-red hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors">
          Agregar Deuda al Plan
        </button>
      </form>
    </div>
  );
};

// --- SAVINGS GOAL COMPONENT ---

interface GoalProps {
    onAddGoal: (goal: SavingsGoal) => void;
}

export const SavingsGoalCalculator: React.FC<GoalProps> = ({ onAddGoal }) => {
    const [goal, setGoal] = useState<Partial<SavingsGoal>>({
        name: '',
        targetAmount: 0,
        currentAmount: 0,
        monthlyContribution: 0,
        icon: 'car'
    });

    const monthsToGoal = useMemo(() => {
        if (!goal.targetAmount || !goal.monthlyContribution || goal.monthlyContribution <= 0) return 0;
        const remaining = goal.targetAmount - (goal.currentAmount || 0);
        if (remaining <= 0) return 0;
        return Math.ceil(remaining / goal.monthlyContribution);
    }, [goal]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (goal.name && goal.targetAmount && goal.monthlyContribution) {
            onAddGoal({
                id: Date.now().toString(),
                name: goal.name,
                targetAmount: goal.targetAmount,
                currentAmount: goal.currentAmount || 0,
                monthlyContribution: goal.monthlyContribution
            });
            setGoal({ name: '', targetAmount: 0, currentAmount: 0, monthlyContribution: 0, icon: 'car' });
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-mx-green" />
                Simulador de Ahorro
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-600">Meta</label>
                        <input 
                            type="text" 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mx-green focus:ring focus:ring-mx-green/20 p-2 border"
                            placeholder="Ej. Auto Nuevo"
                            value={goal.name}
                            onChange={e => setGoal({...goal, name: e.target.value})}
                            required
                        />
                    </div>
                    <div className="w-1/3">
                        <label className="block text-sm font-medium text-gray-600">Tipo</label>
                        <select 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mx-green focus:ring focus:ring-mx-green/20 p-2 border"
                            value={goal.icon}
                            onChange={e => setGoal({...goal, icon: e.target.value})}
                        >
                            <option value="car">Auto</option>
                            <option value="house">Casa</option>
                            <option value="vacation">Viaje</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Costo Total ($)</label>
                        <input 
                            type="number" 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mx-green focus:ring focus:ring-mx-green/20 p-2 border"
                            value={goal.targetAmount || ''}
                            onChange={e => setGoal({...goal, targetAmount: Number(e.target.value)})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Ahorrado ($)</label>
                        <input 
                            type="number" 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mx-green focus:ring focus:ring-mx-green/20 p-2 border"
                            value={goal.currentAmount || ''}
                            onChange={e => setGoal({...goal, currentAmount: Number(e.target.value)})}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Ahorro Mensual ($)</label>
                    <input 
                        type="number" 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-mx-green focus:ring focus:ring-mx-green/20 p-2 border"
                        value={goal.monthlyContribution || ''}
                        onChange={e => setGoal({...goal, monthlyContribution: Number(e.target.value)})}
                        required
                    />
                </div>

                {monthsToGoal > 0 && (
                    <div className="bg-green-50 p-3 rounded-lg text-green-800 text-sm flex items-start gap-2">
                        {goal.icon === 'house' ? <Home className="w-4 h-4 mt-1" /> : <Car className="w-4 h-4 mt-1" />}
                        <div>
                            Alcanzarás tu meta en <strong>{monthsToGoal} meses</strong>. 
                            {monthsToGoal > 12 && ` (~${(monthsToGoal/12).toFixed(1)} años)`}
                        </div>
                    </div>
                )}

                <button type="submit" className="w-full bg-mx-green hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors">
                    Guardar Meta
                </button>
            </form>
        </div>
    )
}

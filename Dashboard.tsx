import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Wallet, TrendingDown, Target, MessageSquare, LogOut, Plus, X, ArrowUpCircle, ArrowDownCircle, Clock, Car, Home, Plane, Download, Sparkles } from 'lucide-react';
import { UserProfile, Transaction, Debt, SavingsGoal, ViewState } from '../types';
import { ExpensePieChart, BalanceBarChart } from './FinancialCharts';
import { DebtCalculator, SavingsGoalCalculator } from './Tools';
import { getFinancialAdvice } from '../services/geminiService';

interface Props {
  user: UserProfile;
  onLogout: () => void;
}

export const Dashboard: React.FC<Props> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'resumen' | 'deudas' | 'metas' | 'asesor'>('resumen');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  
  // Transaction Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTxType, setCurrentTxType] = useState<'income' | 'expense'>('income');
  const [txForm, setTxForm] = useState({
    amount: '',
    description: '',
    category: 'Ingreso',
    date: new Date().toISOString().split('T')[0]
  });
  
  // AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: `¡Hola ${user.name}! Soy tu asesor financiero personal. ¿En qué puedo ayudarte hoy? Puedo analizar tus gastos o darte tips para ahorrar en México.`}
  ]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const handleAddDebt = (newDebt: Debt) => {
    setDebts([...debts, newDebt]);
  };

  const handleAddGoal = (newGoal: SavingsGoal) => {
    setGoals([...goals, newGoal]);
  };

  const openModal = (type: 'income' | 'expense') => {
    setCurrentTxType(type);
    setTxForm({
        amount: '',
        description: '',
        category: type === 'income' ? 'Ingreso' : 'Alimentos',
        date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
      e.preventDefault();
      if (!txForm.amount || !txForm.description) return;

      const newTx: Transaction = {
          id: Date.now().toString(),
          description: txForm.description,
          amount: parseFloat(txForm.amount),
          date: txForm.date,
          category: txForm.category as any,
          type: currentTxType
      };

      setTransactions(prev => [newTx, ...prev]);
      setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
        alert("No hay transacciones para exportar.");
        return;
    }

    // CSV Headers
    const headers = ["ID", "Descripción", "Monto", "Fecha", "Categoría", "Tipo"];
    
    // Map transactions to rows
    const rows = transactions.map(t => [
        t.id,
        `"${t.description.replace(/"/g, '""')}"`, // Escape quotes in description
        t.amount,
        t.date,
        t.category,
        t.type === 'income' ? 'Ingreso' : 'Gasto'
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(r => r.join(','))
    ].join('\n');

    // Create Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `finanzas_mx_transacciones_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendMessage = async (manualMessage?: string) => {
    const userMsg = manualMessage || chatInput;
    if (!userMsg.trim()) return;
    
    if (!manualMessage) setChatInput('');
    
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoadingAi(true);

    const advice = await getFinancialAdvice(userMsg, {
        transactions,
        debts,
        goals,
        income: user.monthlyIncome
    });

    setChatHistory(prev => [...prev, { role: 'ai', text: advice }]);
    setIsLoadingAi(false);
  };

  const handleOptimizeFinances = () => {
      const prompt = "Analiza mis transacciones recientes, deudas y metas. Identifica oportunidades de ahorro (gastos hormiga, suscripciones), sugiere qué deuda atacar primero (Bola de Nieve vs Avalancha) y dame 3 acciones concretas para mejorar mi salud financiera este mes en el contexto de México.";
      handleSendMessage(prompt);
  };

  const totalBalance = transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-slate-850 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold tracking-tight text-white"><span className="text-mx-green">Finanzas</span>MX</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('resumen')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'resumen' ? 'bg-mx-green text-white' : 'hover:bg-slate-700 text-gray-300'}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Resumen
          </button>
          <button 
             onClick={() => setActiveTab('deudas')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'deudas' ? 'bg-mx-green text-white' : 'hover:bg-slate-700 text-gray-300'}`}
          >
            <TrendingDown className="w-5 h-5 mr-3" />
            Deudas
          </button>
          <button 
             onClick={() => setActiveTab('metas')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'metas' ? 'bg-mx-green text-white' : 'hover:bg-slate-700 text-gray-300'}`}
          >
            <Target className="w-5 h-5 mr-3" />
            Metas
          </button>
          <button 
             onClick={() => setActiveTab('asesor')}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'asesor' ? 'bg-mx-green text-white' : 'hover:bg-slate-700 text-gray-300'}`}
          >
            <MessageSquare className="w-5 h-5 mr-3" />
            Asesor IA
          </button>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button onClick={onLogout} className="flex items-center w-full px-4 py-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative pb-24 md:pb-0">
        <header className="bg-white shadow-sm p-6 flex justify-between items-center md:hidden">
            <h1 className="text-xl font-bold text-gray-800">FinanzasMX</h1>
            <button className="text-gray-600"><LogOut onClick={onLogout} className="w-6 h-6"/></button>
        </header>
        
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          
          {/* RESUMEN TAB */}
          {activeTab === 'resumen' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                   <h2 className="text-3xl font-bold text-gray-900">Hola, {user.name} 👋</h2>
                   <p className="text-gray-500">Aquí está el resumen de tus finanzas este mes.</p>
                </div>
                <div className="flex flex-col items-end gap-4">
                    <div className="flex flex-wrap gap-3 justify-end">
                         <button 
                            onClick={handleExportCSV}
                            className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium"
                            title="Exportar a CSV"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            <span className="hidden sm:inline">Exportar</span>
                        </button>
                        <button 
                            onClick={() => openModal('income')}
                            className="flex items-center px-4 py-2 bg-mx-green text-white rounded-lg hover:bg-green-800 transition-colors shadow-sm font-medium"
                        >
                            <ArrowUpCircle className="w-5 h-5 mr-2" />
                            <span className="hidden sm:inline">Registrar</span> Ingreso
                        </button>
                        <button 
                             onClick={() => openModal('expense')}
                            className="flex items-center px-4 py-2 bg-mx-red text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm font-medium"
                        >
                            <ArrowDownCircle className="w-5 h-5 mr-2" />
                             <span className="hidden sm:inline">Registrar</span> Gasto
                        </button>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 uppercase font-semibold">Balance Total</p>
                        <p className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-mx-green' : 'text-mx-red'}`}>
                            ${totalBalance.toLocaleString()} MXN
                        </p>
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Card 1 */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Gastos por Categoría</h3>
                    <ExpensePieChart transactions={transactions} />
                    {transactions.filter(t => t.type === 'expense').length === 0 && (
                        <p className="text-center text-sm text-gray-400 mt-4">Aún no tienes gastos registrados.</p>
                    )}
                 </div>
                 {/* Card 2 */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Ingresos vs Gastos</h3>
                    <BalanceBarChart transactions={transactions} />
                    {transactions.length === 0 && (
                        <p className="text-center text-sm text-gray-400 mt-4">Registra tu primer movimiento para ver la gráfica.</p>
                    )}
                 </div>
                 {/* Recent Transactions List */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Movimientos Recientes</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {transactions.length === 0 ? (
                            <p className="text-center text-gray-400 py-4">No hay movimientos recientes.</p>
                        ) : (
                            transactions.slice(0, 8).map(t => (
                                <div key={t.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="font-medium text-gray-800">{t.description}</p>
                                        <p className="text-xs text-gray-400">{t.date} • {t.category}</p>
                                    </div>
                                    <span className={`font-semibold ${t.type === 'income' ? 'text-mx-green' : 'text-gray-800'}`}>
                                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* DEUDAS TAB */}
          {activeTab === 'deudas' && (
             <div className="space-y-6">
                 <h2 className="text-2xl font-bold text-gray-900">Planificador de Deudas</h2>
                 <p className="text-gray-600 max-w-2xl">Utiliza el método de "Bola de Nieve" o visualiza cuándo serás libre de deudas. Ingresa tus datos reales.</p>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <DebtCalculator onAddDebt={handleAddDebt} />
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Tus Deudas Actuales</h3>
                        {debts.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                No has agregado deudas aún.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {debts.map(d => (
                                    <div key={d.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-gray-800">{d.name}</h4>
                                                <p className="text-sm text-gray-500">Tasa: {d.interestRate}% anual</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-mx-red">${d.totalAmount.toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">Pago: ${d.monthlyPayment}/mes</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                 </div>
             </div>
          )}

          {/* METAS TAB */}
          {activeTab === 'metas' && (
             <div className="space-y-6">
                 <h2 className="text-2xl font-bold text-gray-900">Metas de Ahorro</h2>
                 <p className="text-gray-600">Visualiza tu progreso para ese auto nuevo, tu casa o tus vacaciones soñadas.</p>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SavingsGoalCalculator onAddGoal={handleAddGoal} />

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Tus Metas</h3>
                         {goals.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                No tienes metas activas.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {goals.map(g => {
                                    const percent = Math.min(100, (g.currentAmount / g.targetAmount) * 100);
                                    const remaining = Math.max(0, g.targetAmount - g.currentAmount);
                                    const monthsToGoal = g.monthlyContribution > 0 ? Math.ceil(remaining / g.monthlyContribution) : 0;
                                    const yearsToGoal = (monthsToGoal / 12).toFixed(1);

                                    return (
                                        <div key={g.id} className="p-4 border border-gray-200 rounded-lg hover:border-mx-green transition-colors bg-white">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                                                        {g.icon === 'house' ? <Home className="w-5 h-5" /> : g.icon === 'vacation' ? <Plane className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 leading-tight">{g.name}</h4>
                                                        <p className="text-xs text-gray-500">Objetivo: ${g.targetAmount.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-lg font-bold text-mx-green">{percent.toFixed(0)}%</span>
                                                </div>
                                            </div>
                                            
                                            <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                                                <div className="bg-mx-green h-2 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                                            </div>
                                            
                                            <div className="flex justify-between text-xs text-gray-500 mb-3">
                                                <span>${g.currentAmount.toLocaleString()} ahorrados</span>
                                                <span>Faltan ${remaining.toLocaleString()}</span>
                                            </div>

                                            {monthsToGoal > 0 ? (
                                                <div className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-md border border-slate-100">
                                                    <Clock className="w-3.5 h-3.5 mt-0.5 text-mx-gold" />
                                                    <span>
                                                        Tiempo estimado: <strong className="text-slate-900">{monthsToGoal} meses</strong> {monthsToGoal > 12 && `(~${yearsToGoal} años)`}
                                                        <span className="block text-gray-500 text-[10px] mt-0.5">Ahorrando ${g.monthlyContribution.toLocaleString()}/mes</span>
                                                    </span>
                                                </div>
                                            ) : (
                                                 <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-md">
                                                    <Clock className="w-3.5 h-3.5 mt-0.5" />
                                                    <span>Completa o sin contribución mensual</span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                 </div>
             </div>
          )}

          {/* ASESOR IA TAB */}
          {activeTab === 'asesor' && (
             <div className="h-[70vh] md:h-[80vh] flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-mx-green p-4 flex items-center text-white justify-between">
                    <div className="flex items-center">
                        <MessageSquare className="w-6 h-6 mr-2" />
                        <div>
                            <h3 className="font-bold">Asesor Financiero IA</h3>
                            <p className="text-xs text-green-100">Potenciado por Gemini 2.5</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-mx-green text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'}`}>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoadingAi && (
                        <div className="flex justify-start">
                             <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none shadow-sm">
                                <span className="flex gap-1">
                                    <span className="animate-bounce">.</span>
                                    <span className="animate-bounce delay-100">.</span>
                                    <span className="animate-bounce delay-200">.</span>
                                </span>
                             </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-white border-t border-gray-200">
                    {/* Quick Actions Toolbar */}
                    <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
                        <button 
                            onClick={handleOptimizeFinances}
                            disabled={isLoadingAi}
                            className="flex items-center whitespace-nowrap px-3 py-1.5 bg-green-50 text-mx-green text-xs font-semibold rounded-full hover:bg-green-100 border border-green-100 transition-colors"
                        >
                            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                            Sugerir Optimizaciones
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <input 
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Pregunta..."
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-mx-green focus:ring-1 focus:ring-mx-green"
                        />
                        <button 
                            onClick={() => handleSendMessage()}
                            disabled={isLoadingAi || !chatInput.trim()}
                            className="bg-mx-green text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
                        >
                            Enviar
                        </button>
                    </div>
                </div>
             </div>
          )}

        </div>

        {/* Transaction Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className={`p-4 flex justify-between items-center ${currentTxType === 'income' ? 'bg-mx-green' : 'bg-mx-red'} text-white`}>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            {currentTxType === 'income' ? <ArrowUpCircle className="w-5 h-5"/> : <ArrowDownCircle className="w-5 h-5"/>}
                            {currentTxType === 'income' ? 'Registrar Ingreso' : 'Registrar Gasto'}
                        </h3>
                        <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                    </div>
                    <form onSubmit={handleSaveTransaction} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($)</label>
                            <input 
                                type="number" 
                                required
                                min="0"
                                step="0.01"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-mx-green focus:border-transparent outline-none transition-shadow"
                                placeholder="0.00"
                                value={txForm.amount}
                                onChange={e => setTxForm({...txForm, amount: e.target.value})}
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <input 
                                type="text" 
                                required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-mx-green focus:border-transparent outline-none transition-shadow"
                                placeholder={currentTxType === 'income' ? "Ej. Bono anual" : "Ej. Tacos de la esquina"}
                                value={txForm.description}
                                onChange={e => setTxForm({...txForm, description: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                                <input 
                                    type="date" 
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-mx-green focus:border-transparent outline-none transition-shadow"
                                    value={txForm.date}
                                    onChange={e => setTxForm({...txForm, date: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                <select 
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-mx-green focus:border-transparent outline-none transition-shadow"
                                    value={txForm.category}
                                    onChange={e => setTxForm({...txForm, category: e.target.value})}
                                >
                                    {currentTxType === 'income' ? (
                                        <option value="Ingreso">Ingreso</option>
                                    ) : (
                                        <>
                                            <option value="Alimentos">Alimentos</option>
                                            <option value="Transporte">Transporte</option>
                                            <option value="Hogar">Hogar</option>
                                            <option value="Entretenimiento">Entretenimiento</option>
                                            <option value="Salud">Salud</option>
                                            <option value="Deuda">Deuda</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>
                        <button 
                            type="submit"
                            className={`w-full py-3 rounded-lg font-bold text-white transition-colors shadow-md ${currentTxType === 'income' ? 'bg-mx-green hover:bg-green-800' : 'bg-mx-red hover:bg-red-700'}`}
                        >
                            Guardar {currentTxType === 'income' ? 'Ingreso' : 'Gasto'}
                        </button>
                    </form>
                </div>
            </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center p-2 z-40 pb-4">
        <button 
            onClick={() => setActiveTab('resumen')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'resumen' ? 'text-mx-green' : 'text-gray-400'}`}
        >
            <LayoutDashboard className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Resumen</span>
        </button>
        <button 
            onClick={() => setActiveTab('deudas')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'deudas' ? 'text-mx-green' : 'text-gray-400'}`}
        >
            <TrendingDown className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Deudas</span>
        </button>
        <button 
            onClick={() => setActiveTab('metas')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'metas' ? 'text-mx-green' : 'text-gray-400'}`}
        >
            <Target className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Metas</span>
        </button>
        <button 
            onClick={() => setActiveTab('asesor')}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${activeTab === 'asesor' ? 'text-mx-green' : 'text-gray-400'}`}
        >
            <MessageSquare className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Asesor IA</span>
        </button>
      </nav>
    </div>
  );
};